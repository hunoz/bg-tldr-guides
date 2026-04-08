import 'package:flutter_test/flutter_test.dart';
import 'package:rulesnap/utils/responsive.dart';

void main() {
  group('screenSizeOf', () {
    test('returns phone for width < 600', () {
      expect(screenSizeOf(0), ScreenSize.phone);
      expect(screenSizeOf(320), ScreenSize.phone);
      expect(screenSizeOf(599), ScreenSize.phone);
    });

    test('returns tablet for width 600-1023', () {
      expect(screenSizeOf(600), ScreenSize.tablet);
      expect(screenSizeOf(768), ScreenSize.tablet);
      expect(screenSizeOf(1023), ScreenSize.tablet);
    });

    test('returns desktop for width >= 1024', () {
      expect(screenSizeOf(1024), ScreenSize.desktop);
      expect(screenSizeOf(1440), ScreenSize.desktop);
      expect(screenSizeOf(1920), ScreenSize.desktop);
    });
  });

  group('responsiveColumns', () {
    test('returns phoneCols for phone widths', () {
      expect(responsiveColumns(320, phoneCols: 1, tabletCols: 2, desktopCols: 3), 1);
    });

    test('returns tabletCols for tablet widths', () {
      expect(responsiveColumns(768, phoneCols: 1, tabletCols: 2, desktopCols: 3), 2);
    });

    test('returns desktopCols for desktop widths', () {
      expect(responsiveColumns(1440, phoneCols: 1, tabletCols: 2, desktopCols: 3), 3);
    });

    test('uses default column values', () {
      expect(responsiveColumns(320), 1);
      expect(responsiveColumns(768), 2);
      expect(responsiveColumns(1440), 3);
    });
  });

  group('responsiveItemWidth', () {
    test('returns full width for single column', () {
      expect(responsiveItemWidth(600, 1, 12), 600);
    });

    test('accounts for spacing between columns', () {
      // 2 columns with 12px spacing: (600 - 12) / 2 = 294
      expect(responsiveItemWidth(600, 2, 12), 294);
    });

    test('handles 3 columns', () {
      // 3 columns with 12px spacing: (900 - 24) / 3 = 292
      expect(responsiveItemWidth(900, 3, 12), 292);
    });
  });
}
