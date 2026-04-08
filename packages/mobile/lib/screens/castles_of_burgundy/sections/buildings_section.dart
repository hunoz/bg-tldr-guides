import 'package:flutter/material.dart';

import '../../../i18n/i18n_service.dart';
import '../../../theme/cob_theme.dart';

/// Buildings section: table with icon, name, effect columns.
///
class BuildingsSection extends StatelessWidget {
  final I18nService i18n;
  final CoBThemeConfig theme;

  static const _ns = 'castles-of-burgundy';

  const BuildingsSection({
    super.key,
    required this.i18n,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final items = i18n.tObject(_ns, 'buildings.items') as List? ?? [];
    final columns = i18n.tObject(_ns, 'buildings.columns') as List? ?? [];

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
                  i18n.t(_ns, 'buildings.heading'),
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: theme.parchmentText,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  i18n.t(_ns, 'buildings.subtitle'),
                  style: TextStyle(
                    fontSize: 14,
                    color: theme.parchmentText.withOpacity(0.7),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  i18n.t(_ns, 'buildings.intro'),
                  style: TextStyle(
                    fontSize: 15,
                    color: theme.parchmentText,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 16),
                _BuildingsTable(
                  columns: columns.map((c) => c.toString()).toList(),
                  items: items,
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

class _BuildingsTable extends StatelessWidget {
  final List<String> columns;
  final List<dynamic> items;
  final CoBThemeConfig theme;

  const _BuildingsTable({
    required this.columns,
    required this.items,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    return Table(
      columnWidths: const {
        0: FixedColumnWidth(140),
        1: FlexColumnWidth(),
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
        ...items.map((item) {
          final b = item as Map<String, dynamic>;
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
                    Text(
                      b['icon']?.toString() ?? '',
                      style: const TextStyle(fontSize: 18),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        b['name']?.toString() ?? '',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
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
                  b['effect']?.toString() ?? '',
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
