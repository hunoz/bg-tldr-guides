import { GameConfig } from '@/types/GameConfig';

export const config: GameConfig = {
    id: 'castles-of-burgundy',
    sections: [
        'overview',
        'setup',
        'gameFlow',
        'yourTurn',
        'scoring',
        'tileTypes',
        'buildings',
        'monasteries',
        'endOfGame',
    ],
    headerColor: '#3e2215',
    bggUrl: 'https://boardgamegeek.com/boardgame/271320/the-castles-of-burgundy',
    manualUrl: 'https://rulesnap.com/manuals/castles-of-burgundy.pdf',
    heroStyle: {
        titleColor: '#f0d68a',
        subtitleColor: '#c9a84c',
        borderBottomColor: '#c9a84c',
        borderBottomWidth: 4,
        titleLetterSpacing: 3,
        subtitleFontStyle: 'italic',
        buttonMarginTop: 4,
    },
    sectionComponents: {
        overview: () => import('./sections/Overview').then(m => ({ default: m.Overview })),
        setup: () => import('./sections/Setup').then(m => ({ default: m.Setup })),
        gameFlow: () => import('./sections/GameFlow').then(m => ({ default: m.GameFlow })),
        yourTurn: () => import('./sections/YourTurn').then(m => ({ default: m.YourTurn })),
        scoring: () => import('./sections/Scoring').then(m => ({ default: m.Scoring })),
        tileTypes: () => import('./sections/TileTypes').then(m => ({ default: m.TileTypes })),
        buildings: () => import('./sections/Buildings').then(m => ({ default: m.Buildings })),
        monasteries: () => import('./sections/Monasteries').then(m => ({ default: m.Monasteries })),
        endOfGame: () => import('./sections/EndOfGame').then(m => ({ default: m.EndOfGame })),
    },
};
