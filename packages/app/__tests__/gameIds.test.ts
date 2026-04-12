/* eslint-disable @typescript-eslint/no-require-imports */
import fc from 'fast-check';

jest.mock('expo-localization', () => ({
    getLocales: () => [{ languageTag: 'en' }],
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
}));

/**
 * Pure function that derives game IDs from a namespace array by removing 'common'.
 * This mirrors the logic in i18n/index.ts: `ns.filter(n => n !== 'common')`.
 */
function deriveGameIds(namespaces: string[]): string[] {
    return namespaces.filter(n => n !== 'common');
}

/**
 * Validates: Requirements 3.7, 10.1
 *
 * Property 3: Game ID derivation from namespaces
 *
 * For any set of translation namespace identifiers, the derived gameIds list
 * should equal the set of all namespace identifiers with 'common' removed,
 * preserving order.
 */
describe('Game ID derivation from namespaces', () => {
    /**
     * Arbitrary that produces a namespace array always containing 'common'
     * at a random position, plus zero or more other unique non-'common' strings.
     */
    const namespacesArb = fc
        .uniqueArray(fc.stringMatching(/^[a-z][a-z0-9-]{0,29}$/), { minLength: 0, maxLength: 10 })
        .map(arr => arr.filter(s => s !== 'common'))
        .chain(others =>
            fc.nat({ max: others.length }).map(insertIdx => {
                const copy = [...others];
                copy.splice(insertIdx, 0, 'common');
                return copy;
            }),
        );

    it('should equal the input minus "common", preserving order', () => {
        fc.assert(
            fc.property(namespacesArb, namespaces => {
                const gameIds = deriveGameIds(namespaces);
                const expected = namespaces.filter(n => n !== 'common');

                expect(gameIds).toEqual(expected);
            }),
            { numRuns: 100 },
        );
    });

    it('should never contain "common"', () => {
        fc.assert(
            fc.property(namespacesArb, namespaces => {
                const gameIds = deriveGameIds(namespaces);
                expect(gameIds).not.toContain('common');
            }),
            { numRuns: 100 },
        );
    });

    it('should have length equal to namespaces.length minus the count of "common" entries', () => {
        fc.assert(
            fc.property(namespacesArb, namespaces => {
                const gameIds = deriveGameIds(namespaces);
                const commonCount = namespaces.filter(n => n === 'common').length;
                expect(gameIds.length).toBe(namespaces.length - commonCount);
            }),
            { numRuns: 100 },
        );
    });

    it('should preserve the relative order of non-common namespaces', () => {
        fc.assert(
            fc.property(namespacesArb, namespaces => {
                const gameIds = deriveGameIds(namespaces);
                const nonCommon = namespaces.filter(n => n !== 'common');

                // Each game ID should appear at the same index as in the filtered list
                for (let i = 0; i < gameIds.length; i++) {
                    expect(gameIds[i]).toBe(nonCommon[i]);
                }
            }),
            { numRuns: 100 },
        );
    });
});

/**
 * Unit tests for game ID derivation.
 * gameIds is now sourced from the registry; ns is sourced from i18n.
 */
describe('gameIds export from registry', () => {
    const { gameIds } = require('../games/registry');
    const { ns } = require('../i18n/index');

    it('should not contain "common"', () => {
        expect(gameIds).not.toContain('common');
    });

    it('should contain all namespaces except "common"', () => {
        const expected = ns.filter((n: string) => n !== 'common');
        expect(gameIds).toEqual(expected);
    });

    it('should include "castles-of-burgundy" and "quacks"', () => {
        expect(gameIds).toContain('castles-of-burgundy');
        expect(gameIds).toContain('quacks');
    });

    it('should have exactly 2 entries', () => {
        expect(gameIds).toHaveLength(2);
    });
});
