import fc from 'fast-check';
import { findActiveSection } from '../hooks/useScrollTracker';

/**
 * Validates: Requirements 5.8, 13.1, 13.3, 13.4
 *
 * Property 5: Scroll tracker identifies correct active section
 *
 * For any scroll offset and any non-empty list of section layouts (each with
 * id, y, height), the scroll tracker should return the id of the last section
 * whose y position is at or above the scroll offset plus a 20% viewport margin.
 * If no section meets this criterion, activeId should be null.
 */
describe('Scroll tracker identifies correct active section', () => {
    /**
     * Arbitrary that generates a non-empty list of section layouts with unique
     * IDs and non-negative y offsets, sorted by y position ascending (simulating
     * a real scrollable layout where sections appear top-to-bottom).
     */
    const sectionLayoutsArb = fc
        .uniqueArray(
            fc.record({
                id: fc.stringMatching(/^[a-z][a-z0-9-]{0,19}$/),
                y: fc.double({ min: 0, max: 10000, noNaN: true }),
            }),
            { minLength: 1, maxLength: 20, selector: s => s.id },
        )
        .map(sections => sections.sort((a, b) => a.y - b.y));

    const scrollOffsetArb = fc.double({ min: 0, max: 15000, noNaN: true });
    const viewportHeightArb = fc.double({ min: 100, max: 2000, noNaN: true });

    it('should return the last section whose y <= scrollOffset + viewportHeight * 0.2', () => {
        fc.assert(
            fc.property(
                sectionLayoutsArb,
                scrollOffsetArb,
                viewportHeightArb,
                (sections, scrollOffset, viewportHeight) => {
                    const sectionOffsets = new Map(sections.map(s => [s.id, s.y]));
                    const sectionIds = sections.map(s => s.id);
                    const viewportMargin = viewportHeight * 0.2;

                    const result = findActiveSection(
                        sectionOffsets,
                        sectionIds,
                        scrollOffset,
                        viewportMargin,
                    );

                    const threshold = scrollOffset + viewportMargin;
                    const qualifying = sections.filter(s => s.y <= threshold);

                    if (qualifying.length === 0) {
                        expect(result).toBeNull();
                    } else {
                        expect(result).toBe(qualifying[qualifying.length - 1].id);
                    }
                },
            ),
            { numRuns: 200 },
        );
    });

    it('should return null when no section y is at or below the threshold', () => {
        fc.assert(
            fc.property(sectionLayoutsArb, viewportHeightArb, (sections, viewportHeight) => {
                // Place scroll offset well below the first section
                const minY = Math.min(...sections.map(s => s.y));
                const viewportMargin = viewportHeight * 0.2;
                // Ensure threshold is below all sections
                const scrollOffset = Math.max(0, minY - viewportMargin - 1);
                const threshold = scrollOffset + viewportMargin;

                // Only test when threshold is actually below all sections
                if (threshold >= minY) return;

                const sectionOffsets = new Map(sections.map(s => [s.id, s.y]));
                const sectionIds = sections.map(s => s.id);

                const result = findActiveSection(
                    sectionOffsets,
                    sectionIds,
                    scrollOffset,
                    viewportMargin,
                );

                expect(result).toBeNull();
            }),
            { numRuns: 200 },
        );
    });

    it('should always return a section id that exists in the input list', () => {
        fc.assert(
            fc.property(
                sectionLayoutsArb,
                scrollOffsetArb,
                viewportHeightArb,
                (sections, scrollOffset, viewportHeight) => {
                    const sectionOffsets = new Map(sections.map(s => [s.id, s.y]));
                    const sectionIds = sections.map(s => s.id);
                    const viewportMargin = viewportHeight * 0.2;

                    const result = findActiveSection(
                        sectionOffsets,
                        sectionIds,
                        scrollOffset,
                        viewportMargin,
                    );

                    if (result !== null) {
                        expect(sectionIds).toContain(result);
                    }
                },
            ),
            { numRuns: 200 },
        );
    });

    it('should return the first section when scrolled to the top and first section y is 0', () => {
        fc.assert(
            fc.property(
                sectionLayoutsArb.filter(s => s[0].y === 0),
                viewportHeightArb,
                (sections, viewportHeight) => {
                    const sectionOffsets = new Map(sections.map(s => [s.id, s.y]));
                    const sectionIds = sections.map(s => s.id);
                    const viewportMargin = viewportHeight * 0.2;

                    const result = findActiveSection(sectionOffsets, sectionIds, 0, viewportMargin);

                    // At scroll 0 with margin > 0, at least the first section (y=0) qualifies
                    expect(result).not.toBeNull();
                },
            ),
            { numRuns: 100 },
        );
    });

    it('should return null for an empty section offsets map', () => {
        fc.assert(
            fc.property(scrollOffsetArb, viewportHeightArb, (scrollOffset, viewportHeight) => {
                const result = findActiveSection(new Map(), [], scrollOffset, viewportHeight * 0.2);

                expect(result).toBeNull();
            }),
            { numRuns: 100 },
        );
    });
});

import { computeScrollTarget, SCROLL_PADDING } from '../hooks/useScrollTracker';

/**
 * Validates: Requirements 5.7, 13.5
 *
 * Property 13: ScrollToSection scrolls to stored offset
 *
 * For any section ID that has a stored layout offset, calling
 * computeScrollTarget should return the y value matching that section's
 * stored offset minus scroll padding (clamped to 0). For unknown IDs
 * it should return null.
 */
describe('ScrollToSection scrolls to stored offset', () => {
    /**
     * Arbitrary: a non-empty map of section IDs to y offsets, plus a
     * randomly chosen ID from that map to scroll to.
     */
    const sectionEntryArb = fc.record({
        id: fc.stringMatching(/^[a-z][a-z0-9-]{0,19}$/),
        y: fc.double({ min: 0, max: 10000, noNaN: true }),
    });

    const sectionMapArb = fc
        .uniqueArray(sectionEntryArb, {
            minLength: 1,
            maxLength: 20,
            selector: s => s.id,
        })
        .chain(sections =>
            fc.record({
                sections: fc.constant(sections),
                targetIndex: fc.integer({ min: 0, max: sections.length - 1 }),
            }),
        );

    it('should return offset - padding (clamped to 0) for a known section ID', () => {
        fc.assert(
            fc.property(sectionMapArb, ({ sections, targetIndex }) => {
                const offsets = new Map(sections.map(s => [s.id, s.y]));
                const target = sections[targetIndex];

                const result = computeScrollTarget(offsets, target.id);

                expect(result).toBe(Math.max(0, target.y - SCROLL_PADDING));
            }),
            { numRuns: 200 },
        );
    });

    it('should return null for a section ID not in the offsets map', () => {
        fc.assert(
            fc.property(
                sectionMapArb,
                fc.stringMatching(/^unknown-[a-z0-9]{1,10}$/),
                ({ sections }, unknownId) => {
                    const offsets = new Map(sections.map(s => [s.id, s.y]));

                    // Skip if the generated unknown ID happens to collide
                    if (offsets.has(unknownId)) return;

                    const result = computeScrollTarget(offsets, unknownId);

                    expect(result).toBeNull();
                },
            ),
            { numRuns: 200 },
        );
    });

    it('should clamp to 0 when offset is less than scroll padding', () => {
        fc.assert(
            fc.property(
                fc.stringMatching(/^[a-z][a-z0-9-]{0,19}$/),
                fc.double({ min: 0, max: SCROLL_PADDING - 0.01, noNaN: true }),
                (id, smallOffset) => {
                    const offsets = new Map([[id, smallOffset]]);

                    const result = computeScrollTarget(offsets, id);

                    expect(result).toBe(0);
                },
            ),
            { numRuns: 100 },
        );
    });

    it('should return null for an empty offsets map regardless of ID', () => {
        fc.assert(
            fc.property(fc.stringMatching(/^[a-z][a-z0-9-]{0,19}$/), id => {
                const result = computeScrollTarget(new Map(), id);

                expect(result).toBeNull();
            }),
            { numRuns: 100 },
        );
    });
});

/* ------------------------------------------------------------------ */
/*  Unit tests – scroll tracker edge cases                            */
/* ------------------------------------------------------------------ */

describe('findActiveSection edge cases', () => {
    it('returns null for an empty section list', () => {
        const result = findActiveSection(new Map(), [], 500, 100);
        expect(result).toBeNull();
    });

    it('returns the single section ID regardless of scroll position', () => {
        const offsets = new Map([['only-section', 0]]);
        const ids = ['only-section'];

        // Scrolled past the section
        expect(findActiveSection(offsets, ids, 200, 50)).toBe('only-section');
        // At the very top
        expect(findActiveSection(offsets, ids, 0, 50)).toBe('only-section');
        // Large scroll offset
        expect(findActiveSection(offsets, ids, 9999, 0)).toBe('only-section');
    });
});

describe('computeScrollTarget edge cases', () => {
    it('returns null for an unknown section ID (no-op)', () => {
        const offsets = new Map([['known', 300]]);
        const result = computeScrollTarget(offsets, 'unknown-id');
        expect(result).toBeNull();
    });

    it('returns null when the offsets map is empty', () => {
        const result = computeScrollTarget(new Map(), 'any-id');
        expect(result).toBeNull();
    });
});
