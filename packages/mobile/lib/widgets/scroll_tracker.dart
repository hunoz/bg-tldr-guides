import 'dart:async';

import 'package:flutter/widgets.dart';

/// Replaces the web app's IntersectionObserver pattern.
///
/// Uses [ScrollController] + [GlobalKey] per section to determine which
/// section is currently visible in the viewport. Scroll events are throttled
/// to avoid excessive computation.
class ScrollTracker {
  ScrollTracker({
    required this.scrollController,
    required this.sectionKeys,
    this.throttleDuration = const Duration(milliseconds: 100),
  }) {
    scrollController.addListener(_onScroll);
  }

  final ScrollController scrollController;
  final Map<String, GlobalKey> sectionKeys;
  final Duration throttleDuration;

  Timer? _throttleTimer;
  String? _cachedActiveSectionId;
  bool _needsRecompute = true;

  /// Returns the ID of the section currently most visible in the viewport.
  ///
  /// Computes which section's top edge is closest to (but not below) the
  /// viewport's center observation point. If no section is above the
  /// observation point, returns the first section.
  String? get activeSectionId {
    if (_needsRecompute) {
      _cachedActiveSectionId = _computeActiveSectionId();
      _needsRecompute = false;
    }
    return _cachedActiveSectionId;
  }

  /// Scroll to a section by ID with smooth animation.
  Future<void> scrollToSection(String sectionId) async {
    final key = sectionKeys[sectionId];
    if (key == null) return;

    final context = key.currentContext;
    if (context == null) return;

    final renderObject = context.findRenderObject();
    if (renderObject == null || renderObject is! RenderBox) return;

    if (!scrollController.hasClients) return;

    final scrollableState = Scrollable.maybeOf(context);
    if (scrollableState == null) return;

    final scrollableRenderObject = scrollableState.context.findRenderObject();
    if (scrollableRenderObject == null) return;

    final offset = renderObject.localToGlobal(
      Offset.zero,
      ancestor: scrollableRenderObject,
    );

    final targetOffset = scrollController.offset + offset.dy;
    final clampedOffset = targetOffset.clamp(
      scrollController.position.minScrollExtent,
      scrollController.position.maxScrollExtent,
    );

    await scrollController.animateTo(
      clampedOffset,
      duration: const Duration(milliseconds: 400),
      curve: Curves.easeInOut,
    );
  }

  /// Dispose of the throttle timer and remove the scroll listener.
  void dispose() {
    _throttleTimer?.cancel();
    scrollController.removeListener(_onScroll);
  }

  void _onScroll() {
    if (_throttleTimer?.isActive ?? false) return;

    _needsRecompute = true;
    _throttleTimer = Timer(throttleDuration, () {
      _needsRecompute = true;
    });
  }

  String? _computeActiveSectionId() {
    if (sectionKeys.isEmpty) return null;
    if (!scrollController.hasClients) return null;

    final position = scrollController.position;
    final viewportHeight = position.viewportDimension;
    final observationPoint = viewportHeight / 2;

    String? bestId;
    double bestDistance = double.infinity;

    for (final entry in sectionKeys.entries) {
      final key = entry.value;
      final context = key.currentContext;
      if (context == null) continue;

      final renderObject = context.findRenderObject();
      if (renderObject == null || renderObject is! RenderBox) continue;

      // Skip if the render object is not attached to the tree
      if (!renderObject.attached) continue;

      double sectionTop;
      try {
        // Get the section's position relative to the viewport
        final globalOffset = renderObject.localToGlobal(Offset.zero);
        sectionTop = globalOffset.dy;
      } catch (_) {
        // Gracefully skip sections with invalid render state
        continue;
      }

      // We want the section whose top edge is closest to (but not below)
      // the observation point. A section is "above" the observation point
      // when its top is <= the observation point.
      if (sectionTop <= observationPoint) {
        final distance = observationPoint - sectionTop;
        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = entry.key;
        }
      }
    }

    // If no section is above the observation point, return the first section
    if (bestId == null && sectionKeys.isNotEmpty) {
      bestId = sectionKeys.keys.first;
    }

    return bestId;
  }

  /// Pure function that computes the active section ID from a map of section
  /// top offsets and an observation point. Exposed for property-based testing.
  ///
  /// Returns the ID of the section whose top edge is closest to (but not
  /// below) [observationPoint]. If no section is at or above the observation
  /// point, returns the first key in [sectionTops].
  /// Returns `null` if [sectionTops] is empty.
  static String? computeActiveSection(
    Map<String, double> sectionTops,
    double observationPoint,
  ) {
    if (sectionTops.isEmpty) return null;

    String? bestId;
    double bestDistance = double.infinity;

    for (final entry in sectionTops.entries) {
      final sectionTop = entry.value;
      if (sectionTop <= observationPoint) {
        final distance = observationPoint - sectionTop;
        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = entry.key;
        }
      }
    }

    // If no section is above the observation point, return the first section
    if (bestId == null) {
      bestId = sectionTops.keys.first;
    }

    return bestId;
  }
}
