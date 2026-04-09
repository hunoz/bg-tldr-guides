import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../i18n/i18n_service.dart';
import '../theme/game_theme_provider.dart';
import '../utils/constants.dart';
import 'secure_link.dart';

/// Shared BGG Page + Official Manual buttons for game screen headers.
///
/// Reads the current theme from [GameThemeProvider] for styling.
/// Uses i18n keys `app.bggButton` and `app.manualButton` from the game's
/// translation namespace.
class GameHeaderButtons extends StatelessWidget {
  final String gameId;
  final String? manualUrl;

  const GameHeaderButtons({
    super.key,
    required this.gameId,
    this.manualUrl,
  });

  @override
  Widget build(BuildContext context) {
    final i18n = Provider.of<I18nService>(context);
    final themeProvider = Provider.of<GameThemeProvider>(context);
    final accent = themeProvider.config.themeData.colorScheme.primary;
    final bggUrl = gameLinks[gameId] ?? '';

    return SelectionContainer.disabled(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _LinkButton(
            label: i18n.t('common', 'bggButton'),
            icon: Icons.open_in_new,
            url: bggUrl,
            accent: accent,
          ),
          const SizedBox(width: 12),
          _LinkButton(
            label: i18n.t('common', 'manualButton'),
            icon: Icons.picture_as_pdf,
            url: manualUrl ?? 'https://rulesnap.com/manuals/$gameId.pdf',
            accent: accent,
          ),
        ],
      ),
    );
  }
}

class _LinkButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final String url;
  final Color accent;

  const _LinkButton({
    required this.label,
    required this.icon,
    required this.url,
    required this.accent,
  });

  @override
  Widget build(BuildContext context) {
    return SecureLink(
      url: url,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: accent.withOpacity(0.15),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: accent.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: accent),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: accent,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
