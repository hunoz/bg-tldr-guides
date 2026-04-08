import 'package:flutter/foundation.dart';

/// A single navigation item in the SideNav drawer.
///
/// On the home screen, items represent games (with [onTap] for navigation).
/// On game screens, items represent sections (with [sectionId] for scroll-to).
class NavItem {
  final String id;
  final String label;
  final String? icon;
  final String? sectionId;
  final VoidCallback? onTap;

  const NavItem({
    required this.id,
    required this.label,
    this.icon,
    this.sectionId,
    this.onTap,
  });
}

/// A titled group of [NavItem]s displayed in the SideNav drawer.
class NavGroup {
  final String? title;
  final List<NavItem> items;

  const NavGroup({this.title, required this.items});
}
