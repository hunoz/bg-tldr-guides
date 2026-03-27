import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SideNav } from './components/SideNav';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useSideNavStore } from './stores/sidenav';
import { getGameItems } from './utils/sidenav';

function App() {
    const { groups, setGroups } = useSideNavStore();
    const { t } = useTranslation('common');
    const navigate = useNavigate();

    useEffect(() => {
        const gameItems = getGameItems(id => navigate({ to: `/${id}` }));
        setGroups([{ title: t('games'), items: gameItems }]);
    }, []);

    return (
        <>
            <SideNav groups={groups} />
            <Outlet />
        </>
    );
}

export default App;
