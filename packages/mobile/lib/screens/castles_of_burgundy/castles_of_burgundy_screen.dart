import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../i18n/i18n_service.dart';
import '../../models/nav_item.dart';
import '../../theme/cob_theme.dart';
import '../../theme/game_theme_provider.dart';
import '../../utils/constants.dart';
import '../../utils/responsive.dart';
import '../../widgets/game_header_buttons.dart';
import '../../widgets/scroll_tracker.dart';
import '../../widgets/secure_link.dart';
import '../../widgets/side_nav/side_nav_notifier.dart';
import 'sections/buildings_section.dart';
import 'sections/end_of_game_section.dart';
import 'sections/game_flow_section.dart';
import 'sections/monasteries_section.dart';
import 'sections/overview_section.dart';
import 'sections/scoring_section.dart';
import 'sections/setup_section.dart';
import 'sections/tile_types_section.dart';
import 'sections/your_turn_section.dart';

/// Castles of Burgundy game screen with 9 scrollable sections,
/// scroll-tracked SideNav, and parchment-themed styling.
///
class CastlesOfBurgundyScreen extends StatefulWidget {
  const CastlesOfBurgundyScreen({super.key});

  @override
  State<CastlesOfBurgundyScreen> createState() =>
      _CastlesOfBurgundyScreenState();
}

class _CastlesOfBurgundyScreenState extends State<CastlesOfBurgundyScreen> {
  static const _namespace = 'castles-of-burgundy';

  late final ScrollController _scrollController;
  late final Map<String, GlobalKey> _sectionKeys;
  late final ScrollTracker _scrollTracker;

  static const _sectionIds = [
    'overview',
    'setup',
    'gameFlow',
    'yourTurn',
    'scoring',
    'tileTypes',
    'buildings',
    'monasteries',
    'endOfGame',
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
    // Set theme to CoB
    final themeProvider =
        Provider.of<GameThemeProvider>(context, listen: false);
    if (themeProvider.config is! CoBThemeConfig) {
      themeProvider.setTheme(CoBThemeConfig());
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
                label: i18n.t(_namespace, '$id.sidenav'),
                sectionId: id,
                onTap: () => _scrollTracker.scrollToSection(id),
              )),
        ],
      ),
    ];

    // Update SideNav notifier
    Provider.of<SideNavNotifier>(context, listen: false)
        .update(groups: sideNavGroups, activeItemId: activeSection);

    Widget content = _CoBBody(
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


/// Main scrollable body of the CoB screen.
class _CoBBody extends StatelessWidget {
  final I18nService i18n;
  final ScrollController scrollController;
  final Map<String, GlobalKey> sectionKeys;

  static const _namespace = 'castles-of-burgundy';

  const _CoBBody({
    required this.i18n,
    required this.scrollController,
    required this.sectionKeys,
  });

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<GameThemeProvider>(context);
    if (themeProvider.config is! CoBThemeConfig) {
      return const SizedBox.shrink();
    }
    final cobTheme = themeProvider.config as CoBThemeConfig;

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
            // Hero banner
            SliverToBoxAdapter(child: _HeroBanner(i18n: i18n, theme: cobTheme, maxWidth: maxWidth)),

            // Section widgets as slivers
            SliverToBoxAdapter(
              child: OverviewSection(key: sectionKeys['overview'], i18n: i18n, theme: cobTheme),
            ),
            SliverToBoxAdapter(
              child: SetupSection(key: sectionKeys['setup'], i18n: i18n, theme: cobTheme),
            ),
            SliverToBoxAdapter(
              child: GameFlowSection(key: sectionKeys['gameFlow'], i18n: i18n, theme: cobTheme),
            ),
            SliverToBoxAdapter(
              child: YourTurnSection(key: sectionKeys['yourTurn'], i18n: i18n, theme: cobTheme),
            ),
            SliverToBoxAdapter(
              child: ScoringSection(key: sectionKeys['scoring'], i18n: i18n, theme: cobTheme),
            ),
            SliverToBoxAdapter(
              child: TileTypesSection(key: sectionKeys['tileTypes'], i18n: i18n, theme: cobTheme),
            ),
            SliverToBoxAdapter(
              child: BuildingsSection(key: sectionKeys['buildings'], i18n: i18n, theme: cobTheme),
            ),
            SliverToBoxAdapter(
              child: MonasteriesSection(key: sectionKeys['monasteries'], i18n: i18n, theme: cobTheme),
            ),
            SliverToBoxAdapter(
              child: EndOfGameSection(key: sectionKeys['endOfGame'], i18n: i18n, theme: cobTheme),
            ),

            // Footer
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 32),
                child: Text(
                  i18n.t(_namespace, 'app.footer'),
                  style: TextStyle(
                    fontSize: 14,
                    color: cobTheme.themeData.textTheme.bodyMedium?.color?.withOpacity(0.6),
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

/// Hero banner with tappable crest, title, and subtitle.
class _HeroBanner extends StatelessWidget {
  final I18nService i18n;
  final CoBThemeConfig theme;
  final double maxWidth;

  static const _namespace = 'castles-of-burgundy';

  const _HeroBanner({required this.i18n, required this.theme, this.maxWidth = 600});

  @override
  Widget build(BuildContext context) {
    final bggLink = gameLinks[_namespace] ?? '';

    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 80, 24, 24),
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: Column(
            children: [
              // Crest icon
              const Text('🏰', style: TextStyle(fontSize: 56)),
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
                i18n.t(_namespace, 'app.subtitle'),
                style: TextStyle(
                  fontSize: 16,
                  color: theme.themeData.textTheme.bodyMedium?.color?.withOpacity(0.7),
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

