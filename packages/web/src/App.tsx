import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SideNav } from './components/SideNav';
import { Outlet, useNavigate, useSearch } from '@tanstack/react-router';
import { useSideNavStore } from './stores/sidenav';
import { getGameItems } from './utils/sidenav';

function App() {
    const { groups, setGroups } = useSideNavStore();
    const { t, i18n } = useTranslation('common');
    const navigate = useNavigate();
    const search = useSearch({ strict: false }) as Record<string, string | undefined>;

    // Sync i18next language when the `lng` querystring changes client-side
    useEffect(() => {
        const lng = search.lng;
        if (lng && lng !== i18n.language) {
            i18n.changeLanguage(lng);
        }
    }, [search.lng, i18n]);

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
