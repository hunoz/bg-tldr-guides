/// Rich text parser that converts HTML-like tags in translation strings
/// into a tree of [InlineSpan] nodes for Flutter rendering.
///
/// Supported tags: `<strong>`, `<em>`, `<br>`, `<br/>`, `<span>`,
/// `<span className='...'>`.
///

/// Base type for inline content spans produced by the rich text parser.
sealed class InlineSpan {
  const InlineSpan();
}

/// A plain text segment with no styling.
class RichTextSpan extends InlineSpan {
  final String text;
  const RichTextSpan(this.text);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RichTextSpan && other.text == text;

  @override
  int get hashCode => text.hashCode;

  @override
  String toString() => 'RichTextSpan("$text")';
}

/// A styled segment wrapping child spans. [tag] is the HTML tag name
/// (e.g. "strong", "em", "span"). [className] captures the optional
/// `className='...'` attribute from `<span>` tags.
class StyledSpan extends InlineSpan {
  final String tag;
  final String? className;
  final List<InlineSpan> children;

  const StyledSpan(this.tag, this.children, {this.className});

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StyledSpan &&
          other.tag == tag &&
          other.className == className &&
          _listEquals(other.children, children);

  @override
  int get hashCode => Object.hash(tag, className, children.length);

  @override
  String toString() =>
      'StyledSpan("$tag", $children${className != null ? ', className: "$className"' : ''})';
}

/// A line break (`<br>` or `<br/>`).
class LineBreakSpan extends InlineSpan {
  const LineBreakSpan();

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is LineBreakSpan;

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  String toString() => 'LineBreakSpan()';
}

bool _listEquals(List<InlineSpan> a, List<InlineSpan> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

/// The set of tag names that wrap child content.
const _pairedTags = {'strong', 'em', 'span'};

/// Regex matching an opening tag, self-closing `<br/>`, or closing tag.
///
/// Groups:
///   1 = closing slash (present for `</tag>`)
///   2 = tag name
///   3 = attribute string (e.g. ` className='qk-token qk-token-orange'`)
///   4 = self-closing slash (present for `<br/>`)
final _tagPattern = RegExp(
  r"<(/?)(\w+)((?:\s+\w+='[^']*')*)\s*(\/?)>",
);

/// Parse a translation string containing HTML-like tags into a list of
/// [InlineSpan] nodes.
///
/// Handles nesting via a stack. Unrecognised tags are emitted as literal text.
/// Malformed nesting (e.g. `<strong>...<em>...</strong>`) is handled
/// gracefully by treating the mismatched close tag as literal text.
List<InlineSpan> parseRichText(String input) {
  if (input.isEmpty) return const [];

  final spans = <InlineSpan>[];
  // Stack of (tag, className, children-so-far) for open paired tags.
  final stack = <_OpenTag>[];

  var pos = 0;

  for (final match in _tagPattern.allMatches(input)) {
    // Emit any plain text before this tag.
    if (match.start > pos) {
      _addText(stack, spans, input.substring(pos, match.start));
    }
    pos = match.end;

    final isClosing = match.group(1) == '/';
    final tagName = match.group(2)!.toLowerCase();
    final attrString = match.group(3) ?? '';
    final isSelfClosing = match.group(4) == '/';

    // Handle <br> and <br/>.
    if (tagName == 'br') {
      _addSpan(stack, spans, const LineBreakSpan());
      continue;
    }

    if (!_pairedTags.contains(tagName)) {
      // Unknown tag — emit as literal text.
      _addText(stack, spans, match.group(0)!);
      continue;
    }

    if (isClosing) {
      // Closing tag — pop the stack if it matches.
      if (stack.isNotEmpty && stack.last.tag == tagName) {
        final open = stack.removeLast();
        final styled = StyledSpan(
          open.tag,
          open.children,
          className: open.className,
        );
        _addSpan(stack, spans, styled);
      } else {
        // Mismatched close — emit as literal text.
        _addText(stack, spans, match.group(0)!);
      }
    } else if (!isSelfClosing) {
      // Opening paired tag — push onto stack.
      final className = _extractClassName(attrString);
      stack.add(_OpenTag(tagName, className));
    }
  }

  // Emit any trailing text after the last tag.
  if (pos < input.length) {
    _addText(stack, spans, input.substring(pos));
  }

  // Flush any unclosed tags as literal text + their children.
  while (stack.isNotEmpty) {
    final open = stack.removeLast();
    final literal = _reconstructOpenTag(open);
    final flushed = <InlineSpan>[RichTextSpan(literal), ...open.children];
    if (stack.isNotEmpty) {
      stack.last.children.addAll(flushed);
    } else {
      spans.addAll(flushed);
    }
  }

  return _mergeAdjacentText(spans);
}

/// Serialize an [InlineSpan] tree back to its HTML-like string form.
///
/// Useful for round-trip testing (Property 7).
String serializeSpans(List<InlineSpan> spans) {
  final buf = StringBuffer();
  for (final span in spans) {
    _serializeSpan(buf, span);
  }
  return buf.toString();
}

void _serializeSpan(StringBuffer buf, InlineSpan span) {
  switch (span) {
    case RichTextSpan(:final text):
      buf.write(text);
    case LineBreakSpan():
      buf.write('<br/>');
    case StyledSpan(:final tag, :final className, :final children):
      buf.write('<$tag');
      if (className != null) {
        buf.write(" className='$className'");
      }
      buf.write('>');
      for (final child in children) {
        _serializeSpan(buf, child);
      }
      buf.write('</$tag>');
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

class _OpenTag {
  final String tag;
  final String? className;
  final List<InlineSpan> children = [];

  _OpenTag(this.tag, this.className);
}

void _addSpan(
  List<_OpenTag> stack,
  List<InlineSpan> topLevel,
  InlineSpan span,
) {
  if (stack.isNotEmpty) {
    stack.last.children.add(span);
  } else {
    topLevel.add(span);
  }
}

void _addText(
  List<_OpenTag> stack,
  List<InlineSpan> topLevel,
  String text,
) {
  if (text.isEmpty) return;
  _addSpan(stack, topLevel, RichTextSpan(text));
}

/// Extract the `className` value from an attribute string like
/// ` className='qk-token qk-token-orange'`.
String? _extractClassName(String attrString) {
  if (attrString.isEmpty) return null;
  final match = RegExp(r"className='([^']*)'").firstMatch(attrString);
  return match?.group(1);
}

String _reconstructOpenTag(_OpenTag open) {
  final buf = StringBuffer('<${open.tag}');
  if (open.className != null) {
    buf.write(" className='${open.className}'");
  }
  buf.write('>');
  return buf.toString();
}

/// Merge adjacent [RichTextSpan] nodes into single spans.
List<InlineSpan> _mergeAdjacentText(List<InlineSpan> spans) {
  if (spans.length <= 1) return spans;
  final result = <InlineSpan>[];
  for (final span in spans) {
    if (span is RichTextSpan &&
        result.isNotEmpty &&
        result.last is RichTextSpan) {
      final prev = result.removeLast() as RichTextSpan;
      result.add(RichTextSpan(prev.text + span.text));
    } else {
      result.add(span);
    }
  }
  return result;
}
