import fc from 'fast-check';
import { useSideNavStore } from '../stores/sidenav';
import type { NavGroup } from '../stores/sidenav';

/** Feature: game-scalability-refactor, Property 7: SideNav population from config sections */
describe('SideNav population from config sections', () => {
    /**
     * Arbitrary that produces arrays of unique, non-empty section ID strings,
     * simulating the `sections` field of a GameConfig.
     */
    const uniqueSectionIdsArb = fc
        .uniqueArray(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1 })
        .filter(arr => arr.length > 0);

    beforeEach(() => {
        useSideNavStore.setState({
            groups: [],
            activeId: null,
            isOpen: false,
        });
    });

    /**
     * Validates: Requirements 2.2
     *
     * For any list of unique section IDs, calling setGroups with items derived
     * from those IDs (mirroring what GameScreen does on mount) must produce
     * exactly one nav item per section ID, in the same order.
     */
    it('store items match config sections in count and order after setGroups', () => {
        fc.assert(
            fc.property(uniqueSectionIdsArb, sectionIds => {
                // Simulate what GameScreen does: build a single NavGroup from sections
                const groups: NavGroup[] = [
                    {
                        items: sectionIds.map(id => ({
                            id,
                            label: `${id}.sidenav`,
                            sectionId: id,
                        })),
                    },
                ];

                useSideNavStore.getState().setGroups(groups);

                const storeGroups = useSideNavStore.getState().groups;

                // Exactly one group
                expect(storeGroups).toHaveLength(1);

                const items = storeGroups[0].items;

                // One item per section ID
                expect(items).toHaveLength(sectionIds.length);

                // IDs match in order
                const storedIds = items.map(item => item.id);
                expect(storedIds).toEqual(sectionIds);

                // Each item's sectionId also matches
                items.forEach((item, index) => {
                    expect(item.sectionId).toBe(sectionIds[index]);
                });
            }),
            { numRuns: 100 },
        );
    });
});
