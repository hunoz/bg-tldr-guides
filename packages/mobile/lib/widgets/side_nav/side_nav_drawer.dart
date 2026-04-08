import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../i18n/i18n_service.dart';
import '../../models/nav_item.dart';
import '../../theme/game_theme_provider.dart';
import '../secure_link.dart';

/// A slide-in navigation drawer that renders grouped [NavItem]s with
/// theme-agnostic styling from [GameThemeProvider].
///
class SideNavDrawer extends StatelessWidget {
  final List<NavGroup> groups;
  final String? activeItemId;
  final VoidCallback? onClose;

  const SideNavDrawer({
    super.key,
    required this.groups,
    this.activeItemId,
    this.onClose,
  });

  static const double _drawerWidth = 280;
  static const String _githubUrl = 'https://github.com/hunoz/rulesnap';

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<GameThemeProvider>(context);
    final config = themeProvider.config;

    return Stack(
      children: [
        Positioned.fill(
          child: GestureDetector(
            onTap: onClose,
            child: ColoredBox(color: Colors.black.withOpacity(0.4)),
          ),
        ),
        Align(
          alignment: Alignment.centerLeft,
          child: SizedBox(
            width: _drawerWidth,
            child: Material(
              color: config.sideNavBackground,
              elevation: 8,
              child: SafeArea(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildHeader(context, config),
                    Expanded(child: _buildGroupList(config)),
                    _buildFooter(config),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildHeader(BuildContext context, GameThemeConfig config) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: Icon(Icons.close, color: config.sideNavText),
            tooltip: 'Close navigation',
            onPressed: onClose,
          ),
          _LanguageSelector(config: config),
        ],
      ),
    );
  }

  Widget _buildGroupList(GameThemeConfig config) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 4),
      itemCount: groups.length,
      itemBuilder: (context, groupIndex) {
        return _buildGroup(config, groups[groupIndex]);
      },
    );
  }

  Widget _buildGroup(GameThemeConfig config, NavGroup group) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (group.title != null)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Text(
              group.title!,
              style: TextStyle(
                color: config.sideNavText.withOpacity(0.7),
                fontSize: 12,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.5,
              ),
            ),
          ),
        ...group.items.map((item) => _NavItemTile(
              item: item,
              isActive: activeItemId != null && item.id == activeItemId,
              config: config,
              onClose: onClose,
            )),
      ],
    );
  }

  Widget _buildFooter(GameThemeConfig config) {
    return Container(
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(color: config.sideNavText.withOpacity(0.15)),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: SecureLink(
        url: _githubUrl,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.code, size: 16, color: config.sideNavText.withOpacity(0.6)),
            const SizedBox(width: 8),
            Text(
              'GitHub',
              style: TextStyle(
                color: config.sideNavText.withOpacity(0.6),
                fontSize: 13,
                decoration: TextDecoration.underline,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavItemTile extends StatefulWidget {
  final NavItem item;
  final bool isActive;
  final GameThemeConfig config;
  final VoidCallback? onClose;

  const _NavItemTile({
    required this.item,
    required this.isActive,
    required this.config,
    this.onClose,
  });

  @override
  State<_NavItemTile> createState() => _NavItemTileState();
}

class _NavItemTileState extends State<_NavItemTile> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final config = widget.config;
    final isActive = widget.isActive;
    final item = widget.item;
    final textColor = isActive ? config.sideNavActiveText : config.sideNavText;
    final bg = _isHovered && !isActive
        ? config.sideNavHoverBackground
        : Colors.transparent;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: () {
          item.onTap?.call();
          widget.onClose?.call();
        },
        child: Container(
          decoration: BoxDecoration(
            color: bg,
            border: Border(
              left: BorderSide(
                color: isActive ? config.sideNavActiveAccent : Colors.transparent,
                width: 3,
              ),
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Row(
            children: [
              if (item.icon != null) ...[
                Text(item.icon!, style: const TextStyle(fontSize: 18)),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: Text(
                  item.label,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 14,
                    fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Language selector dropdown using a globe icon trigger.
class _LanguageSelector extends StatelessWidget {
  final GameThemeConfig config;
  const _LanguageSelector({required this.config});

  static const _languages = [
    _LangOption(code: 'en', label: 'English'),
    _LangOption(code: 'es-MX', label: 'Español (MX)'),
  ];

  @override
  Widget build(BuildContext context) {
    final i18n = Provider.of<I18nService>(context);
    return PopupMenuButton<String>(
      onSelected: (code) => i18n.setLocaleByCode(code),
      offset: const Offset(0, 40),
      color: config.sideNavBackground,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      itemBuilder: (_) => _languages.map((lang) {
        final isActive = lang.code == i18n.localeCode;
        return PopupMenuItem<String>(
          value: lang.code,
          child: Text(
            lang.label,
            style: TextStyle(
              color: isActive ? config.sideNavActiveText : config.sideNavText,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
              fontSize: 14,
            ),
          ),
        );
      }).toList(),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: config.sideNavText.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.language, color: config.sideNavText, size: 20),
            const SizedBox(width: 4),
            Icon(Icons.arrow_drop_down, color: config.sideNavText, size: 18),
          ],
        ),
      ),
    );
  }
}

class _LangOption {
  final String code;
  final String label;
  const _LangOption({required this.code, required this.label});
}
