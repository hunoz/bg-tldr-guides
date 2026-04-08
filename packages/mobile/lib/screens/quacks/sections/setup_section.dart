import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/quacks_theme.dart';
import '../../../widgets/rich_text_widget.dart';

/// Setup section: table setup steps with numbered badges, per-player setup
/// with parchment card, starting bag contents table, scoring note callout.
///
class QuacksSetupSection extends StatelessWidget {
  final I18nService i18n;
  final QuacksThemeConfig theme;

  static const _ns = 'quacks';

  const QuacksSetupSection({
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Section title
              Text(
                i18n.t(_ns, 'setup.title'),
                style: theme.themeData.textTheme.headlineMedium,
              ),
              const SizedBox(height: 16),

              // Table Setup card (dark purple)
              _DarkCard(
                theme: theme,
                child: _buildTableSetup(),
              ),
              const SizedBox(height: 16),

              // Per-Player Setup (parchment card)
              _ParchmentCard(
                theme: theme,
                child: _buildPerPlayerSetup(),
              ),
              const SizedBox(height: 16),

              // Scoring note callout
              _CalloutBox(
                theme: theme,
                child: buildRichTextFromString(
                  i18n.t(_ns, 'setup.scoringNote'),
                  baseStyle: TextStyle(
                    fontSize: 14,
                    color: theme.themeData.textTheme.bodyMedium?.color,
                    height: 1.5,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTableSetup() {
    final textColor = theme.themeData.textTheme.bodyMedium?.color;
    final steps = [
      i18n.t(_ns, 'setup.tableSetup.shuffleFortuneTellerDeck'),
      i18n.t(_ns, 'setup.tableSetup.flameMarkerPlacement'),
      i18n.t(_ns, 'setup.tableSetup.chooseIngredientBooks'),
      i18n.t(_ns, 'setup.tableSetup.sortIngredientTokens'),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          i18n.t(_ns, 'setup.tableSetup.header'),
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: theme.themeData.colorScheme.primary,
          ),
        ),
        const SizedBox(height: 12),
        ...steps.asMap().entries.map((entry) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _NumberBadge(number: entry.key + 1, theme: theme),
                  const SizedBox(width: 12),
                  Expanded(
                    child: buildRichTextFromString(
                      entry.value,
                      baseStyle: TextStyle(
                        fontSize: 14,
                        color: textColor,
                        height: 1.5,
                      ),
                    ),
                  ),
                ],
              ),
            )),
      ],
    );
  }

  Widget _buildPerPlayerSetup() {
    final textColor = theme.parchmentText;
    final items = [
      i18n.t(_ns, 'setup.perPlayerSetup.oneCauldronBoard'),
      i18n.t(_ns, 'setup.perPlayerSetup.oneScoringMarker'),
      i18n.t(_ns, 'setup.perPlayerSetup.onePlayerMarker'),
      i18n.t(_ns, 'setup.perPlayerSetup.oneBag'),
      i18n.t(_ns, 'setup.perPlayerSetup.oneRuby'),
      i18n.t(_ns, 'setup.perPlayerSetup.oneFlask'),
      i18n.t(_ns, 'setup.perPlayerSetup.oneDropletMarker'),
      i18n.t(_ns, 'setup.perPlayerSetup.oneRatMarker'),
    ];

    final bagTokens = [
      i18n.t(_ns, 'setup.perPlayerSetup.startingBagContents.white1Bloomberry'),
      i18n.t(_ns, 'setup.perPlayerSetup.startingBagContents.white2Bloomberry'),
      i18n.t(_ns, 'setup.perPlayerSetup.startingBagContents.white3Bloomberry'),
      i18n.t(_ns, 'setup.perPlayerSetup.startingBagContents.orange1Pumpkin'),
      i18n.t(_ns, 'setup.perPlayerSetup.startingBagContents.green1Spider'),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          i18n.t(_ns, 'setup.perPlayerSetup.header'),
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: textColor,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          i18n.t(_ns, 'setup.perPlayerSetup.eachPlayerReceives'),
          style: TextStyle(fontSize: 14, color: textColor, height: 1.5),
        ),
        const SizedBox(height: 8),
        ...items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('• ', style: TextStyle(fontSize: 14, color: textColor)),
                  Expanded(
                    child: buildRichTextFromString(
                      item,
                      baseStyle: TextStyle(
                        fontSize: 14,
                        color: textColor,
                        height: 1.5,
                      ),
                    ),
                  ),
                ],
              ),
            )),
        const SizedBox(height: 16),

        // Starting Bag Contents table
        Text(
          i18n.t(_ns, 'setup.perPlayerSetup.startingBagContents.header'),
          style: TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.bold,
            color: textColor,
          ),
        ),
        const SizedBox(height: 8),
        // Table header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: textColor.withOpacity(0.1),
            borderRadius:
                const BorderRadius.vertical(top: Radius.circular(8)),
          ),
          child: Row(
            children: [
              Expanded(
                flex: 3,
                child: Text(
                  i18n.t(_ns, 'setup.perPlayerSetup.startingBagContents.token'),
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
              ),
              SizedBox(
                width: 40,
                child: Text(
                  i18n.t(_ns, 'setup.perPlayerSetup.startingBagContents.qty'),
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
        // Table rows
        ...bagTokens.asMap().entries.map((entry) {
          final isLast = entry.key == bagTokens.length - 1;
          // White tokens have qty based on value (4, 2, 1), orange=1, green=1
          final quantities = ['4', '2', '1', '1', '1'];
          return Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              border: Border(
                bottom: isLast
                    ? BorderSide.none
                    : BorderSide(color: textColor.withOpacity(0.1)),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  flex: 3,
                  child: buildRichTextFromString(
                    entry.value,
                    baseStyle: TextStyle(
                      fontSize: 13,
                      color: textColor,
                      height: 1.4,
                    ),
                  ),
                ),
                SizedBox(
                  width: 40,
                  child: Text(
                    quantities[entry.key],
                    style: TextStyle(
                      fontSize: 13,
                      color: textColor,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}

/// Numbered circular badge for step lists.
class _NumberBadge extends StatelessWidget {
  final int number;
  final QuacksThemeConfig theme;

  const _NumberBadge({required this.number, required this.theme});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        color: theme.themeData.colorScheme.primary.withOpacity(0.2),
        shape: BoxShape.circle,
        border: Border.all(
          color: theme.themeData.colorScheme.primary,
          width: 1.5,
        ),
      ),
      alignment: Alignment.center,
      child: Text(
        '$number',
        style: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.bold,
          color: theme.themeData.colorScheme.primary,
        ),
      ),
    );
  }
}

/// Dark purple card (uses cardBackground).
class _DarkCard extends StatelessWidget {
  final QuacksThemeConfig theme;
  final Widget child;

  const _DarkCard({required this.theme, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: theme.cardBackground,
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.all(20),
      child: child,
    );
  }
}

/// Parchment card variant (light background with dark text).
class _ParchmentCard extends StatelessWidget {
  final QuacksThemeConfig theme;
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

/// Callout box with left-border accent styling.
class _CalloutBox extends StatelessWidget {
  final QuacksThemeConfig theme;
  final Widget child;

  const _CalloutBox({required this.theme, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: theme.cardBackground,
        borderRadius: BorderRadius.circular(8),
        border: Border(
          left: BorderSide(
            color: theme.themeData.colorScheme.primary,
            width: 4,
          ),
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: child,
    );
  }
}
