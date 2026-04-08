// Feature: flutter-cross-platform, Property 4: Theme completeness for SideNav
//
// For any GameThemeConfig instance (Home, CoB, Quacks, or any future theme),
// the config should provide non-null values for sideNavBackground, sideNavText,
// sideNavActiveText, and sideNavActiveAccent, ensuring the SideNav can render
// legibly against every theme.

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kiri_check/kiri_check.dart';
import 'package:rulesnap/theme/game_theme_provider.dart';
import 'package:rulesnap/theme/home_theme.dart';
import 'package:rulesnap/theme/cob_theme.dart';
import 'package:rulesnap/theme/quacks_theme.dart';

/// All known GameThemeConfig implementations.
/// When a new theme is added, include it here to ensure SideNav completeness.
late List<GameThemeConfig> _allThemes;

/// Generator that picks a random theme from the known set.
Arbitrary<GameThemeConfig> _themeGen() {
  return integer(min: 0, max: _allThemes.length - 1)
      .map((i) => _allThemes[i]);
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  _allThemes = [
    HomeThemeConfig(),
    CoBThemeConfig(),
    QuacksThemeConfig(),
  ];
  group('Property 4: Theme completeness for SideNav', () {
    property('every theme provides non-null sideNavBackground', () {
      forAll(_themeGen(), (theme) {
        // Color is a non-nullable type in Dart, so this verifies the getter
        // returns a valid Color and not a transparent/zero-alpha placeholder.
        expect(theme.sideNavBackground, isA<Color>());
        expect(theme.sideNavBackground.alpha, greaterThan(0));
      });
    });

    property('every theme provides non-null sideNavText', () {
      forAll(_themeGen(), (theme) {
        expect(theme.sideNavText, isA<Color>());
        expect(theme.sideNavText.alpha, greaterThan(0));
      });
    });

    property('every theme provides non-null sideNavActiveText', () {
      forAll(_themeGen(), (theme) {
        expect(theme.sideNavActiveText, isA<Color>());
        expect(theme.sideNavActiveText.alpha, greaterThan(0));
      });
    });

    property('every theme provides non-null sideNavActiveAccent', () {
      forAll(_themeGen(), (theme) {
        expect(theme.sideNavActiveAccent, isA<Color>());
        expect(theme.sideNavActiveAccent.alpha, greaterThan(0));
      });
    });

    property('every theme provides non-null sideNavHoverBackground', () {
      forAll(_themeGen(), (theme) {
        expect(theme.sideNavHoverBackground, isA<Color>());
        expect(theme.sideNavHoverBackground.alpha, greaterThan(0));
      });
    });

    property('sideNavText is visually distinct from sideNavBackground', () {
      forAll(_themeGen(), (theme) {
        // Ensure text and background are not the same color
        expect(theme.sideNavText, isNot(equals(theme.sideNavBackground)));
      });
    });

    property('sideNavActiveAccent is visually distinct from sideNavBackground',
        () {
      forAll(_themeGen(), (theme) {
        expect(
            theme.sideNavActiveAccent, isNot(equals(theme.sideNavBackground)));
      });
    });

    property('every theme provides a valid ThemeData', () {
      forAll(_themeGen(), (theme) {
        expect(theme.themeData, isA<ThemeData>());
        expect(theme.scaffoldBackground, isA<Color>());
        expect(theme.scaffoldBackground.alpha, greaterThan(0));
      });
    });
  });
}
