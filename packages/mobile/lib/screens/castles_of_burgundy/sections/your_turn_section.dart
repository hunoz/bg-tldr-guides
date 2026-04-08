import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/cob_theme.dart';
import '../../../utils/responsive.dart';
import '../../../widgets/rich_text_widget.dart';

/// Your Turn section: action cards in two-column grid, buy center callout,
/// worker tip.
///
class YourTurnSection extends StatelessWidget {
  final I18nService i18n;
  final CoBThemeConfig theme;

  static const _ns = 'castles-of-burgundy';

  const YourTurnSection({
    super.key,
    required this.i18n,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final actions = i18n.tObject(_ns, 'yourTurn.actions') as List? ?? [];

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
                  i18n.t(_ns, 'yourTurn.heading'),
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                buildRichTextFromString(
                  i18n.t(_ns, 'yourTurn.intro'),
                  baseStyle: TextStyle(
                    fontSize: 15,
                    color: theme.parchmentText,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 16),

                // Action cards in two-column grid with numbered badges
                _ActionGrid(actions: actions, theme: theme),
                const SizedBox(height: 16),

                // Buy center callout (rich text)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: theme.parchmentText.withOpacity(0.06),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: buildRichTextFromString(
                    i18n.t(_ns, 'yourTurn.buyCenter'),
                    baseStyle: TextStyle(
                      fontSize: 15,
                      color: theme.parchmentText,
                      height: 1.5,
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Worker tip (rich text)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: theme.parchmentText.withOpacity(0.06),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: buildRichTextFromString(
                    i18n.t(_ns, 'yourTurn.workerTip'),
                    baseStyle: TextStyle(
                      fontSize: 15,
                      color: theme.parchmentText,
                      height: 1.5,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ActionGrid extends StatelessWidget {
  final List<dynamic> actions;
  final CoBThemeConfig theme;

  const _ActionGrid({required this.actions, required this.theme});

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
          children: List.generate(actions.length, (index) {
            final action = actions[index] as Map<String, dynamic>;
            return SizedBox(
              width: itemWidth,
              child: _ActionCard(
                index: index + 1,
                icon: action['icon']?.toString() ?? '',
                title: action['title']?.toString() ?? '',
                desc: action['desc']?.toString() ?? '',
                theme: theme,
              ),
            );
          }),
        );
      },
    );
  }
}

class _ActionCard extends StatelessWidget {
  final int index;
  final String icon;
  final String title;
  final String desc;
  final CoBThemeConfig theme;

  const _ActionCard({
    required this.index,
    required this.icon,
    required this.title,
    required this.desc,
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Numbered badge
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: const Color(0xFFc9a84c),
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: Text(
                  '$index',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1a0f0a),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(icon, style: const TextStyle(fontSize: 20)),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            desc,
            style: TextStyle(
              fontSize: 14,
              color: theme.parchmentText.withOpacity(0.85),
              height: 1.4,
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
