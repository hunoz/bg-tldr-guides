import 'package:flutter/widgets.dart';

/// Responsive layout breakpoints and helpers.
///
/// Breakpoints:
/// - Phone:   width < 600
/// - Tablet:  600 ≤ width < 1024
/// - Desktop: width ≥ 1024
///

/// Screen-size category for responsive layout decisions.
enum ScreenSize { phone, tablet, desktop }

/// Returns the [ScreenSize] for the given [width] in logical pixels.
ScreenSize screenSizeOf(double width) {
  if (width >= 1024) return ScreenSize.desktop;
  if (width >= 600) return ScreenSize.tablet;
  return ScreenSize.phone;
}

/// Returns the number of grid columns appropriate for the given [width].
///
/// Typical usage: action cards, monastery cards, feature cards.
/// - Phone:   [phoneCols] (default 1)
/// - Tablet:  [tabletCols] (default 2)
/// - Desktop: [desktopCols] (default 3)
int responsiveColumns(
  double width, {
  int phoneCols = 1,
  int tabletCols = 2,
  int desktopCols = 3,
}) {
  switch (screenSizeOf(width)) {
    case ScreenSize.desktop:
      return desktopCols;
    case ScreenSize.tablet:
      return tabletCols;
    case ScreenSize.phone:
      return phoneCols;
  }
}

/// Computes the width of each item in a responsive grid, given the available
/// [totalWidth], number of [columns], and [spacing] between items.
double responsiveItemWidth(double totalWidth, int columns, double spacing) {
  if (columns <= 1) return totalWidth;
  return (totalWidth - spacing * (columns - 1)) / columns;
}

/// A convenience widget that provides the current [ScreenSize] to its builder.
///
/// Uses [LayoutBuilder] internally so it reacts to the actual available width,
/// not just the screen width.
class ResponsiveBuilder extends StatelessWidget {
  final Widget Function(BuildContext context, ScreenSize screenSize, double width) builder;

  const ResponsiveBuilder({super.key, required this.builder});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        final size = screenSizeOf(width);
        return builder(context, size, width);
      },
    );
  }
}
