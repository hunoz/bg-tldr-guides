import { NavGroup, NavItem } from '../stores/sidenav';
import { getGames } from './constants';

/** Build SideNav groups for the home screen with game items. */
export function buildHomeGroups(
    gamesTitle: string,
    onGameSelect: (gameId: string) => void,
): NavGroup[] {
    return [
        {
            title: gamesTitle,
            items: getGames().map(game => ({
                id: game.id,
                label: game.label,
                icon: game.icon,
                onSelect: () => onGameSelect(game.id),
            })),
        },
    ];
}

/** Build a "back to all games" nav item. */
export function buildBackItem(label: string, onSelect: () => void): NavItem {
    return { id: 'back', label, icon: '←', onSelect };
}
