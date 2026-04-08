import 'package:flutter/widgets.dart';

import '../i18n/rich_text_parser.dart' as parser;

/// Maps Quacks ingredient token class names to their display colors.
///
/// Class names follow the pattern `qk-token qk-token-{color}`.
const _tokenColors = <String, Color>{
  'white': Color(0xFFFFFFFF),
  'orange': Color(0xFFFF8C00),
  'green': Color(0xFF2E8B57),
  'blue': Color(0xFF4169E1),
  'red': Color(0xFFDC143C),
  'yellow': Color(0xFFFFD700),
  'purple': Color(0xFF8B008B),
  'black': Color(0xFF1A1A1A),
};

/// Builds a [Text.rich] widget from a list of parsed [parser.InlineSpan] nodes.
///
/// Maps `<strong>` → bold, `<em>` → italic, `<br>` → newline.
/// Maps `<span className='qk-token qk-token-{color}'>` to colored circle
/// inline widgets for Quacks ingredient tokens.
///
Widget buildRichText(
  List<parser.InlineSpan> spans, {
  TextStyle? baseStyle,
  TextAlign textAlign = TextAlign.start,
}) {
  final children = _convertSpans(spans);
  if (children.isEmpty) {
    return Text('', style: baseStyle);
  }
  return Text.rich(
    TextSpan(children: children),
    style: baseStyle,
    textAlign: textAlign,
    overflow: TextOverflow.clip,
  );
}

/// Convenience: parse a raw translation string and build a widget in one call.
Widget buildRichTextFromString(
  String input, {
  TextStyle? baseStyle,
  TextAlign textAlign = TextAlign.start,
}) {
  return buildRichText(
    parser.parseRichText(input),
    baseStyle: baseStyle,
    textAlign: textAlign,
  );
}

/// Convert parser spans into Flutter [InlineSpan] nodes.
List<InlineSpan> _convertSpans(List<parser.InlineSpan> spans) {
  final result = <InlineSpan>[];
  for (final span in spans) {
    result.add(_convertSpan(span));
  }
  return result;
}

InlineSpan _convertSpan(parser.InlineSpan span) {
  switch (span) {
    case parser.RichTextSpan(:final text):
      return TextSpan(text: text);

    case parser.LineBreakSpan():
      return const TextSpan(text: '\n');

    case parser.StyledSpan(:final tag, :final className, :final children):
      // Check for Quacks token circles.
      final tokenColor = _resolveTokenColor(className);
      if (tokenColor != null) {
        return WidgetSpan(
          alignment: PlaceholderAlignment.middle,
          child: _TokenCircle(color: tokenColor),
        );
      }

      // Apply style based on tag.
      final style = _styleForTag(tag);
      final childSpans = _convertSpans(children);
      return TextSpan(style: style, children: childSpans);
  }
}

TextStyle? _styleForTag(String tag) {
  return switch (tag) {
    'strong' => const TextStyle(fontWeight: FontWeight.bold),
    'em' => const TextStyle(fontStyle: FontStyle.italic),
    _ => null,
  };
}

/// Extract the token color from a className like `qk-token qk-token-orange`.
Color? _resolveTokenColor(String? className) {
  if (className == null) return null;
  for (final entry in _tokenColors.entries) {
    if (className.contains('qk-token-${entry.key}')) {
      return entry.value;
    }
  }
  return null;
}

/// A small colored circle representing a Quacks ingredient token.
class _TokenCircle extends StatelessWidget {
  final Color color;
  const _TokenCircle({required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 14,
      height: 14,
      margin: const EdgeInsets.symmetric(horizontal: 2),
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(
          color: const Color(0x33000000),
          width: 1,
        ),
      ),
    );
  }
}
