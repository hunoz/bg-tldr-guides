import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/cob_theme.dart';
import '../../../widgets/rich_text_widget.dart';

/// End of Game section: bonus points list, winner text (rich text with
/// line breaks).
///
class EndOfGameSection extends StatelessWidget {
  final I18nService i18n;
  final CoBThemeConfig theme;

  static const _ns = 'castles-of-burgundy';

  const EndOfGameSection({
    super.key,
    required this.i18n,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final bonuses = i18n.tObject(_ns, 'endOfGame.bonuses') as List? ?? [];

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
                  i18n.t(_ns, 'endOfGame.heading'),
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  i18n.t(_ns, 'endOfGame.intro'),
                  style: TextStyle(
                    fontSize: 15,
                    color: theme.parchmentText,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 16),

                // Bonus points heading
                Text(
                  i18n.t(_ns, 'endOfGame.bonusHeading'),
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                ...bonuses.map((item) => Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '• ',
                            style: TextStyle(
                              fontSize: 15,
                              color: theme.parchmentText,
                            ),
                          ),
                          Expanded(
                            child: buildRichTextFromString(
                              item.toString(),
                              baseStyle: TextStyle(
                                fontSize: 15,
                                color: theme.parchmentText,
                                height: 1.5,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )),
                const SizedBox(height: 16),

                // Winner text (rich text with line breaks)
                buildRichTextFromString(
                  i18n.t(_ns, 'endOfGame.winner'),
                  baseStyle: TextStyle(
                    fontSize: 15,
                    color: theme.parchmentText,
                    height: 1.5,
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
