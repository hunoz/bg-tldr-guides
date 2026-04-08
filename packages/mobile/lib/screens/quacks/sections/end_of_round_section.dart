import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/quacks_theme.dart';

/// End of Round section: placeholder (endOfRound is an empty object in JSON).
///
class EndOfRoundSection extends StatelessWidget {
  final I18nService i18n;
  final QuacksThemeConfig theme;

  const EndOfRoundSection({
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
            'End of Round',
            style: theme.themeData.textTheme.headlineMedium,
          ),
        ),
      ),
    );
  }
}
