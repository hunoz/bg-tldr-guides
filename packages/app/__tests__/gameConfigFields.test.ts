import fc from 'fast-check';
import { games } from '../games/registry';

/** Feature: game-scalability-refactor, Property 1: GameConfig required fields */
describe('GameConfig required fields', () => {
    /**
     * Arbitrary that generates a valid index into the games registry array.
     * This lets fast-check pick any registered game config for verification.
     */
    const gameIndexArb = fc.nat({ max: games.length - 1 });

    it('every config must have a non-empty id string', () => {
        fc.assert(
            fc.property(gameIndexArb, index => {
                const config = games[index];
                expect(typeof config.id).toBe('string');
                expect(config.id.length).toBeGreaterThan(0);
            }),
            { numRuns: 100 },
        );
    });

    it('every config must have a non-empty sections array', () => {
        fc.assert(
            fc.property(gameIndexArb, index => {
                const config = games[index];
                expect(Array.isArray(config.sections)).toBe(true);
                expect(config.sections.length).toBeGreaterThan(0);
            }),
            { numRuns: 100 },
        );
    });

    it('every config must have a non-empty headerColor string', () => {
        fc.assert(
            fc.property(gameIndexArb, index => {
                const config = games[index];
                expect(typeof config.headerColor).toBe('string');
                expect(config.headerColor.length).toBeGreaterThan(0);
            }),
            { numRuns: 100 },
        );
    });

    it('every config must have a non-empty bggUrl string', () => {
        fc.assert(
            fc.property(gameIndexArb, index => {
                const config = games[index];
                expect(typeof config.bggUrl).toBe('string');
                expect(config.bggUrl.length).toBeGreaterThan(0);
            }),
            { numRuns: 100 },
        );
    });

    it('every config with a manualUrl must have a non-empty string', () => {
        fc.assert(
            fc.property(gameIndexArb, index => {
                const config = games[index];
                if (config.manualUrl !== undefined) {
                    expect(typeof config.manualUrl).toBe('string');
                    expect(config.manualUrl.length).toBeGreaterThan(0);
                }
            }),
            { numRuns: 100 },
        );
    });

    it('sectionComponents must have a key for every entry in sections', () => {
        fc.assert(
            fc.property(gameIndexArb, index => {
                const config = games[index];
                const componentKeys = Object.keys(config.sectionComponents);

                for (const section of config.sections) {
                    expect(componentKeys).toContain(section);
                    expect(typeof config.sectionComponents[section]).toBe('function');
                }
            }),
            { numRuns: 100 },
        );
    });
});
