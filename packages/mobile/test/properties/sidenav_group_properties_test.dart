// Feature: flutter-cross-platform, Property 9: SideNav game screen group structure
//
// For any game screen with a defined list of section IDs, the SideNav groups
// should contain exactly one group whose first item is a "back to all games"
// navigation item (with an onTap callback, no sectionId) followed by items
// where each subsequent item has a sectionId matching one of the game's
// section IDs, in order.

import 'package:flutter_test/flutter_test.dart';
import 'package:kiri_check/kiri_check.dart';
import 'package:rulesnap/models/nav_item.dart';

/// Builds a SideNav group for a game screen, mirroring the pattern used by
/// game screens (CastlesOfBurgundyScreen, QuacksScreen).
///
/// The group contains:
/// 1. A "back to all games" item with [onTap] and no [sectionId]
/// 2. One item per section ID with [sectionId] set and no [onTap]
List<NavGroup> buildGameScreenNavGroups(List<String> sectionIds) {
  return [
    NavGroup(
      items: [
        NavItem(
          id: 'back',
          label: '← All Games',
          onTap: () {},
        ),
        ...sectionIds.map(
          (id) => NavItem(
            id: id,
            label: 'Section $id',
            sectionId: id,
          ),
        ),
      ],
    ),
  ];
}

/// Generator for valid section ID strings: lowercase alpha + hyphens, 1-20 chars.
final _sectionIdGen = string(
  minLength: 1,
  maxLength: 20,
  characterSet: CharacterSet.lower(CharacterEncoding.ascii),
);

void main() {
  group('Property 9: SideNav game screen group structure', () {
    property(
      'game screen groups contain exactly one group',
      () {
        forAll(
          list(_sectionIdGen, minLength: 1, maxLength: 15),
          (sectionIds) {
            final groups = buildGameScreenNavGroups(sectionIds);
            expect(groups.length, equals(1));
          },
        );
      },
    );

    property(
      'first item is a back-to-all-games navigation item with onTap and no sectionId',
      () {
        forAll(
          list(_sectionIdGen, minLength: 1, maxLength: 15),
          (sectionIds) {
            final groups = buildGameScreenNavGroups(sectionIds);
            final firstItem = groups.first.items.first;

            expect(firstItem.onTap, isNotNull);
            expect(firstItem.sectionId, isNull);
          },
        );
      },
    );

    property(
      'subsequent items each have a sectionId matching the input section IDs in order',
      () {
        forAll(
          list(_sectionIdGen, minLength: 1, maxLength: 15),
          (sectionIds) {
            final groups = buildGameScreenNavGroups(sectionIds);
            final items = groups.first.items;

            // Total items = 1 back item + N section items
            expect(items.length, equals(sectionIds.length + 1));

            // Each item after the first should have the matching sectionId
            for (var i = 0; i < sectionIds.length; i++) {
              final sectionItem = items[i + 1];
              expect(sectionItem.sectionId, equals(sectionIds[i]));
              expect(sectionItem.onTap, isNull);
            }
          },
        );
      },
    );

    property(
      'section item IDs match the input section IDs in order',
      () {
        forAll(
          list(_sectionIdGen, minLength: 1, maxLength: 15),
          (sectionIds) {
            final groups = buildGameScreenNavGroups(sectionIds);
            final sectionItems = groups.first.items.skip(1).toList();

            final resultIds =
                sectionItems.map((item) => item.sectionId).toList();
            expect(resultIds, equals(sectionIds));
          },
        );
      },
    );

    property(
      'empty section list produces a group with only the back item',
      () {
        forAll(
          constant(<String>[]),
          (emptySections) {
            final groups = buildGameScreenNavGroups(emptySections);

            expect(groups.length, equals(1));
            expect(groups.first.items.length, equals(1));
            expect(groups.first.items.first.onTap, isNotNull);
            expect(groups.first.items.first.sectionId, isNull);
          },
        );
      },
    );
  });
}
