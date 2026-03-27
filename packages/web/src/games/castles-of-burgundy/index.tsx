import { useTranslation } from 'react-i18next';
import './index.css';
import './fonts.css';
import BuildingsSection from './sections/Buildings';
import EndOfGameSection from './sections/EndOfGame';
import GameFlowSection from './sections/GameFlow';
import MonasteriesSection from './sections/Monasteries';
import OverviewSection from './sections/Overview';
import ScoringSection from './sections/Scoring';
import SetupSection from './sections/Setup';
import TileTypesSection from './sections/TileTypes';
import YourTurnSection from './sections/YourTurn';
import { useEffect } from 'react';
import { useSideNavStore } from '@/stores/sidenav';
import { getBackItem, getGameItems } from '@/utils/sidenav';
import type { NavGroup } from '@/components/SideNav';
import { useNavigate } from '@tanstack/react-router';

export default function CastlesOfBurgundy() {
    const common = useTranslation('common');
    const cob = useTranslation('castles-of-burgundy');
    const { setGroups } = useSideNavStore();
    const navigate = useNavigate();

    const sections = [
        { id: 'overview', label: cob.t('overview.sidenav'), icon: '🎯', href: '#overview' },
        { id: 'setup', label: cob.t('setup.sidenav'), icon: '⚙️', href: '#setup' },
        { id: 'game-flow', label: cob.t('gameFlow.sidenav'), icon: '🔄', href: '#game-flow' },
        { id: 'your-turn', label: cob.t('yourTurn.sidenav'), icon: '🎲', href: '#your-turn' },
        { id: 'scoring', label: cob.t('scoring.sidenav'), icon: '⭐', href: '#scoring' },
        { id: 'tile-types', label: cob.t('tileTypes.sidenav'), icon: '🧩', href: '#tile-types' },
        { id: 'buildings', label: cob.t('buildings.sidenav'), icon: '🏠', href: '#buildings' },
        {
            id: 'monasteries',
            label: cob.t('monasteries.sidenav'),
            icon: '⛪',
            href: '#monasteries',
        },
        { id: 'end-of-game', label: cob.t('endOfGame.sidenav'), icon: '🏁', href: '#end-of-game' },
    ];

    const backItem = getBackItem(() =>
        setGroups([
            {
                title: common.t('games'),
                items: gameItems,
            },
        ]),
    );

    const gameItems = getGameItems(id => {
        if (id === window.location.pathname.substring(1)) {
            setGroups([{ title: cob.t('app.title'), items: [backItem, ...sections] }]);
        } else {
            navigate({
                to: `/${id}`,
            });
        }
    });

    const navGroups: NavGroup[] = [{ title: cob.t('app.title'), items: [backItem, ...sections] }];

    useEffect(() => {
        document.title = cob.t('app.title');
        setTimeout(() => {
            setGroups(navGroups);
        }, 300);
    }, []);

    return (
        <div className='cob'>
            <div className='hero'>
                <span className='crest'>🏰</span>
                <h1>{cob.t('app.title')}</h1>
                <p className='subtitle'>{cob.t('app.subtitle')}</p>
            </div>

            <div className='container'>
                <OverviewSection />
                <SetupSection />
                <GameFlowSection />
                <YourTurnSection />
                <ScoringSection />
                <TileTypesSection />
                <BuildingsSection />
                <MonasteriesSection />
                <EndOfGameSection />
            </div>

            <footer>{cob.t('app.footer')}</footer>
        </div>
    );
}
