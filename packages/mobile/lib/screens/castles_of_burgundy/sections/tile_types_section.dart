import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/cob_theme.dart';

/// Tile Types section: table with colored dot indicators per tile type.
///
class TileTypesSection extends StatelessWidget {
  final I18nService i18n;
  final CoBThemeConfig theme;

  static const _ns = 'castles-of-burgundy';

  /// Maps dotClass values from translation data to actual colors.
  static const _dotColors = <String, Color>{
    'dot-blue': Color(0xFF4169E1),
    'dot-lgreen': Color(0xFF90EE90),
    'dot-beige': Color(0xFFD2B48C),
    'dot-dgreen': Color(0xFF2E8B57),
    'dot-gray': Color(0xFF808080),
    'dot-yellow': Color(0xFFFFD700),
  };

  const TileTypesSection({
    super.key,
    required this.i18n,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final tiles = i18n.tObject(_ns, 'tileTypes.tiles') as List? ?? [];
    final columns = i18n.tObject(_ns, 'tileTypes.columns') as List? ?? [];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: _ParchmentCard(
            theme: theme,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  i18n.t(_ns, 'tileTypes.heading'),
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 16),
                _TileTable(
                  columns: columns.map((c) => c.toString()).toList(),
                  tiles: tiles,
                  theme: theme,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _TileTable extends StatelessWidget {
  final List<String> columns;
  final List<dynamic> tiles;
  final CoBThemeConfig theme;

  const _TileTable({
    required this.columns,
    required this.tiles,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    return Table(
      columnWidths: const {
        0: FixedColumnWidth(100),
        1: FixedColumnWidth(90),
        2: FlexColumnWidth(),
      },
      defaultVerticalAlignment: TableCellVerticalAlignment.top,
      children: [
        // Header row
        TableRow(
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: theme.parchmentText.withOpacity(0.2),
                width: 1,
              ),
            ),
          ),
          children: columns
              .map((col) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      col,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: theme.parchmentText.withOpacity(0.7),
                      ),
                    ),
                  ))
              .toList(),
        ),
        // Data rows
        ...tiles.map((tile) {
          final t = tile as Map<String, dynamic>;
          final dotClass = t['dotClass']?.toString() ?? '';
          final dotColor =
              TileTypesSection._dotColors[dotClass] ?? Colors.grey;

          return TableRow(
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: theme.parchmentText.withOpacity(0.08),
                  width: 1,
                ),
              ),
            ),
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Row(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: dotColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        t['color']?.toString() ?? '',
                        style: TextStyle(
                          fontSize: 14,
                          color: theme.parchmentText,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Text(
                  t['type']?.toString() ?? '',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: theme.parchmentText,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Text(
                  t['desc']?.toString() ?? '',
                  style: TextStyle(
                    fontSize: 14,
                    color: theme.parchmentText,
                    height: 1.4,
                  ),
                ),
              ),
            ],
          );
        }),
      ],
    );
  }
}

class _ParchmentCard extends StatelessWidget {
  final CoBThemeConfig theme;
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
