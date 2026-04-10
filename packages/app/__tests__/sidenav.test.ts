import { useSideNavStore, NavGroup } from '../stores/sidenav';

/**
 * Unit tests for the Zustand SideNav store.
 *
 * Verifies state transitions for setGroups, setActiveId, toggle, and close.
 */

/** Reset the store to its initial state before each test. */
beforeEach(() => {
  useSideNavStore.setState({
    groups: [],
    activeId: null,
    isOpen: false,
  });
});

describe('SideNav store — setGroups', () => {
  it('should start with an empty groups array', () => {
    expect(useSideNavStore.getState().groups).toEqual([]);
  });

  it('should update groups when setGroups is called', () => {
    const groups: NavGroup[] = [
      {
        title: 'Games',
        items: [
          { id: 'cob', label: 'Castles of Burgundy', icon: '🏰' },
          { id: 'quacks', label: 'Quacks', icon: '⚗️' },
        ],
      },
    ];

    useSideNavStore.getState().setGroups(groups);
    expect(useSideNavStore.getState().groups).toEqual(groups);
  });

  it('should replace previous groups entirely', () => {
    const first: NavGroup[] = [{ items: [{ id: 'a', label: 'A' }] }];
    const second: NavGroup[] = [{ items: [{ id: 'b', label: 'B' }] }];

    useSideNavStore.getState().setGroups(first);
    useSideNavStore.getState().setGroups(second);

    expect(useSideNavStore.getState().groups).toEqual(second);
    expect(useSideNavStore.getState().groups).not.toEqual(first);
  });

  it('should accept an empty array to clear groups', () => {
    useSideNavStore.getState().setGroups([{ items: [{ id: 'x', label: 'X' }] }]);
    useSideNavStore.getState().setGroups([]);

    expect(useSideNavStore.getState().groups).toEqual([]);
  });
});

describe('SideNav store — setActiveId', () => {
  it('should start with activeId as null', () => {
    expect(useSideNavStore.getState().activeId).toBeNull();
  });

  it('should set activeId to a string value', () => {
    useSideNavStore.getState().setActiveId('overview');
    expect(useSideNavStore.getState().activeId).toBe('overview');
  });

  it('should update activeId when called again', () => {
    useSideNavStore.getState().setActiveId('overview');
    useSideNavStore.getState().setActiveId('setup');

    expect(useSideNavStore.getState().activeId).toBe('setup');
  });

  it('should reset activeId to null', () => {
    useSideNavStore.getState().setActiveId('scoring');
    useSideNavStore.getState().setActiveId(null);

    expect(useSideNavStore.getState().activeId).toBeNull();
  });
});

describe('SideNav store — toggle', () => {
  it('should start closed (isOpen = false)', () => {
    expect(useSideNavStore.getState().isOpen).toBe(false);
  });

  it('should open when toggled from closed', () => {
    useSideNavStore.getState().toggle();
    expect(useSideNavStore.getState().isOpen).toBe(true);
  });

  it('should close when toggled from open', () => {
    useSideNavStore.getState().toggle();
    useSideNavStore.getState().toggle();

    expect(useSideNavStore.getState().isOpen).toBe(false);
  });

  it('should alternate on repeated toggles', () => {
    const { toggle } = useSideNavStore.getState();

    toggle();
    expect(useSideNavStore.getState().isOpen).toBe(true);

    toggle();
    expect(useSideNavStore.getState().isOpen).toBe(false);

    toggle();
    expect(useSideNavStore.getState().isOpen).toBe(true);
  });
});

describe('SideNav store — close', () => {
  it('should close the drawer when open', () => {
    useSideNavStore.getState().toggle(); // open
    useSideNavStore.getState().close();

    expect(useSideNavStore.getState().isOpen).toBe(false);
  });

  it('should remain closed when already closed', () => {
    useSideNavStore.getState().close();
    expect(useSideNavStore.getState().isOpen).toBe(false);
  });

  it('should be idempotent — multiple close calls stay closed', () => {
    useSideNavStore.getState().toggle(); // open
    useSideNavStore.getState().close();
    useSideNavStore.getState().close();

    expect(useSideNavStore.getState().isOpen).toBe(false);
  });
});

describe('SideNav store — combined state transitions', () => {
  it('should allow setting groups and activeId independently', () => {
    const groups: NavGroup[] = [
      { title: 'Sections', items: [{ id: 'setup', label: 'Setup' }] },
    ];

    useSideNavStore.getState().setGroups(groups);
    useSideNavStore.getState().setActiveId('setup');

    const state = useSideNavStore.getState();
    expect(state.groups).toEqual(groups);
    expect(state.activeId).toBe('setup');
  });

  it('should not affect other state when toggling', () => {
    const groups: NavGroup[] = [{ items: [{ id: 'a', label: 'A' }] }];
    useSideNavStore.getState().setGroups(groups);
    useSideNavStore.getState().setActiveId('a');

    useSideNavStore.getState().toggle();

    const state = useSideNavStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.groups).toEqual(groups);
    expect(state.activeId).toBe('a');
  });

  it('should not affect other state when closing', () => {
    useSideNavStore.getState().setGroups([{ items: [{ id: 'b', label: 'B' }] }]);
    useSideNavStore.getState().setActiveId('b');
    useSideNavStore.getState().toggle(); // open

    useSideNavStore.getState().close();

    const state = useSideNavStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.groups).toHaveLength(1);
    expect(state.activeId).toBe('b');
  });
});
