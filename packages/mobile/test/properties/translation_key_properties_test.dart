// Feature: flutter-cross-platform, Property 6: Translation key dot-path resolution
//
// For any valid dot-separated key path and any loaded translation namespace,
// resolving the key by walking the nested JSON map should produce the same
// value as directly indexing into the nested structure level by level.
// Specifically, t(namespace, "a.b.c") should equal
// translations[namespace][locale]["a"]["b"]["c"].

import 'package:flutter_test/flutter_test.dart';
import 'package:kiri_check/kiri_check.dart';
import 'package:rulesnap/i18n/i18n_service.dart';

/// Manually walk a nested map one segment at a time — the "reference"
/// implementation that the property compares against.
dynamic _manualResolve(Map<String, dynamic> data, List<String> segments) {
  dynamic current = data;
  for (final segment in segments) {
    if (current is Map<String, dynamic> && current.containsKey(segment)) {
      current = current[segment];
    } else {
      return null;
    }
  }
  return current;
}

/// Build a nested map from a list of key segments with a leaf value.
Map<String, dynamic> _buildNestedMap(List<String> segments, String leafValue) {
  if (segments.isEmpty) return {};
  if (segments.length == 1) return {segments.first: leafValue};

  Map<String, dynamic> current = {segments.last: leafValue};
  for (int i = segments.length - 2; i >= 0; i--) {
    current = {segments[i]: current};
  }
  return current;
}

void main() {
  group('Property 6: Translation key dot-path resolution', () {
    // Generator for valid key segments (non-empty, no dots).
    final segmentGen = string(
      minLength: 1,
      maxLength: 10,
      characterSet: CharacterSet.alphanum(CharacterEncoding.ascii),
    );

    property(
        'resolveKeyPath with a dot-joined path equals manual segment-by-segment walk',
        () {
      forAll(
        combine2(
          list(segmentGen, minLength: 1, maxLength: 5),
          string(minLength: 1, maxLength: 30),
        ),
        (tuple) {
          final (rawSegments, leafValue) = tuple;
          final segments = List<String>.from(rawSegments);

          final data = _buildNestedMap(segments, leafValue);
          final dotPath = segments.join('.');

          final resolved = resolveKeyPath(data, dotPath);
          final manual = _manualResolve(data, segments);

          expect(resolved, equals(manual));
          expect(resolved, equals(leafValue));
        },
      );
    });

    property('resolveKeyPath returns null for missing keys', () {
      forAll(
        combine2(
          list(segmentGen, minLength: 1, maxLength: 5),
          segmentGen,
        ),
        (tuple) {
          final (rawSegments, extraSegment) = tuple;
          final segments = List<String>.from(rawSegments);

          final data = _buildNestedMap(segments, 'value');

          // Append an extra segment that doesn't exist in the map.
          final missingPath = [...segments, '${extraSegment}_missing'].join('.');

          final resolved = resolveKeyPath(data, missingPath);
          expect(resolved, isNull);
        },
      );
    });

    property('single-segment key resolves to top-level value', () {
      forAll(
        combine2(
          segmentGen,
          string(minLength: 1, maxLength: 50),
        ),
        (tuple) {
          final (key, value) = tuple;

          final data = <String, dynamic>{key: value};

          expect(resolveKeyPath(data, key), equals(value));
        },
      );
    });
  });
}
