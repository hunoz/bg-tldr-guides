/// Metadata for a discovered game, derived from translation namespaces.
///
/// The [route] is automatically derived from [id] as `'/$id'`.
class GameMetadata {
  final String id;
  final String title;
  final String icon;
  final String route;

  GameMetadata({
    required this.id,
    required this.title,
    required this.icon,
  }) : route = '/$id';
}
