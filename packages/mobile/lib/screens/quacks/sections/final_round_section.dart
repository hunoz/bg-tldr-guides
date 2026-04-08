import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/quacks_theme.dart';

/// Final Round section: placeholder (finalRound is an empty object in JSON).
///
class FinalRoundSection extends StatelessWidget {
  final I18nService i18n;
  final QuacksThemeConfig theme;

  const FinalRoundSection({
    super.key,
    required this.i18n,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: Text(
            'Final Round',
            style: theme.themeData.textTheme.headlineMedium,
          ),
        ),
      ),
    );
  }
}
