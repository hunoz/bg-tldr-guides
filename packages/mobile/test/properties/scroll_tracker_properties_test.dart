// Feature: flutter-cross-platform, Property 8: Scroll tracker active section accuracy
//
// For any list of section keys with known vertical offsets and any scroll
// position, the ScrollTracker.activeSectionId should return the ID of the
// section whose top edge is closest to (but not below) the viewport's
// observation point. If no section is above the observation point, it should
// return the first section.

import 'package:flutter_test/flutter_test.dart';
import 'package:kiri_check/kiri_check.dart';
import 'package:rulesnap/widgets/scroll_tracker.dart';

/// Generates a list of random offsets in [0, 5000) and converts them into
/// a Map<String, double> keyed by "section_0", "section_1", etc.
Map<String, double> _buildSectionTops(List<double> offsets) {
  final map = <String, double>{};
  for (var i = 0; i < offsets.length; i++) {
    map['section_$i'] = offsets[i];
  }
  return map;
}

/// Reference implementation: brute-force compute the expected active section.
/// Returns the section whose top is <= observationPoint and closest to it.
/// If none qualifies, returns the first key.
String? _expectedActiveSection(
  Map<String, double> sectionTops,
  double observationPoint,
) {
  if (sectionTops.isEmpty) return null;

  String? bestId;
  double bestDistance = double.infinity;

  for (final entry in sectionTops.entries) {
    if (entry.value <= observationPoint) {
      final distance = observationPoint - entry.value;
      if (distance < bestDistance) {
        bestDistance = distance;
        bestId = entry.key;
      }
    }
  }

  return bestId ?? sectionTops.keys.first;
}

void main() {
  group('Property 8: Scroll tracker active section accuracy', () {
    property(
      'computeActiveSection returns the section closest to but not below the observation point',
      () {
        forAll(
          combine2(
            list(float(min: 0, max: 5000), minLength: 1, maxLength: 20),
            float(min: 0, max: 5000),
          ),
          (tuple) {
            final (offsets, observationPoint) = tuple;
            final sectionTops = _buildSectionTops(offsets);

            final result = ScrollTracker.computeActiveSection(
              sectionTops,
              observationPoint,
            );
            final expected = _expectedActiveSection(
              sectionTops,
              observationPoint,
            );

            expect(result, equals(expected));
          },
        );
      },
    );

    property(
      'result is never null for non-empty section maps',
      () {
        forAll(
          combine2(
            list(float(min: 0, max: 5000), minLength: 1, maxLength: 20),
            float(min: 0, max: 5000),
          ),
          (tuple) {
            final (offsets, observationPoint) = tuple;
            final sectionTops = _buildSectionTops(offsets);

            final result = ScrollTracker.computeActiveSection(
              sectionTops,
              observationPoint,
            );

            expect(result, isNotNull);
            expect(sectionTops.containsKey(result), isTrue);
          },
        );
      },
    );

    property(
      'returns null for empty section maps',
      () {
        forAll(
          float(min: 0, max: 5000),
          (observationPoint) {
            final result = ScrollTracker.computeActiveSection(
              {},
              observationPoint,
            );

            expect(result, isNull);
          },
        );
      },
    );

    property(
      'returns first section when all sections are below the observation point',
      () {
        forAll(
          combine2(
            list(float(min: 3000, max: 5000), minLength: 1, maxLength: 10),
            float(min: 0, max: 100),
          ),
          (tuple) {
            final (offsets, observationPoint) = tuple;
            final sectionTops = _buildSectionTops(offsets);

            final result = ScrollTracker.computeActiveSection(
              sectionTops,
              observationPoint,
            );

            // Should fall back to first section
            expect(result, equals(sectionTops.keys.first));
          },
        );
      },
    );

    property(
      'when observation point is exactly on a section top, that section is selected',
      () {
        forAll(
          list(float(min: 0, max: 5000), minLength: 2, maxLength: 15),
          (offsets) {
            final sectionTops = _buildSectionTops(offsets);

            // Use each section's top as the observation point
            for (final target in sectionTops.entries) {
              final result = ScrollTracker.computeActiveSection(
                sectionTops,
                target.value,
              );

              // The result should be at or above the observation point
              expect(sectionTops[result!], lessThanOrEqualTo(target.value));

              // And it should be the closest one
              final resultDistance = target.value - sectionTops[result]!;
              for (final entry in sectionTops.entries) {
                if (entry.value <= target.value) {
                  final distance = target.value - entry.value;
                  expect(resultDistance, lessThanOrEqualTo(distance));
                }
              }
            }
          },
        );
      },
    );

    property(
      'selected section top is always <= observation point when any section qualifies',
      () {
        forAll(
          combine2(
            list(float(min: 0, max: 5000), minLength: 1, maxLength: 20),
            float(min: 0, max: 5000),
          ),
          (tuple) {
            final (offsets, observationPoint) = tuple;
            final sectionTops = _buildSectionTops(offsets);

            final hasQualifying =
                sectionTops.values.any((top) => top <= observationPoint);

            final result = ScrollTracker.computeActiveSection(
              sectionTops,
              observationPoint,
            );

            if (hasQualifying) {
              expect(
                sectionTops[result!],
                lessThanOrEqualTo(observationPoint),
              );
            }
          },
        );
      },
    );
  });
}
