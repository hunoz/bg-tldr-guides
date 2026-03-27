import i18n from '@/i18n';
import type { GameId } from '@/types/id';

export const games: { id: GameId; label: string; icon?: string }[] = [
    { id: 'castles-of-burgundy', label: i18n.t('castles-of-burgundy:app.title'), icon: '🏰' },
];
