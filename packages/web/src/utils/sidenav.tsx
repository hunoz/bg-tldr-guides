import type { GameId } from '@/types/id';
import { games } from './constants';
import i18n from '@/i18n';
import type { NavItem } from '@/components/SideNav';

export const getGameItems = (onSelect: (id: GameId) => void): NavItem[] =>
    games.map(g => ({
        id: g.id,
        label: g.label,
        icon: g.icon,
        onSelect: () => onSelect(g.id),
    }));

export const getBackItem = (onSelect: () => void): NavItem => ({
    id: i18n.t('common:home'),
    label: `← ${i18n.t('common:all-games')}`,
    onSelect: onSelect,
});
