// Feature: flutter-cross-platform, Property 7: Rich text parsing round-trip
//
// For any string composed of plain text segments interleaved with supported
// HTML tags (<strong>, <em>, <br>, <br/>, <span>), parsing the string into
// an InlineSpan tree and then serializing the tree back to a string should
// produce the original input. Additionally, strings containing no HTML tags
// should parse into a single RichTextSpan node.

import 'package:flutter_test/flutter_test.dart';
import 'package:kiri_check/kiri_check.dart';
import 'package:rulesnap/i18n/rich_text_parser.dart';

/// Generator for plain text that does not contain any `<` or `>` characters
/// so it cannot be confused with HTML tags.
Arbitrary<String> _plainTextGen({int minLength = 1, int maxLength = 30}) {
  return string(minLength: minLength, maxLength: maxLength).filter(
    (s) => !s.contains('<') && !s.contains('>') && s.isNotEmpty,
  );
}

/// Wrap [inner] with a random paired tag.
String _wrapWithTag(String tag, String inner, {String? className}) {
  if (className != null) {
    return "<$tag className='$className'>$inner</$tag>";
  }
  return '<$tag>$inner</$tag>';
}

void main() {
  group('Property 7: Rich text parsing round-trip', () {
    property('plain text with no tags parses to a single RichTextSpan', () {
      forAll(
        _plainTextGen(),
        (text) {
          final spans = parseRichText(text);

          expect(spans, hasLength(1));
          expect(spans.first, isA<RichTextSpan>());
          expect((spans.first as RichTextSpan).text, equals(text));
        },
      );
    });

    property('plain text round-trips through parse and serialize', () {
      forAll(
        _plainTextGen(),
        (text) {
          final spans = parseRichText(text);
          final serialized = serializeSpans(spans);

          expect(serialized, equals(text));
        },
      );
    });

    property('<strong> wrapped text round-trips', () {
      forAll(
        _plainTextGen(),
        (text) {
          final input = _wrapWithTag('strong', text);
          final spans = parseRichText(input);
          final serialized = serializeSpans(spans);

          expect(serialized, equals(input));
          expect(spans, hasLength(1));
          expect(spans.first, isA<StyledSpan>());
          expect((spans.first as StyledSpan).tag, equals('strong'));
        },
      );
    });

    property('<em> wrapped text round-trips', () {
      forAll(
        _plainTextGen(),
        (text) {
          final input = _wrapWithTag('em', text);
          final spans = parseRichText(input);
          final serialized = serializeSpans(spans);

          expect(serialized, equals(input));
          expect(spans, hasLength(1));
          expect(spans.first, isA<StyledSpan>());
          expect((spans.first as StyledSpan).tag, equals('em'));
        },
      );
    });

    property('<span> wrapped text round-trips', () {
      forAll(
        _plainTextGen(),
        (text) {
          final input = _wrapWithTag('span', text);
          final spans = parseRichText(input);
          final serialized = serializeSpans(spans);

          expect(serialized, equals(input));
        },
      );
    });

    property('text with <br/> round-trips', () {
      forAll(
        combine2(
          _plainTextGen(),
          _plainTextGen(),
        ),
        (tuple) {
          final (before, after) = tuple;
          final input = '$before<br/>$after';
          final spans = parseRichText(input);
          final serialized = serializeSpans(spans);

          expect(serialized, equals(input));

          // Should contain a LineBreakSpan somewhere in the list
          expect(spans.any((s) => s is LineBreakSpan), isTrue);
        },
      );
    });

    property('nested <strong><em> round-trips', () {
      forAll(
        _plainTextGen(),
        (text) {
          final input = '<strong><em>$text</em></strong>';
          final spans = parseRichText(input);
          final serialized = serializeSpans(spans);

          expect(serialized, equals(input));
        },
      );
    });

    property(
        'mixed plain text and tags round-trip: prefix <strong>mid</strong> suffix',
        () {
      forAll(
        combine3(
          _plainTextGen(),
          _plainTextGen(),
          _plainTextGen(),
        ),
        (tuple) {
          final (prefix, mid, suffix) = tuple;
          final input = '$prefix<strong>$mid</strong>$suffix';
          final spans = parseRichText(input);
          final serialized = serializeSpans(spans);

          expect(serialized, equals(input));
        },
      );
    });

    property('<span> with className round-trips', () {
      forAll(
        combine2(
          _plainTextGen(),
          _plainTextGen(maxLength: 20),
        ),
        (tuple) {
          final (text, cls) = tuple;
          // Ensure className has no single quotes which would break the attribute
          final safeClass = cls.replaceAll("'", '');
          if (safeClass.isEmpty) return;

          final input = _wrapWithTag('span', text, className: safeClass);
          final spans = parseRichText(input);
          final serialized = serializeSpans(spans);

          expect(serialized, equals(input));
          expect(spans.first, isA<StyledSpan>());
          expect((spans.first as StyledSpan).className, equals(safeClass));
        },
      );
    });

    property('empty string parses to empty list', () {
      final spans = parseRichText('');
      expect(spans, isEmpty);
      expect(serializeSpans(spans), equals(''));
    });

    property(
        'multiple <br/> tags interleaved with text round-trip', () {
      forAll(
        combine3(
          _plainTextGen(),
          _plainTextGen(),
          _plainTextGen(),
        ),
        (tuple) {
          final (a, b, c) = tuple;
          final input = '$a<br/>$b<br/>$c';
          final spans = parseRichText(input);
          final serialized = serializeSpans(spans);

          expect(serialized, equals(input));

          // Should contain exactly 2 LineBreakSpans
          final breakCount = spans.where((s) => s is LineBreakSpan).length;
          expect(breakCount, equals(2));
        },
      );
    });
  });
}
