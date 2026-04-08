import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/quacks_theme.dart';

/// Overview section: horizontal overview box with stats
/// (Rounds, Turns, Simultaneous, Goal).
///
class QuacksOverviewSection extends StatelessWidget {
  final I18nService i18n;
  final QuacksThemeConfig theme;

  static const _ns = 'quacks';

  const QuacksOverviewSection({
    super.key,
    required this.i18n,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final stats = [
      _StatItem(
        label: i18n.t(_ns, 'overview.rounds'),
        value: '9',
      ),
      _StatItem(
        label: i18n.t(_ns, 'overview.turns'),
        value: i18n.t(_ns, 'overview.simultaneous'),
      ),
      _StatItem(
        label: i18n.t(_ns, 'overview.goal'),
        value: i18n.t(_ns, 'overview.mostVictoryPoints'),
      ),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: Container(
            decoration: BoxDecoration(
              color: theme.cardBackground,
              borderRadius: BorderRadius.circular(12),
            ),
            padding: const EdgeInsets.all(20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: stats
                  .map((stat) => Flexible(child: _StatWidget(stat: stat, theme: theme)))
                  .toList(),
            ),
          ),
        ),
      ),
    );
  }
}

class _StatItem {
  final String label;
  final String value;
  const _StatItem({required this.label, required this.value});
}

class _StatWidget extends StatelessWidget {
  final _StatItem stat;
  final QuacksThemeConfig theme;

  const _StatWidget({required this.stat, required this.theme});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          stat.value,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: theme.themeData.colorScheme.primary,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),
        Text(
          stat.label,
          style: TextStyle(
            fontSize: 12,
            color: theme.themeData.textTheme.bodyMedium?.color?.withOpacity(0.7),
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
