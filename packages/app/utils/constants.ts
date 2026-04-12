import i18n from 'i18next';
import { gameIds } from '../games/registry';

/**
 * Base URL for the web app / CDN where manuals and other assets are hosted.
 * On web this could be relative, but native apps need a full URL.
 * Update this to match your deployed domain.
 */
export const SITE_BASE_URL = 'https://rulesnap.com';

/** Build a full URL for a game manual PDF. */
export function getManualUrl(gameId: string): string {
    return `${SITE_BASE_URL}/manuals/${gameId}.pdf`;
}

export interface GameInfo {
    id: string;
    label: string;
    icon: string;
}

/** Derive game list from translation namespaces. */
export function getGames(): GameInfo[] {
    return gameIds.map(id => ({
        id,
        label: i18n.t('app.title', { ns: id }),
        icon: i18n.t('app.icon', { ns: id }),
    }));
}
