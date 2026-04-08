import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/cob_theme.dart';
import '../../../utils/responsive.dart';

/// Monasteries section: numbered monastery cards in two-column grid
/// (ongoing + end-game).
///
class MonasteriesSection extends StatelessWidget {
  final I18nService i18n;
  final CoBThemeConfig theme;

  static const _ns = 'castles-of-burgundy';

  const MonasteriesSection({
    super.key,
    required this.i18n,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final ongoing = i18n.tObject(_ns, 'monasteries.ongoing') as List? ?? [];
    final endGame = i18n.tObject(_ns, 'monasteries.endGame') as List? ?? [];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: _ParchmentCard(
            theme: theme,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  i18n.t(_ns, 'monasteries.heading'),
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  i18n.t(_ns, 'monasteries.subtitle'),
                  style: TextStyle(
                    fontSize: 14,
                    color: theme.parchmentText.withOpacity(0.7),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  i18n.t(_ns, 'monasteries.intro'),
                  style: TextStyle(
                    fontSize: 15,
                    color: theme.parchmentText,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 16),

                // Ongoing Abilities
                Text(
                  i18n.t(_ns, 'monasteries.ongoingHeading'),
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 12),
                _MonasteryGrid(items: ongoing, theme: theme),
                const SizedBox(height: 20),

                // End-of-Game Scoring
                Text(
                  i18n.t(_ns, 'monasteries.endGameHeading'),
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 12),
                _MonasteryGrid(items: endGame, theme: theme),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MonasteryGrid extends StatelessWidget {
  final List<dynamic> items;
  final CoBThemeConfig theme;

  const _MonasteryGrid({required this.items, required this.theme});

  @override
  Widget build(BuildContext context) {
    return ResponsiveBuilder(
      builder: (context, screenSize, width) {
        final cols = responsiveColumns(
          width,
          phoneCols: 1,
          tabletCols: 2,
          desktopCols: 3,
        );
        const spacing = 12.0;
        final itemWidth = responsiveItemWidth(width, cols, spacing);

        return Wrap(
          spacing: spacing,
          runSpacing: spacing,
          children: items.map((item) {
            final m = item as Map<String, dynamic>;
            return SizedBox(
              width: itemWidth,
              child: _MonasteryCard(
                num: m['num']?.toString() ?? '',
                text: m['text']?.toString() ?? '',
                theme: theme,
              ),
            );
          }).toList(),
        );
      },
    );
  }
}

class _MonasteryCard extends StatelessWidget {
  final String num;
  final String text;
  final CoBThemeConfig theme;

  const _MonasteryCard({
    required this.num,
    required this.text,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.parchmentText.withOpacity(0.05),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: theme.parchmentText.withOpacity(0.1),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFc9a84c).withOpacity(0.2),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(
                color: const Color(0xFFc9a84c),
                width: 1,
              ),
            ),
            child: Text(
              num,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: theme.parchmentText,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 14,
                color: theme.parchmentText,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ParchmentCard extends StatelessWidget {
  final CoBThemeConfig theme;
  final Widget child;

  const _ParchmentCard({required this.theme, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: theme.parchmentBackground,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        margin: const EdgeInsets.all(4),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: theme.parchmentText.withOpacity(0.15),
            width: 1,
          ),
        ),
        child: child,
      ),
    );
  }
}
