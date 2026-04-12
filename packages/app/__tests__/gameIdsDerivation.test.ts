import fc from 'fast-check';
import { games, gameIds } from '../games/registry';

/** Feature: game-scalability-refactor, Property 2: gameIds derivation preserves order and content */
describe('gameIds derivation preserves order and content', () => {
    it('actual gameIds export matches games.map(g => g.id)', () => {
        const expected = games.map(g => g.id);
        expect(gameIds).toEqual(expected);
    });

    /**
     * Arbitrary that generates an array of objects with unique string `id` fields,
     * simulating a list of game configs.
     */
    const gameConfigArrayArb = fc.uniqueArray(
        fc.record({
            id: fc.stringMatching(/^[a-z][a-z0-9-]{0,19}$/),
        }),
        { selector: item => item.id, minLength: 0, maxLength: 20 },
    );

    it('mapping ids from any config array preserves content and order', () => {
        fc.assert(
            fc.property(gameConfigArrayArb, configs => {
                const derivedIds = configs.map(c => c.id);

                // Same length
                expect(derivedIds).toHaveLength(configs.length);

                // Same content in same order
                for (let i = 0; i < configs.length; i++) {
                    expect(derivedIds[i]).toBe(configs[i].id);
                }
            }),
            { numRuns: 100 },
        );
    });

    it('derived ids array contains no extra or missing entries', () => {
        fc.assert(
            fc.property(gameConfigArrayArb, configs => {
                const derivedIds = configs.map(c => c.id);
                const idSet = new Set(configs.map(c => c.id));

                // Every derived id came from the configs
                for (const id of derivedIds) {
                    expect(idSet.has(id)).toBe(true);
                }

                // Every config id appears in the derived array
                for (const config of configs) {
                    expect(derivedIds).toContain(config.id);
                }
            }),
            { numRuns: 100 },
        );
    });
});
