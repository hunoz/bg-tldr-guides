import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../theme/game_theme_provider.dart';
import 'side_nav/side_nav_drawer.dart';
import 'side_nav/side_nav_notifier.dart';

/// Shell widget that wraps all screens with a [Scaffold], a hamburger toggle
/// button overlay, and the [SideNavDrawer].
///
/// The router's [ShellRoute] passes the current child screen. Each screen is
/// responsible for providing its own SideNav groups and active section via
/// [AppShellState] inherited widget.
///
class AppShell extends StatefulWidget {
  final Widget child;

  const AppShell({super.key, required this.child});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell>
    with SingleTickerProviderStateMixin {
  bool _isDrawerOpen = false;

  late final AnimationController _animationController;
  late final Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 250),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(-1, 0),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _openDrawer() {
    setState(() => _isDrawerOpen = true);
    _animationController.forward();
  }

  void _closeDrawer() {
    _animationController.reverse().then((_) {
      if (mounted) setState(() => _isDrawerOpen = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<GameThemeProvider>(context);
    final config = themeProvider.config;

    // Read SideNav configuration from the SideNavNotifier.
    final sideNav = Provider.of<SideNavNotifier>(context);
    final groups = sideNav.groups;
    final activeItemId = sideNav.activeItemId;

    return Scaffold(
      backgroundColor: config.scaffoldBackground,
      body: Stack(
        children: [
          // Main content
          SelectionArea(child: widget.child),

          // Hamburger toggle button
          Positioned(
            top: MediaQuery.of(context).padding.top + 8,
            left: 8,
            child: _HamburgerButton(
              color: config.sideNavText,
              onPressed: _openDrawer,
            ),
          ),

          // SideNav drawer overlay
          if (_isDrawerOpen)
            SlideTransition(
              position: _slideAnimation,
              child: SideNavDrawer(
                groups: groups,
                activeItemId: activeItemId,
                onClose: _closeDrawer,
              ),
            ),
        ],
      ),
    );
  }
}

/// Hamburger menu icon button.
class _HamburgerButton extends StatelessWidget {
  final Color color;
  final VoidCallback onPressed;

  const _HamburgerButton({required this.color, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: IconButton(
        icon: Icon(Icons.menu, color: color, size: 28),
        tooltip: 'Open navigation',
        onPressed: onPressed,
      ),
    );
  }
}
