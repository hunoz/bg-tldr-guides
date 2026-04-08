import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'i18n/i18n_service.dart';
import 'router.dart';
import 'screens/castles_of_burgundy/castles_of_burgundy_screen.dart';
import 'screens/home_screen.dart';
import 'screens/quacks/quacks_screen.dart';
import 'theme/game_theme_provider.dart';
import 'theme/home_theme.dart';
import 'widgets/app_shell.dart';
import 'widgets/side_nav/side_nav_notifier.dart';

/// Root application widget.
///
/// Wraps the widget tree with [MultiProvider] for [GameThemeProvider] and
/// [I18nService], then builds a [MaterialApp.router] with [GoRouter]
/// configuration and flutter_localizations delegates.
///
/// Platform-specific navigation is handled via [GoRouter] + [MaterialApp.router]:
/// - iOS: Cupertino-style back swipe gesture (Req 11.1) via
///   [CupertinoPageTransitionsBuilder] in the theme's [pageTransitionsTheme].
/// - Android: System back button (Req 11.2) via [GoRouter]'s built-in
///   [RootBackButtonDispatcher].
/// - Web: Browser back/forward and URL bar (Req 11.3) via [GoRouter]'s
///   web integration through [routerConfig].
///
class RuleSnapApp extends StatefulWidget {
  final I18nService i18nService;

  const RuleSnapApp({super.key, required this.i18nService});

  @override
  State<RuleSnapApp> createState() => _RuleSnapAppState();
}

class _RuleSnapAppState extends State<RuleSnapApp> {
  late final GameThemeProvider _themeProvider;
  late final SideNavNotifier _sideNavNotifier;
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _themeProvider = GameThemeProvider(HomeThemeConfig());
    _sideNavNotifier = SideNavNotifier();
    _router = appRouter(
      shellBuilder: (context, state, child) => AppShell(child: child),
      homeBuilder: (context, state) => const HomeScreen(),
      cobBuilder: (context, state) => const CastlesOfBurgundyScreen(),
      quacksBuilder: (context, state) => const QuacksScreen(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<GameThemeProvider>.value(value: _themeProvider),
        ChangeNotifierProvider<I18nService>.value(value: widget.i18nService),
        ChangeNotifierProvider<SideNavNotifier>.value(value: _sideNavNotifier),
      ],
      child: Consumer<GameThemeProvider>(
        builder: (context, themeProvider, _) {
          return MaterialApp.router(
            title: 'RuleSnap',
            debugShowCheckedModeBanner: false,
            theme: themeProvider.config.themeData,
            routerConfig: _router,
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [
              Locale('en'),
              Locale('es', 'MX'),
            ],
          );
        },
      ),
    );
  }
}
