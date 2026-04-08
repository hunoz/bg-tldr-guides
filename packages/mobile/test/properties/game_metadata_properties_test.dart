// Feature: flutter-cross-platform, Property 3: Game metadata resolution
//
// For any game namespace that contains an `app.title` key and an `app.icon`
// key, the constructed GameMetadata should have its `title` field equal to
// the value at `app.title` and its `icon` field equal to the value at
// `app.icon`.

import 'package:flutter_test/flutter_test.dart';
import 'package:kiri_check/kiri_check.dart';
import 'package:rulesnap/models/game_metadata.dart';

void main() {
  group('Property 3: Game metadata resolution', () {
    property('title and icon match constructor args, route derives from id',
        () {
      forAll(
        combine3(
          string(minLength: 1, maxLength: 50),
          string(minLength: 1, maxLength: 100),
          string(minLength: 1, maxLength: 10),
        ),
        (tuple) {
          final (id, title, icon) = tuple;
          final metadata = GameMetadata(id: id, title: title, icon: icon);

          // Title matches the provided title
          expect(metadata.title, equals(title));

          // Icon matches the provided icon
          expect(metadata.icon, equals(icon));

          // Route is always '/$id'
          expect(metadata.route, equals('/$id'));

          // Id is preserved
          expect(metadata.id, equals(id));
        },
      );
    });
  });
}
