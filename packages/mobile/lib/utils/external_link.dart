import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';

/// Opens [url] in the device's default external browser.
///
/// On web, opens in a new tab with `noopener noreferrer` equivalent security
/// attributes via `webOnlyWindowName: '_blank'`.
///
Future<void> openExternalLink(String url) async {
  final uri = Uri.parse(url);
  try {
    await launchUrl(
      uri,
      mode: LaunchMode.externalApplication,
      webOnlyWindowName: '_blank',
    );
  } catch (e) {
    debugPrint('openExternalLink: failed to launch $url: $e');
  }
}
