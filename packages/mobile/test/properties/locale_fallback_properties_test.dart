// Feature: flutter-cross-platform, Property 5: Unsupported locale fallback
//
// For any locale string that is not in the set of supported locales
// (`en`, `es-MX`), the I18nService should resolve to the `en` locale.
// The resolved locale should always be a member of the supported locale set.

import 'package:flutter_test/flutter_test.dart';
import 'package:kiri_check/kiri_check.dart';
import 'package:rulesnap/i18n/i18n_service.dart';

void main() {
  group('Property 5: Unsupported locale fallback', () {
    property(
        'setLocaleByCode with unsupported locale always resolves to en', () {
      forAll(
        string(minLength: 1, maxLength: 20),
        (localeCode) {
          final service = I18nService();

          service.setLocaleByCode(localeCode);

          if (supportedLocales.contains(localeCode)) {
            // Supported locale — should be kept as-is
            expect(service.localeCode, equals(localeCode));
          } else {
            // Unsupported locale — must fall back to 'en'
            expect(service.localeCode, equals(defaultLocale));
          }

          // Invariant: resolved locale is always in the supported set
          expect(supportedLocales, contains(service.localeCode));
        },
      );
    });

    property('resolved locale is always a member of the supported set', () {
      forAll(
        string(minLength: 0, maxLength: 50),
        (localeCode) {
          final service = I18nService();

          service.setLocaleByCode(localeCode);

          expect(supportedLocales, contains(service.localeCode));
        },
      );
    });
  });
}
