import '../i18n/i18n_service.dart';
import '../models/game_metadata.dart';

/// BoardGameGeek URLs keyed by game ID.
///
const Map<String, String> gameLinks = {
  'castles-of-burgundy':
      'https://boardgamegeek.com/boardgame/271320/the-castles-of-burgundy',
  'quacks':
      'https://boardgamegeek.com/boardgame/244521/the-quacks-of-quedlinburg',
};

/// Builds a list of [GameMetadata] from the [I18nService]'s discovered game
/// namespaces, reading `app.title` and `app.icon` from each namespace.
///
List<GameMetadata> buildGameList(I18nService i18n) {
  return i18n.gameIds.map((id) {
    return GameMetadata(
      id: id,
      title: i18n.t(id, 'app.title'),
      icon: i18n.t(id, 'app.icon'),
    );
  }).toList();
}
