import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/cob_theme.dart';
import '../../../widgets/rich_text_widget.dart';

/// Game Flow section: phase pills A–E, start/end steps, round description.
///
class GameFlowSection extends StatelessWidget {
  final I18nService i18n;
  final CoBThemeConfig theme;

  static const _ns = 'castles-of-burgundy';

  const GameFlowSection({
    super.key,
    required this.i18n,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final phases = i18n.tObject(_ns, 'gameFlow.phases') as List? ?? [];
    final startSteps = i18n.tObject(_ns, 'gameFlow.startSteps') as List? ?? [];
    final endSteps = i18n.tObject(_ns, 'gameFlow.endSteps') as List? ?? [];

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
                  i18n.t(_ns, 'gameFlow.heading'),
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                buildRichTextFromString(
                  i18n.t(_ns, 'gameFlow.intro'),
                  baseStyle: TextStyle(fontSize: 15, color: theme.parchmentText, height: 1.5),
                ),
                const SizedBox(height: 16),

                // Phase pills A–E in horizontal grid
                Row(
                  children: [
                    Text(
                      i18n.t(_ns, 'gameFlow.roundsLabel'),
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: theme.parchmentText,
                      ),
                    ),
                    const SizedBox(width: 12),
                    ...phases.map((phase) => Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: _PhasePill(label: phase.toString(), theme: theme),
                        )),
                  ],
                ),
                const SizedBox(height: 16),

                // Start of Each Phase
                Text(
                  i18n.t(_ns, 'gameFlow.startHeading'),
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                ...startSteps.map((step) => _BulletItem(
                      text: step.toString(),
                      color: theme.parchmentText,
                    )),
                const SizedBox(height: 16),

                // End of Each Phase
                Text(
                  i18n.t(_ns, 'gameFlow.endHeading'),
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                ...endSteps.map((step) => _BulletItem(
                      text: step.toString(),
                      color: theme.parchmentText,
                    )),
                const SizedBox(height: 16),

                // Each Round
                Text(
                  i18n.t(_ns, 'gameFlow.roundHeading'),
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  i18n.t(_ns, 'gameFlow.roundDesc'),
                  style: TextStyle(fontSize: 15, color: theme.parchmentText, height: 1.5),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _PhasePill extends StatelessWidget {
  final String label;
  final CoBThemeConfig theme;

  const _PhasePill({required this.label, required this.theme});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 36,
      height: 36,
      decoration: BoxDecoration(
        color: const Color(0xFFc9a84c).withOpacity(0.2),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFc9a84c), width: 1.5),
      ),
      alignment: Alignment.center,
      child: Text(
        label,
        style: TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.bold,
          color: theme.parchmentText,
        ),
      ),
    );
  }
}

class _BulletItem extends StatelessWidget {
  final String text;
  final Color color;

  const _BulletItem({required this.text, required this.color});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('• ', style: TextStyle(fontSize: 15, color: color)),
          Expanded(
            child: Text(text, style: TextStyle(fontSize: 15, color: color, height: 1.5)),
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
