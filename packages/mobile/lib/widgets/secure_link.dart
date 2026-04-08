import 'package:flutter/material.dart';
import '../utils/external_link.dart';

/// A tappable widget that opens [url] in the device's external browser.
///
/// Wraps [child] in a [GestureDetector]. If no [child] is provided, renders
/// [text] as an underlined link-styled [Text] widget.
///
class SecureLink extends StatelessWidget {
  final String url;
  final Widget? child;
  final String? text;
  final TextStyle? style;

  const SecureLink({
    super.key,
    required this.url,
    this.child,
    this.text,
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    final linkWidget = child ??
        Text(
          text ?? url,
          style: (style ?? DefaultTextStyle.of(context).style).copyWith(
            decoration: TextDecoration.underline,
          ),
        );

    return GestureDetector(
      onTap: () => openExternalLink(url),
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: linkWidget,
      ),
    );
  }
}
