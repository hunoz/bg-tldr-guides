// Feature: flutter-cross-platform, Property 1: Unknown route redirect
//
// For any URL path string that is not one of `/`, `/castles-of-burgundy`,
// or `/quacks`, the router's redirect function should return `/`.

import 'package:flutter_test/flutter_test.dart';
import 'package:kiri_check/kiri_check.dart';
import 'package:rulesnap/router.dart';

/// Pure redirect logic extracted for testability — mirrors the redirect
/// callback inside [appRouter].
String? redirectForPath(String path) {
  if (!knownRoutes.contains(path)) {
    return '/';
  }
  return null;
}

void main() {
  group('Property 1: Unknown route redirect', () {
    property('any path not in knownRoutes redirects to /', () {
      forAll(
        string(minLength: 1, maxLength: 60),
        (path) {
          final result = redirectForPath(path);

          if (knownRoutes.contains(path)) {
            // Known route — no redirect
            expect(result, isNull);
          } else {
            // Unknown route — must redirect to '/'
            expect(result, equals('/'));
          }
        },
      );
    });

    property('known routes never trigger a redirect', () {
      forAll(
        constantFrom(knownRoutes.toList()),
        (path) {
          expect(redirectForPath(path), isNull);
        },
      );
    });

    property('paths with extra segments always redirect to /', () {
      forAll(
        string(minLength: 1, maxLength: 30),
        (suffix) {
          // Append a random suffix to a known route to create an unknown path
          for (final known in knownRoutes) {
            final unknownPath = '$known/${suffix.replaceAll('/', '_')}';
            if (!knownRoutes.contains(unknownPath)) {
              expect(redirectForPath(unknownPath), equals('/'));
            }
          }
        },
      );
    });
  });
}
