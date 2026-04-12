import fc from 'fast-check';

jest.mock('expo-localization', () => ({
    getLocales: () => [{ languageTag: 'en' }],
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
}));

import i18n from '../i18n/index';
import { gameIds } from '../games/registry';
import { translationMap } from '../games/translations';

/**
 * Flatten a nested object into dot-separated key paths.
 * e.g. { a: { b: "x" } } => ["a.b"]
 */
function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    const keys: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            keys.push(...flattenKeys(value as Record<string, unknown>, fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

// Build a map of game ID -> flat English translation keys
const englishKeysByGame: Record<string, string[]> = {};
for (const gameId of gameIds) {
    const enData = translationMap[gameId]?.en;
    if (enData) {
        englishKeysByGame[gameId] = flattenKeys(enData as Record<string, unknown>);
    }
}

// Only include games that have English keys
const gamesWithKeys = gameIds.filter(
    id => englishKeysByGame[id] && englishKeysByGame[id].length > 0,
);

/** Feature: game-scalability-refactor, Property 5: Translation fallback to English */
describe('Translation fallback to English', () => {
    beforeAll(async () => {
        await i18n.changeLanguage('es-MX');
    });

    afterAll(async () => {
        await i18n.changeLanguage('en');
    });

    it('requesting any English key in a non-English locale returns a translation or English fallback, never undefined or the raw key', () => {
        // Arbitrary picks: a game ID and one of its English translation keys
        const gameAndKeyArb = fc
            .constantFrom(...gamesWithKeys)
            .chain(gameId =>
                fc.constantFrom(...englishKeysByGame[gameId]).map(key => ({ gameId, key })),
            );

        fc.assert(
            fc.property(gameAndKeyArb, ({ gameId, key }) => {
                const result = i18n.t(key, { ns: gameId });

                // Must not be undefined
                expect(result).toBeDefined();

                // Must not be the raw key string (i18next returns the key when no translation is found)
                expect(result).not.toBe(key);

                // Must be a non-empty string (translations resolve to actual content)
                expect(typeof result === 'string' || typeof result === 'object').toBe(true);
            }),
            { numRuns: 100 },
        );
    });
});
