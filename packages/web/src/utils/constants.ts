import i18n, { gameIds } from '@/i18n';
import type { GameId } from '@/types/id';

// Use the untyped i18next `t` to resolve dynamic game namespace keys.
// The strict CustomTypeOptions typing only knows statically-declared namespaces,
// but game namespaces are discovered at runtime via glob.
const t = i18n.t.bind(i18n) as (key: string, opts?: Record<string, unknown>) => string;

export const games: { id: GameId; label: string; icon: string }[] = gameIds.map(id => ({
    id,
    label: t('app.title', { ns: id }),
    icon: t('app.icon', { ns: id }),
}));

export const gameLinks: { [game: GameId]: { bggLink: string } } = {
    'castles-of-burgundy': {
        bggLink: 'https://boardgamegeek.com/boardgame/271320/the-castles-of-burgundy',
    },
};
