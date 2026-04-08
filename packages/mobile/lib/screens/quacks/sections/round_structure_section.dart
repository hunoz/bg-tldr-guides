import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/quacks_theme.dart';
import '../../../widgets/rich_text_widget.dart';

/// Round Structure section: three steps with sub-sections.
///
class RoundStructureSection extends StatelessWidget {
  final I18nService i18n;
  final QuacksThemeConfig theme;

  static const _ns = 'quacks';

  const RoundStructureSection({
    super.key,
    required this.i18n,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final textColor = theme.themeData.textTheme.bodyMedium?.color;
    final accentColor = theme.themeData.colorScheme.primary;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                i18n.t(_ns, 'roundStructure.title'),
                style: theme.themeData.textTheme.headlineMedium,
              ),
              const SizedBox(height: 16),

              // Step 1: Rotate Starting Player
              _StepCard(
                theme: theme,
                stepNumber: 1,
                title: i18n.t(_ns, 'roundStructure.stepOne.title'),
                child: Text(
                  i18n.t(_ns, 'roundStructure.stepOne.passClockwise'),
                  style: TextStyle(
                      fontSize: 14, color: textColor, height: 1.5),
                ),
              ),
              const SizedBox(height: 12),

              // Step 2: Draw a Fortune
              _StepCard(
                theme: theme,
                stepNumber: 2,
                title: i18n.t(_ns, 'roundStructure.stepTwo.title'),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    buildRichTextFromString(
                      i18n.t(_ns,
                          'roundStructure.stepTwo.drawFortuneTellerCard'),
                      baseStyle: TextStyle(
                          fontSize: 14, color: textColor, height: 1.5),
                    ),
                    const SizedBox(height: 8),
                    buildRichTextFromString(
                      i18n.t(_ns, 'roundStructure.stepTwo.purpleCards'),
                      baseStyle: TextStyle(
                          fontSize: 14, color: textColor, height: 1.5),
                    ),
                    const SizedBox(height: 4),
                    buildRichTextFromString(
                      i18n.t(_ns, 'roundStructure.stepTwo.blueCards'),
                      baseStyle: TextStyle(
                          fontSize: 14, color: textColor, height: 1.5),
                    ),
                    const SizedBox(height: 8),
                    // Note callout
                    _CalloutBox(
                      theme: theme,
                      child: buildRichTextFromString(
                        i18n.t(_ns, 'roundStructure.stepTwo.note'),
                        baseStyle: TextStyle(
                            fontSize: 13, color: textColor, height: 1.5),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Step 3: Draw Ingredients
              _StepCard(
                theme: theme,
                stepNumber: 3,
                title: i18n.t(_ns, 'roundStructure.stepThree.title'),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    buildRichTextFromString(
                      i18n.t(_ns, 'roundStructure.stepThree.drawTokens'),
                      baseStyle: TextStyle(
                          fontSize: 14, color: textColor, height: 1.5),
                    ),
                    const SizedBox(height: 16),

                    // Placement sub-section
                    _SubSection(
                      title: i18n.t(
                          _ns, 'roundStructure.stepThree.placement.title'),
                      accentColor: accentColor,
                      child: buildRichTextFromString(
                        i18n.t(_ns,
                            'roundStructure.stepThree.placement.tokenAdvancement'),
                        baseStyle: TextStyle(
                            fontSize: 14, color: textColor, height: 1.5),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Stopping sub-section
                    _SubSection(
                      title: i18n.t(
                          _ns, 'roundStructure.stepThree.stopping.title'),
                      accentColor: accentColor,
                      child: buildRichTextFromString(
                        i18n.t(_ns,
                            'roundStructure.stepThree.stopping.voluntaryStop'),
                        baseStyle: TextStyle(
                            fontSize: 14, color: textColor, height: 1.5),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Exploding sub-section
                    _SubSection(
                      title: i18n.t(
                          _ns, 'roundStructure.stepThree.exploding.title'),
                      accentColor: accentColor,
                      child: buildRichTextFromString(
                        i18n.t(_ns,
                            'roundStructure.stepThree.exploding.exploded'),
                        baseStyle: TextStyle(
                            fontSize: 14, color: textColor, height: 1.5),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Rules sub-section
                    _SubSection(
                      title: i18n.t(
                          _ns, 'roundStructure.stepThree.rules.title'),
                      accentColor: accentColor,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          buildRichTextFromString(
                            i18n.t(_ns,
                                'roundStructure.stepThree.rules.doNotLookInBag'),
                            baseStyle: TextStyle(
                                fontSize: 14,
                                color: textColor,
                                height: 1.5),
                          ),
                          const SizedBox(height: 8),
                          buildRichTextFromString(
                            i18n.t(_ns,
                                'roundStructure.stepThree.rules.flaskUsage'),
                            baseStyle: TextStyle(
                                fontSize: 14,
                                color: textColor,
                                height: 1.5),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// A step card with numbered badge and title.
class _StepCard extends StatelessWidget {
  final QuacksThemeConfig theme;
  final int stepNumber;
  final String title;
  final Widget child;

  const _StepCard({
    required this.theme,
    required this.stepNumber,
    required this.title,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final accentColor = theme.themeData.colorScheme.primary;

    return Container(
      decoration: BoxDecoration(
        color: theme.cardBackground,
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: accentColor.withOpacity(0.2),
                  shape: BoxShape.circle,
                  border: Border.all(color: accentColor, width: 1.5),
                ),
                alignment: Alignment.center,
                child: Text(
                  '$stepNumber',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: accentColor,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: accentColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

/// A sub-section with accent-colored title.
class _SubSection extends StatelessWidget {
  final String title;
  final Color accentColor;
  final Widget child;

  const _SubSection({
    required this.title,
    required this.accentColor,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: accentColor,
          ),
        ),
        const SizedBox(height: 6),
        child,
      ],
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
        color: theme.cardBackground.withOpacity(0.5),
        borderRadius: BorderRadius.circular(8),
        border: Border(
          left: BorderSide(
            color: theme.themeData.colorScheme.primary,
            width: 4,
          ),
        ),
      ),
      padding: const EdgeInsets.all(12),
      child: child,
    );
  }
}
