import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/cob_theme.dart';
import '../../../widgets/rich_text_widget.dart';

/// Setup section: player gets list, shared board list, first player roll,
/// bridge note.
///
class SetupSection extends StatelessWidget {
  final I18nService i18n;
  final CoBThemeConfig theme;

  static const _ns = 'castles-of-burgundy';

  const SetupSection({
    super.key,
    required this.i18n,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final playerGets = i18n.tObject(_ns, 'setup.playerGets') as List? ?? [];
    final sharedBoard = i18n.tObject(_ns, 'setup.sharedBoard') as List? ?? [];

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
                  i18n.t(_ns, 'setup.heading'),
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  i18n.t(_ns, 'setup.intro'),
                  style: TextStyle(fontSize: 15, color: theme.parchmentText, height: 1.5),
                ),
                const SizedBox(height: 16),

                // Player Gets
                Text(
                  i18n.t(_ns, 'setup.playerGetsHeading'),
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                ...playerGets.map((item) => _BulletItem(
                      text: item.toString(),
                      color: theme.parchmentText,
                    )),
                const SizedBox(height: 16),

                // Shared Board
                Text(
                  i18n.t(_ns, 'setup.sharedBoardHeading'),
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                ...sharedBoard.map((item) => _BulletItem(
                      text: item.toString(),
                      color: theme.parchmentText,
                    )),
                const SizedBox(height: 16),

                // First Player (rich text)
                Text(
                  i18n.t(_ns, 'setup.firstPlayerHeading'),
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 8),
                buildRichTextFromString(
                  i18n.t(_ns, 'setup.firstPlayerRoll'),
                  baseStyle: TextStyle(fontSize: 15, color: theme.parchmentText, height: 1.5),
                ),
                const SizedBox(height: 12),

                // Bridge note (rich text)
                buildRichTextFromString(
                  i18n.t(_ns, 'setup.bridgeNote'),
                  baseStyle: TextStyle(fontSize: 15, color: theme.parchmentText, height: 1.5),
                ),
              ],
            ),
          ),
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
            child: Text(
              text,
              style: TextStyle(fontSize: 15, color: color, height: 1.5),
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
