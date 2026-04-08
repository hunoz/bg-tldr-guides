import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// The set of known route paths. Any path not in this set redirects to `/`.
const Set<String> knownRoutes = {'/', '/castles-of-burgundy', '/quacks'};

/// Creates the app [GoRouter] with shell route, redirect, theme switching,
/// and web `?lang=` query parameter sync.
///
/// Platform-specific navigation:
/// - iOS: Cupertino-style back swipe gesture is enabled by default via
///   Flutter's [CupertinoPageTransitionsBuilder] when running on iOS.
/// - Android: System back button is handled by [GoRouter]'s built-in
///   [RootBackButtonDispatcher] which is automatically wired through
///   [MaterialApp.router].
/// - Web: Browser back/forward buttons and URL bar navigation are handled
///   by [GoRouter]'s web integration via [routerConfig] on [MaterialApp.router].
///
GoRouter appRouter({
  required Widget Function(BuildContext, GoRouterState, Widget) shellBuilder,
  required Widget Function(BuildContext, GoRouterState) homeBuilder,
  required Widget Function(BuildContext, GoRouterState) cobBuilder,
  required Widget Function(BuildContext, GoRouterState) quacksBuilder,
}) {
  return GoRouter(
    initialLocation: '/',
    redirect: (BuildContext context, GoRouterState state) {
      final path = state.uri.path;
      if (!knownRoutes.contains(path)) {
        return '/';
      }

      return null;
    },
    routes: [
      ShellRoute(
        builder: shellBuilder,
        routes: [
          GoRoute(
            path: '/',
            builder: homeBuilder,
          ),
          GoRoute(
            path: '/castles-of-burgundy',
            builder: cobBuilder,
          ),
          GoRoute(
            path: '/quacks',
            builder: quacksBuilder,
          ),
        ],
      ),
    ],
  );
}
