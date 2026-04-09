import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../i18n/i18n_service.dart';
import '../models/game_metadata.dart';
import '../models/nav_item.dart';
import '../theme/game_theme_provider.dart';
import '../theme/home_theme.dart';
import '../utils/constants.dart';
import '../utils/responsive.dart';
import '../widgets/side_nav/side_nav_notifier.dart';

/// Home screen displaying hero, disclaimer, feature cards, game list, and CTA.
///
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Set theme to Home
    final themeProvider =
        Provider.of<GameThemeProvider>(context, listen: false);
    if (themeProvider.config is! HomeThemeConfig) {
      themeProvider.setTheme(HomeThemeConfig());
    }

    // On web, set browser tab title
    if (kIsWeb) {
      final i18n = Provider.of<I18nService>(context, listen: false);
      _setWebTitle(i18n.t('common', 'title'));
    }
  }

  void _setWebTitle(String title) {
    // Uses the platform channel-free approach via dart:ui
    // Title is set through the MaterialApp.title or SystemChrome on web.
    // We rely on the Title widget below instead.
  }

  @override
  Widget build(BuildContext context) {
    final i18n = Provider.of<I18nService>(context);
    final games = buildGameList(i18n);
    final appTitle = i18n.t('common', 'title');

    // Build SideNav groups: one group titled "Games" listing all games
    final sideNavGroups = [
      NavGroup(
        title: i18n.t('common', 'games'),
        items: games
            .map((g) => NavItem(
                  id: g.id,
                  label: i18n.t(g.id, 'app.title'),
                  icon: g.icon,
                  onTap: () => context.go(g.route),
                ))
            .toList(),
      ),
    ];

    // Update SideNav notifier
    Provider.of<SideNavNotifier>(context, listen: false)
        .update(groups: sideNavGroups);

    Widget content = _HomeBody(i18n: i18n, games: games);

    // Wrap with Title widget for web tab title
    if (kIsWeb) {
      content = Title(
        title: appTitle,
        color: Colors.white,
        child: content,
      );
    }

    return content;
  }
}

/// Main scrollable body of the home screen.
class _HomeBody extends StatelessWidget {
  final I18nService i18n;
  final List<GameMetadata> games;

  const _HomeBody({required this.i18n, required this.games});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final screenSize = screenSizeOf(constraints.maxWidth);
        final maxWidth = switch (screenSize) {
          ScreenSize.desktop => 900.0,
          ScreenSize.tablet => 700.0,
          ScreenSize.phone => 600.0,
        };

        return SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 80, 24, 40),
          child: Center(
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: maxWidth),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Hero section
                  _HeroSection(i18n: i18n),
                  const SizedBox(height: 24),

                  // Disclaimer banner
                  _DisclaimerBanner(i18n: i18n),
                  const SizedBox(height: 32),

                  // Feature cards
                  _FeatureCards(i18n: i18n),
                  const SizedBox(height: 32),

                  // Available guides heading + game list
                  _GameList(i18n: i18n, games: games),
                  const SizedBox(height: 32),

                  // CTA text
                  Text(
                    i18n.t('common', 'home-cta'),
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white.withOpacity(0.6),
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

/// Hero section with emoji, title, and subtitle.
class _HeroSection extends StatelessWidget {
  final I18nService i18n;

  const _HeroSection({required this.i18n});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SvgPicture.asset(
          'assets/images/dice.svg',
          width: 200,
          height: 200,
        ),
        const SizedBox(height: 12),
        Text(
          i18n.t('common', 'title'),
          style: const TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Text(
          i18n.t('common', 'home-subtitle'),
          style: TextStyle(
            fontSize: 16,
            color: Colors.white.withOpacity(0.7),
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

/// Disclaimer banner with book icon.
class _DisclaimerBanner extends StatelessWidget {
  final I18nService i18n;

  const _DisclaimerBanner({required this.i18n});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('📖', style: TextStyle(fontSize: 20)),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              i18n.t('common', 'home-disclaimer'),
              style: TextStyle(
                fontSize: 13,
                color: Colors.white.withOpacity(0.7),
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Three feature cards with responsive layout.
class _FeatureCards extends StatelessWidget {
  final I18nService i18n;

  const _FeatureCards({required this.i18n});

  @override
  Widget build(BuildContext context) {
    final features = [
      _FeatureData(
        icon: '⚡',
        title: i18n.t('common', 'home-feature-setup'),
        description: i18n.t('common', 'home-feature-setup-desc'),
      ),
      _FeatureData(
        icon: '📋',
        title: i18n.t('common', 'home-feature-play'),
        description: i18n.t('common', 'home-feature-play-desc'),
      ),
      _FeatureData(
        icon: '🏆',
        title: i18n.t('common', 'home-feature-scoring'),
        description: i18n.t('common', 'home-feature-scoring-desc'),
      ),
    ];

    return ResponsiveBuilder(
      builder: (context, screenSize, width) {
        final cols = responsiveColumns(
          width,
          phoneCols: 1,
          tabletCols: 3,
          desktopCols: 3,
        );

        if (cols == 1) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: features
                .map((f) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: _FeatureCard(feature: f),
                    ))
                .toList(),
          );
        }
        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: features
              .map((f) => Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: _FeatureCard(feature: f),
                    ),
                  ))
              .toList(),
        );
      },
    );
  }
}

class _FeatureData {
  final String icon;
  final String title;
  final String description;

  const _FeatureData({
    required this.icon,
    required this.title,
    required this.description,
  });
}

class _FeatureCard extends StatelessWidget {
  final _FeatureData feature;

  const _FeatureCard({required this.feature});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        children: [
          Text(feature.icon, style: const TextStyle(fontSize: 28)),
          const SizedBox(height: 8),
          Text(
            feature.title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            feature.description,
            style: TextStyle(
              fontSize: 12,
              color: Colors.white.withOpacity(0.6),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

/// Game list section with search filter, heading, and tappable game items.
class _GameList extends StatefulWidget {
  final I18nService i18n;
  final List<GameMetadata> games;

  const _GameList({required this.i18n, required this.games});

  @override
  State<_GameList> createState() => _GameListState();
}

class _GameListState extends State<_GameList> {
  String _query = '';

  List<GameMetadata> get _filteredGames {
    if (_query.isEmpty) return widget.games;
    final lower = _query.toLowerCase();
    return widget.games
        .where((g) => g.title.toLowerCase().contains(lower))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredGames;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.i18n.t('common', 'available-guides'),
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.white.withOpacity(0.9),
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          onChanged: (v) => setState(() => _query = v),
          style: const TextStyle(color: Colors.white, fontSize: 14),
          decoration: InputDecoration(
            hintText: widget.i18n.t('common', 'search-games'),
            hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
            prefixIcon: Icon(Icons.search, color: Colors.white.withOpacity(0.4), size: 20),
            filled: true,
            fillColor: Colors.white.withOpacity(0.05),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
            ),
          ),
        ),
        const SizedBox(height: 12),
        ...filtered.map((game) => _GameListItem(game: game)),
      ],
    );
  }
}

/// Single tappable game item that navigates to the game route.
class _GameListItem extends StatelessWidget {
  final GameMetadata game;

  const _GameListItem({required this.game});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Material(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () => context.go(game.route),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            child: Row(
              children: [
                Text(game.icon, style: const TextStyle(fontSize: 24)),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(
                    game.title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                    ),
                  ),
                ),
                Icon(
                  Icons.chevron_right,
                  color: Colors.white.withOpacity(0.4),
                  size: 22,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
