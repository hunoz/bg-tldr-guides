import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'game_theme_provider.dart';

/// Castles of Burgundy theme: warm medieval palette, serif typography, gold accent.
class CoBThemeConfig extends GameThemeConfig {
  static const _background = Color(0xFF1a0f0a);
  static const _accent = Color(0xFFc9a84c);
  static const _parchment = Color(0xFFfaf3e6);
  static const _parchmentText = Color(0xFF3b2a1a);
  static const _textPrimary = Color(0xFFe8dcc8);

  @override
  Color get scaffoldBackground => _background;

  @override
  Color get sideNavBackground => const Color(0xFF1f1410);

  @override
  Color get sideNavText => const Color(0xFFc8b89a);

  @override
  Color get sideNavActiveText => _accent;

  @override
  Color get sideNavActiveAccent => _accent;

  @override
  Color get sideNavHoverBackground => const Color(0xFF2a1c14);

  /// Parchment card background for section content.
  Color get parchmentBackground => _parchment;

  /// Text color for parchment cards.
  Color get parchmentText => _parchmentText;

  @override
  ThemeData get themeData {
    final bodyFont = GoogleFonts.crimsonText();
    final headingFont = GoogleFonts.cinzel();

    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: _background,
      colorScheme: const ColorScheme.dark(
        primary: _accent,
        surface: _background,
        onSurface: _textPrimary,
      ),
      textTheme: TextTheme(
        headlineLarge: headingFont.copyWith(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: _accent,
        ),
        headlineMedium: headingFont.copyWith(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: _accent,
        ),
        bodyLarge: bodyFont.copyWith(fontSize: 16, color: _textPrimary),
        bodyMedium: bodyFont.copyWith(fontSize: 14, color: _textPrimary),
      ),
    );
  }
}
