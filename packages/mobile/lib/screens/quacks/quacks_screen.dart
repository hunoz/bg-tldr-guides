import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../i18n/i18n_service.dart';
import '../../models/nav_item.dart';
import '../../theme/game_theme_provider.dart';
import '../../theme/quacks_theme.dart';
import '../../utils/responsive.dart';
import '../../widgets/game_header_buttons.dart';
import '../../widgets/scroll_tracker.dart';
import '../../widgets/side_nav/side_nav_notifier.dart';
import 'sections/end_of_round_section.dart';
import 'sections/final_round_section.dart';
import 'sections/overview_section.dart';
import 'sections/round_structure_section.dart';
import 'sections/setup_section.dart';

/// Quacks of Quedlinburg game screen with 5 scrollable sections,
/// scroll-tracked SideNav, and dark purple theming.
///
class QuacksScreen extends StatefulWidget {
  const QuacksScreen({super.key});

  @override
  State<QuacksScreen> createState() => _QuacksScreenState();
}

class _QuacksScreenState extends State<QuacksScreen> {
  static const _namespace = 'quacks';

  late final ScrollController _scrollController;
  late final Map<String, GlobalKey> _sectionKeys;
  late final ScrollTracker _scrollTracker;

  static const _sectionIds = [
    'overview',
    'setup',
    'roundStructure',
    'endOfRound',
    'finalRound',
  ];

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _sectionKeys = {
      for (final id in _sectionIds) id: GlobalKey(),
    };
    _scrollTracker = ScrollTracker(
      scrollController: _scrollController,
      sectionKeys: _sectionKeys,
    );
    _scrollController.addListener(_onScroll);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final themeProvider =
        Provider.of<GameThemeProvider>(context, listen: false);
    if (themeProvider.config is! QuacksThemeConfig) {
      themeProvider.setTheme(QuacksThemeConfig());
    }
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollTracker.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final i18n = Provider.of<I18nService>(context);
    final gameTitle = i18n.t(_namespace, 'app.title');
    final activeSection = _scrollTracker.activeSectionId;

    // Build SideNav groups
    final sideNavGroups = [
      NavGroup(
        items: [
          NavItem(
            id: 'back',
            label: '← ${i18n.t('common', 'all-games')}',
            onTap: () => context.go('/'),
          ),
          ..._sectionIds.map((id) => NavItem(
                id: id,
                label: i18n.t(_namespace, '$id.title'),
                sectionId: id,
                onTap: () => _scrollTracker.scrollToSection(id),
              )),
        ],
      ),
    ];

    // Update SideNav notifier
    Provider.of<SideNavNotifier>(context, listen: false)
        .update(groups: sideNavGroups, activeItemId: activeSection);

    Widget content = _QuacksBody(
      i18n: i18n,
      scrollController: _scrollController,
      sectionKeys: _sectionKeys,
    );

    // Web tab title
    if (kIsWeb) {
      content = Title(
        title: gameTitle,
        color: Colors.white,
        child: content,
      );
    }

    return content;
  }
}

/// Main scrollable body of the Quacks screen.
class _QuacksBody extends StatelessWidget {
  final I18nService i18n;
  final ScrollController scrollController;
  final Map<String, GlobalKey> sectionKeys;

  const _QuacksBody({
    required this.i18n,
    required this.scrollController,
    required this.sectionKeys,
  });

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<GameThemeProvider>(context);
    if (themeProvider.config is! QuacksThemeConfig) {
      return const SizedBox.shrink();
    }
    final quacksTheme = themeProvider.config as QuacksThemeConfig;

    return LayoutBuilder(
      builder: (context, constraints) {
        final screenSize = screenSizeOf(constraints.maxWidth);
        final maxWidth = switch (screenSize) {
          ScreenSize.desktop => 900.0,
          ScreenSize.tablet => 700.0,
          ScreenSize.phone => 600.0,
        };

        return CustomScrollView(
          controller: scrollController,
          slivers: [
            // Header
            SliverToBoxAdapter(child: _Header(i18n: i18n, theme: quacksTheme, maxWidth: maxWidth)),

            // Section widgets as slivers
            SliverToBoxAdapter(
              child: QuacksOverviewSection(
                  key: sectionKeys['overview'], i18n: i18n, theme: quacksTheme),
            ),
            SliverToBoxAdapter(
              child: QuacksSetupSection(
                  key: sectionKeys['setup'], i18n: i18n, theme: quacksTheme),
            ),
            SliverToBoxAdapter(
              child: RoundStructureSection(
                  key: sectionKeys['roundStructure'],
                  i18n: i18n,
                  theme: quacksTheme),
            ),
            SliverToBoxAdapter(
              child: EndOfRoundSection(
                  key: sectionKeys['endOfRound'], i18n: i18n, theme: quacksTheme),
            ),
            SliverToBoxAdapter(
              child: FinalRoundSection(
                  key: sectionKeys['finalRound'], i18n: i18n, theme: quacksTheme),
            ),

            // Bottom spacing
            const SliverToBoxAdapter(child: SizedBox(height: 48)),
          ],
        );
      },
    );
  }
}

/// Header with game title, subtitle, and decorative divider.
class _Header extends StatelessWidget {
  final I18nService i18n;
  final QuacksThemeConfig theme;
  final double maxWidth;

  static const _namespace = 'quacks';

  const _Header({required this.i18n, required this.theme, this.maxWidth = 600});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 80, 24, 24),
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: Column(
            children: [
              Text(
                i18n.t(_namespace, 'app.icon'),
                style: const TextStyle(fontSize: 56),
              ),
              const SizedBox(height: 12),
              Text(
                i18n.t(_namespace, 'app.title'),
                style: theme.themeData.textTheme.headlineLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              GameHeaderButtons(
                gameId: _namespace,
              ),
              const SizedBox(height: 12),
              Text(
                i18n.t(_namespace, 'header.rulesReference'),
                style: TextStyle(
                  fontSize: 16,
                  color: theme.themeData.textTheme.bodyMedium?.color
                      ?.withOpacity(0.7),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              // Decorative divider
              Text(
                '⚗️',
                style: TextStyle(
                  fontSize: 24,
                  color: theme.themeData.textTheme.bodyMedium?.color
                      ?.withOpacity(0.4),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
