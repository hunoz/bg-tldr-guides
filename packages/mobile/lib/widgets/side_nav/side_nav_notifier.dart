import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';

import '../../models/nav_item.dart';

/// A [ChangeNotifier] that screens use to communicate their SideNav
/// configuration upward to [AppShell].
///
/// Each screen calls [update] in its build to set the current groups and
/// active item. [AppShell] listens to this notifier to render the drawer
/// contents.
///
/// Notification is deferred to the next frame to avoid triggering
/// setState/markNeedsBuild during the build phase.
class SideNavNotifier extends ChangeNotifier {
  List<NavGroup> _groups = const [];
  String? _activeItemId;
  bool _notifyScheduled = false;

  List<NavGroup> get groups => _groups;
  String? get activeItemId => _activeItemId;

  void update({required List<NavGroup> groups, String? activeItemId}) {
    final changed = !_listEquals(_groups, groups) ||
        _activeItemId != activeItemId;
    if (!changed) return;

    _groups = groups;
    _activeItemId = activeItemId;

    if (!_notifyScheduled) {
      _notifyScheduled = true;
      SchedulerBinding.instance.addPostFrameCallback((_) {
        _notifyScheduled = false;
        notifyListeners();
      });
    }
  }

  bool _listEquals(List<NavGroup> a, List<NavGroup> b) {
    if (identical(a, b)) return true;
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }
}
