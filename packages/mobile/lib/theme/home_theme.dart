import 'package:flutter/material.dart';
import 'game_theme_provider.dart';

/// Home screen theme: dark background, sans-serif typography, purple accent.
class HomeThemeConfig extends GameThemeConfig {
  static const _background = Color(0xFF1a1a2e);
  static const _accent = Color(0xFF6c63ff);
  static const _textPrimary = Color(0xFFe0e0e0);
  static const _textSecondary = Color(0xFFc8c8d4);

  @override
  Color get scaffoldBackground => _background;

  @override
  Color get sideNavBackground => _background;

  @override
  Color get sideNavText => _textSecondary;

  @override
  Color get sideNavActiveText => Colors.white;

  @override
  Color get sideNavActiveAccent => _accent;

  @override
  Color get sideNavHoverBackground => const Color(0xFF252545);

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
            color: Colors.white,
          ),
          headlineMedium: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
          bodyLarge: TextStyle(fontSize: 16, color: _textPrimary),
          bodyMedium: TextStyle(fontSize: 14, color: _textSecondary),
        ),
      );
}
