import fc from 'fast-check';
import { games, gameIds, getGameById } from '../games/registry';

/** Feature: game-scalability-refactor, Property 3: Registry lookup correctness */
describe('Registry lookup correctness', () => {
    it('valid IDs always resolve to the matching config', () => {
        fc.assert(
            fc.property(fc.constantFrom(...gameIds), id => {
                const result = getGameById(id);
                expect(result).toBeDefined();
                expect(result!.id).toBe(id);

                // Must be the same object reference from the games array
                const expected = games.find(g => g.id === id);
                expect(result).toBe(expected);
            }),
            { numRuns: 100 },
        );
    });

    it('invalid IDs never resolve', () => {
        // Generate random strings that are NOT in the gameIds set
        const invalidIdArb = fc
            .string({ minLength: 0, maxLength: 50 })
            .filter(s => !gameIds.includes(s));

        fc.assert(
            fc.property(invalidIdArb, id => {
                const result = getGameById(id);
                expect(result).toBeUndefined();
            }),
            { numRuns: 100 },
        );
    });

    it('random strings resolve correctly based on membership in gameIds', () => {
        // Mix valid and invalid IDs: for any string, the result must be
        // the matching config if the string is a known ID, undefined otherwise
        const mixedIdArb = fc.oneof(
            fc.constantFrom(...gameIds),
            fc.string({ minLength: 0, maxLength: 50 }),
        );

        fc.assert(
            fc.property(mixedIdArb, id => {
                const result = getGameById(id);

                if (gameIds.includes(id)) {
                    expect(result).toBeDefined();
                    expect(result!.id).toBe(id);
                } else {
                    expect(result).toBeUndefined();
                }
            }),
            { numRuns: 100 },
        );
    });
});
