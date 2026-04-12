import fc from 'fast-check';

/**
 * Pure search filtering function matching the logic used on the home screen.
 * Given a list of games with titles and a search query, returns games whose
 * title (case-insensitive) includes the trimmed query. Empty/whitespace-only
 * queries return all games.
 */
function filterGames(
    games: { id: string; title: string }[],
    query: string,
): { id: string; title: string }[] {
    const trimmed = query.trim();
    if (!trimmed) return games;
    return games.filter(g => g.title.toLowerCase().includes(trimmed.toLowerCase()));
}

/** Feature: game-scalability-refactor, Property 6: Search filtering correctness */
describe('Search filtering correctness', () => {
    /**
     * Arbitrary that generates a game entry with a non-empty id and a title
     * composed of printable characters.
     */
    const gameEntryArb = fc.record({
        id: fc.stringMatching(/^[a-z][a-z0-9-]{0,19}$/),
        title: fc.string({ minLength: 1, maxLength: 40 }),
    });

    const gamesArb = fc.array(gameEntryArb, { minLength: 0, maxLength: 15 });

    const queryArb = fc.string({ minLength: 0, maxLength: 30 });

    it('empty or whitespace-only query returns all games', () => {
        const whitespaceQueryArb = fc.stringOf(fc.constant(' '), {
            minLength: 0,
            maxLength: 10,
        });

        fc.assert(
            fc.property(gamesArb, whitespaceQueryArb, (games, query) => {
                const result = filterGames(games, query);
                expect(result).toEqual(games);
            }),
            { numRuns: 100 },
        );
    });

    it('filtered results contain exactly the games whose title includes the trimmed query (case-insensitive)', () => {
        fc.assert(
            fc.property(gamesArb, queryArb, (games, query) => {
                const result = filterGames(games, query);
                const trimmed = query.trim();

                if (!trimmed) {
                    expect(result).toEqual(games);
                    return;
                }

                const expected = games.filter(g =>
                    g.title.toLowerCase().includes(trimmed.toLowerCase()),
                );
                expect(result).toEqual(expected);
            }),
            { numRuns: 100 },
        );
    });

    it('every returned game title contains the search query (case-insensitive)', () => {
        fc.assert(
            fc.property(gamesArb, queryArb, (games, query) => {
                const result = filterGames(games, query);
                const trimmed = query.trim();

                if (!trimmed) return;

                for (const game of result) {
                    expect(game.title.toLowerCase().includes(trimmed.toLowerCase())).toBe(true);
                }
            }),
            { numRuns: 100 },
        );
    });

    it('no excluded game title contains the search query (case-insensitive)', () => {
        fc.assert(
            fc.property(gamesArb, queryArb, (games, query) => {
                const result = filterGames(games, query);
                const trimmed = query.trim();

                if (!trimmed) return;

                const resultIds = new Set(result.map(g => g.id));
                const excluded = games.filter(g => !resultIds.has(g.id));

                for (const game of excluded) {
                    expect(game.title.toLowerCase().includes(trimmed.toLowerCase())).toBe(false);
                }
            }),
            { numRuns: 100 },
        );
    });

    it('filtered results preserve the original order', () => {
        fc.assert(
            fc.property(gamesArb, queryArb, (games, query) => {
                const result = filterGames(games, query);

                // Verify order is preserved by checking indices are monotonically increasing
                let lastIndex = -1;
                for (const game of result) {
                    const idx = games.indexOf(game);
                    expect(idx).toBeGreaterThan(lastIndex);
                    lastIndex = idx;
                }
            }),
            { numRuns: 100 },
        );
    });

    it('search is case-insensitive: same results regardless of query casing', () => {
        fc.assert(
            fc.property(gamesArb, queryArb, (games, query) => {
                const resultLower = filterGames(games, query.toLowerCase());
                const resultUpper = filterGames(games, query.toUpperCase());

                expect(resultLower).toEqual(resultUpper);
            }),
            { numRuns: 100 },
        );
    });

    it('leading and trailing whitespace in query does not affect results', () => {
        fc.assert(
            fc.property(gamesArb, queryArb, (games, query) => {
                const resultPlain = filterGames(games, query);
                const resultPadded = filterGames(games, `   ${query}   `);

                expect(resultPadded).toEqual(resultPlain);
            }),
            { numRuns: 100 },
        );
    });
});
