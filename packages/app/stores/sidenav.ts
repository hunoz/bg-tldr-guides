import { create } from 'zustand';

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  /** If set, triggers scroll-to-section */
  sectionId?: string;
  /** If set, triggers navigation */
  onSelect?: () => void;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export interface SideNavState {
  groups: NavGroup[];
  setGroups: (groups: NavGroup[]) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const useSideNavStore = create<SideNavState>((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
  activeId: null,
  setActiveId: (activeId) => set({ activeId }),
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));
