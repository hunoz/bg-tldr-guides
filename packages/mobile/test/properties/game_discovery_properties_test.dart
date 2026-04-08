// Feature: flutter-cross-platform, Property 2: Game discovery from namespaces
//
// For any set of translation namespace identifiers, the derived list of game
// IDs should equal the set of all namespace identifiers with `common` removed.
// The resulting list should never contain `common`, and every non-common
// namespace should appear exactly once.

import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kiri_check/kiri_check.dart';
import 'package:rulesnap/i18n/i18n_service.dart';

/// Build a fake [AssetBundle] whose manifest advertises the given namespaces.
class _FakeAssetBundle extends CachingAssetBundle {
  _FakeAssetBundle(this.namespaces);

  final Set<String> namespaces;

  @override
  Future<String> loadString(String key, {bool cache = true}) async {
    if (key == 'AssetManifest.json') {
      final manifest = <String, List<String>>{};
      for (final ns in namespaces) {
        final path = 'assets/i18n/$ns/en.json';
        manifest[path] = [path];
      }
      return json.encode(manifest);
    }
    // Return a minimal valid JSON translation file for any namespace/locale.
    return json.encode({'app': {'title': key, 'icon': '🎲'}});
  }

  @override
  Future<ByteData> load(String key) async {
    throw UnimplementedError('load not used in this test');
  }
}

/// Generator for valid namespace names: lowercase alpha, 1-15 chars.
final _nsGen = string(
  minLength: 1,
  maxLength: 15,
  characterSet: CharacterSet.lower(CharacterEncoding.ascii),
);

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Property 2: Game discovery from namespaces', () {
    property('gameIds equals namespace set minus common', () {
      forAll(
        list(_nsGen, minLength: 0, maxLength: 8),
        (rawNames) async {
          // Ensure uniqueness and always include 'common'.
          final namespaces = <String>{'common', ...List<String>.from(rawNames)};

          final service = I18nService();
          await service.load(bundle: _FakeAssetBundle(namespaces));

          final gameIds = service.gameIds;

          // 1. gameIds must never contain 'common'
          expect(gameIds, isNot(contains('common')));

          // 2. Every non-common namespace must appear in gameIds
          final expectedIds =
              namespaces.where((ns) => ns != 'common').toSet();
          expect(gameIds.toSet(), equals(expectedIds));

          // 3. No duplicates
          expect(gameIds.length, equals(gameIds.toSet().length));
        },
      );
    });

    property('gameIds is empty when only common namespace exists', () {
      forAll(
        constant('common'),
        (commonOnly) async {
          final service = I18nService();
          await service.load(bundle: _FakeAssetBundle({commonOnly}));

          expect(service.gameIds, isEmpty);
        },
      );
    });
  });
}
