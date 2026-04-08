import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_web_plugins/url_strategy.dart';

import 'app.dart';
import 'i18n/i18n_service.dart';

/// Application entry point.
///
/// Initializes the Flutter binding, loads translations via [I18nService],
/// then runs [RuleSnapApp].
///
void main() async {
  if (kIsWeb) {
    usePathUrlStrategy();
  }
  WidgetsFlutterBinding.ensureInitialized();

  final i18n = I18nService();
  await i18n.load();

  runApp(RuleSnapApp(i18nService: i18n));
}
