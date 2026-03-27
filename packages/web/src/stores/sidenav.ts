import type { NavGroup } from '@/components/SideNav';
import { create } from 'zustand';

interface SideNavStoreStage {
    groups: NavGroup[];
    setGroups: (groups: NavGroup[]) => void;
}

export const useSideNavStore = create<SideNavStoreStage>(set => ({
    groups: [],
    setGroups: groups =>
        set({
            groups,
        }),
}));
