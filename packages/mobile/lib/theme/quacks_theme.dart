import 'package:flutter/material.dart';
import 'game_theme_provider.dart';

/// Quacks of Quedlinburg theme: dark purple, gold accent, parchment cards.
class QuacksThemeConfig extends GameThemeConfig {
  static const _background = Color(0xFF1a0e2e);
  static const _cardBackground = Color(0xFF2a1745);
  static const _accent = Color(0xFFd4a843);
  static const _parchment = Color(0xFFf5e6c8);
  static const _textPrimary = Color(0xFFe0d8f0);

  @override
  Color get scaffoldBackground => _background;

  @override
  Color get sideNavBackground => const Color(0xFF1e1235);

  @override
  Color get sideNavText => const Color(0xFFc0b8d8);

  @override
  Color get sideNavActiveText => _accent;

  @override
  Color get sideNavActiveAccent => _accent;

  @override
  Color get sideNavHoverBackground => const Color(0xFF2a1a40);

  /// Dark purple card background.
  Color get cardBackground => _cardBackground;

  /// Parchment card variant (light background with dark text).
  Color get parchmentBackground => _parchment;

  /// Text color for parchment cards.
  Color get parchmentText => const Color(0xFF3b2a1a);

  @override
  ThemeData get themeData => ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: _background,
        colorScheme: const ColorScheme.dark(
          primary: _accent,
          surface: _background,
          onSurface: _textPrimary,
        ),
        textTheme: const TextTheme(
          headlineLarge: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            fontFamily: 'Georgia',
            color: _accent,
          ),
          headlineMedium: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            fontFamily: 'Georgia',
            color: _accent,
          ),
          bodyLarge: TextStyle(fontSize: 16, color: _textPrimary),
          bodyMedium: TextStyle(fontSize: 14, color: _textPrimary),
        ),
      );
}
