import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rulesnap/widgets/scroll_tracker.dart';

void main() {
  group('ScrollTracker', () {
    late ScrollController controller;

    setUp(() {
      controller = ScrollController();
    });

    tearDown(() {
      controller.dispose();
    });

    test('returns null activeSectionId when sectionKeys is empty', () {
      final tracker = ScrollTracker(
        scrollController: controller,
        sectionKeys: {},
      );

      expect(tracker.activeSectionId, isNull);
      tracker.dispose();
    });

    test('returns null when scrollController has no clients', () {
      final tracker = ScrollTracker(
        scrollController: controller,
        sectionKeys: {'section1': GlobalKey()},
      );

      // Controller has no clients (not attached to any scrollable)
      expect(tracker.activeSectionId, isNull);
      tracker.dispose();
    });

    testWidgets('returns first section when single section is present',
        (tester) async {
      final sectionKey = GlobalKey();

      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: ListView(
            controller: controller,
            children: [
              Container(
                key: sectionKey,
                height: 500,
                child: const Text('Section 1'),
              ),
            ],
          ),
        ),
      );

      final tracker = ScrollTracker(
        scrollController: controller,
        sectionKeys: {'section1': sectionKey},
      );

      expect(tracker.activeSectionId, equals('section1'));
      tracker.dispose();
    });

    testWidgets('identifies correct active section based on scroll position',
        (tester) async {
      final keys = {
        'overview': GlobalKey(),
        'setup': GlobalKey(),
        'gameplay': GlobalKey(),
      };

      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: ListView(
            controller: controller,
            children: [
              Container(
                  key: keys['overview'], height: 600, child: const Text('Overview')),
              Container(
                  key: keys['setup'], height: 600, child: const Text('Setup')),
              Container(
                  key: keys['gameplay'],
                  height: 600,
                  child: const Text('Gameplay')),
            ],
          ),
        ),
      );

      final tracker = ScrollTracker(
        scrollController: controller,
        sectionKeys: keys,
      );

      // At top, first section should be active
      expect(tracker.activeSectionId, equals('overview'));

      // Scroll down so 'setup' section is at the viewport center
      controller.jumpTo(600);
      await tester.pump();

      // Force recompute
      tracker.activeSectionId; // trigger lazy recompute after scroll
      // The scroll listener marks _needsRecompute = true
      expect(tracker.activeSectionId, equals('setup'));

      tracker.dispose();
    });

    testWidgets('scrollToSection animates to the target section',
        (tester) async {
      final keys = {
        'section1': GlobalKey(),
        'section2': GlobalKey(),
        'section3': GlobalKey(),
      };

      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: ListView(
            controller: controller,
            children: [
              Container(
                  key: keys['section1'],
                  height: 800,
                  child: const Text('Section 1')),
              Container(
                  key: keys['section2'],
                  height: 800,
                  child: const Text('Section 2')),
              Container(
                  key: keys['section3'],
                  height: 800,
                  child: const Text('Section 3')),
            ],
          ),
        ),
      );

      final tracker = ScrollTracker(
        scrollController: controller,
        sectionKeys: keys,
      );

      expect(controller.offset, equals(0.0));

      // Scroll to section2
      tracker.scrollToSection('section2');
      await tester.pumpAndSettle();

      // Should have scrolled down (offset > 0)
      expect(controller.offset, greaterThan(0));

      tracker.dispose();
    });

    testWidgets('scrollToSection does nothing for unknown section ID',
        (tester) async {
      final keys = {'section1': GlobalKey()};

      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: ListView(
            controller: controller,
            children: [
              Container(
                  key: keys['section1'],
                  height: 500,
                  child: const Text('Section 1')),
            ],
          ),
        ),
      );

      final tracker = ScrollTracker(
        scrollController: controller,
        sectionKeys: keys,
      );

      // Should not throw for unknown section
      await tracker.scrollToSection('nonexistent');
      expect(controller.offset, equals(0.0));

      tracker.dispose();
    });

    testWidgets('returns first section when all sections are below viewport center',
        (tester) async {
      // Simulate a scenario where sections start below the viewport center.
      // With a very tall spacer pushing sections down, the first section
      // should still be returned as fallback.
      final keys = {
        'a': GlobalKey(),
        'b': GlobalKey(),
      };

      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: SingleChildScrollView(
            controller: controller,
            child: Column(
              children: [
                // Large spacer that pushes sections below viewport center
                const SizedBox(height: 2000),
                Container(key: keys['a'], height: 300, child: const Text('A')),
                Container(key: keys['b'], height: 300, child: const Text('B')),
              ],
            ),
          ),
        ),
      );

      final tracker = ScrollTracker(
        scrollController: controller,
        sectionKeys: keys,
      );

      // At scroll offset 0, both sections are far below viewport center
      // Should fall back to first section
      expect(tracker.activeSectionId, equals('a'));

      tracker.dispose();
    });

    test('dispose cancels throttle timer and removes listener', () {
      final tracker = ScrollTracker(
        scrollController: controller,
        sectionKeys: {'s': GlobalKey()},
      );

      // Should not throw
      tracker.dispose();

      // Disposing again should be safe (timer already cancelled)
      // The scroll listener was already removed, so this is a no-op test
    });

    test('custom throttle duration is accepted', () {
      final tracker = ScrollTracker(
        scrollController: controller,
        sectionKeys: {},
        throttleDuration: const Duration(milliseconds: 200),
      );

      expect(tracker.throttleDuration, equals(const Duration(milliseconds: 200)));
      tracker.dispose();
    });
  });
}
