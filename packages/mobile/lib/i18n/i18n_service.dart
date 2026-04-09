import 'dart:convert';
import 'dart:ui';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// Supported locales for the app.
const Set<String> supportedLocales = {'en', 'es-MX'};

/// The default fallback locale.
const String defaultLocale = 'en';

/// Service that loads JSON translation files organized by namespace and locale,
/// detects the device locale, resolves dot-separated keys, and notifies
/// listeners on locale changes.
///
class I18nService extends ChangeNotifier {
  I18nService();

  /// Current active locale code (e.g. 'en', 'es-MX').
  String _localeCode = defaultLocale;

  /// namespace -> locale -> parsed JSON map
  final Map<String, Map<String, Map<String, dynamic>>> _translations = {};

  /// Discovered namespace names (directory names under assets/i18n/).
  final List<String> _namespaces = [];

  /// The current locale code.
  String get localeCode => _localeCode;

  /// All discovered game IDs — namespace names excluding 'common'.
  List<String> get gameIds =>
      _namespaces.where((ns) => ns != 'common').toList();

  /// Load all translation JSON files from the asset bundle.
  ///
  /// Discovers namespaces by reading the asset manifest, then loads each
  /// `{namespace}/{locale}.json` file found. Detects the device locale and
  /// optionally applies a `?lang=` override on web.
  Future<void> load({AssetBundle? bundle, String? langOverride}) async {
    final assetBundle = bundle ?? rootBundle;

    // Discover namespaces from the asset manifest.
    final manifestJson = await assetBundle.loadString('AssetManifest.json');
    final Map<String, dynamic> manifest = json.decode(manifestJson);

    final namespaceSet = <String>{};
    for (final key in manifest.keys) {
      if (key.startsWith('assets/i18n/')) {
        // e.g. 'assets/i18n/common/en.json' -> 'common'
        final parts = key.split('/');
        if (parts.length >= 4) {
          namespaceSet.add(parts[2]);
        }
      }
    }

    _namespaces
      ..clear()
      ..addAll(namespaceSet.toList()..sort());

    // Load all JSON files per namespace per locale.
    for (final ns in _namespaces) {
      _translations[ns] ??= {};
      for (final locale in supportedLocales) {
        final path = 'assets/i18n/$ns/$locale.json';
        if (manifest.containsKey(path)) {
          try {
            final content = await assetBundle.loadString(path);
            _translations[ns]![locale] = json.decode(content);
          } catch (e) {
            // Malformed JSON — skip this file.
            debugPrint('I18nService: failed to load $path: $e');
          }
        }
      }
    }

    // Resolve locale: langOverride > device locale > fallback.
    if (langOverride != null && supportedLocales.contains(langOverride)) {
      _localeCode = langOverride;
    } else {
      _localeCode = _resolveLocale(PlatformDispatcher.instance.locale);
    }

    notifyListeners();
  }

  /// Switch to a new locale and reload translations aren't needed since all
  /// locales are pre-loaded. Just switches the active locale and notifies.
  void setLocale(Locale locale) {
    final code = _resolveLocale(locale);
    if (code != _localeCode) {
      _localeCode = code;
      notifyListeners();
    }
  }

  /// Set locale by string code directly.
  void setLocaleByCode(String code) {
    final resolved =
        supportedLocales.contains(code) ? code : defaultLocale;
    if (resolved != _localeCode) {
      _localeCode = resolved;
      notifyListeners();
    }
  }

  /// Resolve a translated string by namespace and dot-separated key.
  ///
  /// Walks the nested JSON map level by level. Returns the key string itself
  /// on miss, matching i18next default behavior.
  String t(String namespace, String key) {
    final value = _resolve(namespace, key);
    if (value is String) return value;
    // If the value is not a string (e.g. list/map), return the key.
    return key;
  }

  /// Resolve a translated object (list or map) for complex structures.
  ///
  /// Returns `null` if the key is not found or the namespace doesn't exist.
  dynamic tObject(String namespace, String key) {
    return _resolve(namespace, key);
  }

  /// Internal key resolution: walks dot-separated path through nested maps.
  dynamic _resolve(String namespace, String key) {
    final nsMap = _translations[namespace];
    if (nsMap == null) return null;

    // Try current locale first, then fall back to 'en'.
    final data = nsMap[_localeCode] ?? nsMap[defaultLocale];
    if (data == null) return null;

    return resolveKeyPath(data, key);
  }

  /// Resolve a locale to a supported locale code.
  String _resolveLocale(Locale locale) {
    // Try full match first (e.g. 'es-MX').
    final full = '${locale.languageCode}-${locale.countryCode ?? ''}';
    if (supportedLocales.contains(full)) return full;

    // Try language-only match (e.g. 'en').
    if (supportedLocales.contains(locale.languageCode)) {
      return locale.languageCode;
    }

    return defaultLocale;
  }
}

/// Walk a dot-separated key path through a nested map.
///
/// Exposed as a top-level function so property tests can validate the
/// resolution logic independently.
dynamic resolveKeyPath(Map<String, dynamic> data, String key) {
  final segments = key.split('.');
  dynamic current = data;
  for (final segment in segments) {
    if (current is Map<String, dynamic> && current.containsKey(segment)) {
      current = current[segment];
    } else {
      return null;
    }
  }
  return current;
}
