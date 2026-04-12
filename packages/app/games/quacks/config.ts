import { GameConfig } from '@/types/GameConfig';

export const config: GameConfig = {
    id: 'quacks',
    sections: ['overview', 'setup', 'roundStructure', 'endOfRound', 'finalRound'],
    headerColor: '#2d1650',
    bggUrl: 'https://boardgamegeek.com/boardgame/244521/quacks',
    manualUrl: 'https://rulesnap.com/manuals/quacks.pdf',
    subtitleKey: 'header.rulesReference',
    heroStyle: {
        borderBottomColor: '#d4a843',
        borderBottomWidth: 2,
        paddingBottom: 40,
        buttonMarginTop: 12,
    },
    sectionNavLabels: {
        overview: 'overview.sidenav',
        setup: 'setup.title',
        roundStructure: 'roundStructure.title',
        endOfRound: 'endOfRound.sidenav',
        finalRound: 'finalRound.sidenav',
    },
    sectionComponents: {
        overview: () => import('./sections/Overview').then(m => ({ default: m.Overview })),
        setup: () => import('./sections/Setup').then(m => ({ default: m.Setup })),
        roundStructure: () =>
            import('./sections/RoundStructure').then(m => ({ default: m.RoundStructure })),
        endOfRound: () => import('./sections/EndOfRound').then(m => ({ default: m.EndOfRound })),
        finalRound: () => import('./sections/FinalRound').then(m => ({ default: m.FinalRound })),
    },
};
