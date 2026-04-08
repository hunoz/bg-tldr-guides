import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

/// Abstract base class for per-game theme configurations.
///
/// Each game screen provides its own implementation with distinct
/// colors, typography, and SideNav styling.
abstract class GameThemeConfig {
  ThemeData get themeData;
  Color get scaffoldBackground;
  Color get sideNavBackground;
  Color get sideNavText;
  Color get sideNavActiveText;
  Color get sideNavActiveAccent;
  Color get sideNavHoverBackground;
}

/// Holds the current [GameThemeConfig] and notifies listeners on change.
///
/// Notification is deferred to the next frame to avoid triggering
/// setState/markNeedsBuild during the build phase.
class GameThemeProvider extends ChangeNotifier {
  GameThemeConfig _config;
  bool _notifyScheduled = false;

  GameThemeProvider(this._config);

  GameThemeConfig get config => _config;

  void setTheme(GameThemeConfig config) {
    if (_config.runtimeType != config.runtimeType) {
      _config = config;
      if (!_notifyScheduled) {
        _notifyScheduled = true;
        SchedulerBinding.instance.addPostFrameCallback((_) {
          _notifyScheduled = false;
          notifyListeners();
        });
      }
    }
  }
}
