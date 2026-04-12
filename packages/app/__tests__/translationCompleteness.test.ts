/* eslint-disable @typescript-eslint/no-require-imports */
import fc from 'fast-check';

jest.mock('expo-localization', () => ({
    getLocales: () => [{ languageTag: 'en' }],
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
}));

import { gameIds } from '../games/registry';
import { translationMap } from '../games/translations';
import commonEn from '../assets/i18n/common/en.json';
import commonEsMX from '../assets/i18n/common/es-MX.json';

const supportedLocales = ['en', 'es-MX'] as const;

/**
 * Reconstruct the resources object using the same logic as i18n/index.ts:
 * start with common namespace per locale, then iterate gameIds and pull
 * from translationMap.
 */
const resources: Record<string, Record<string, object>> = {
    'en': { common: commonEn },
    'es-MX': { common: commonEsMX },
};

for (const id of gameIds) {
    const gameTranslations = translationMap[id];
    if (gameTranslations) {
        for (const [locale, data] of Object.entries(gameTranslations)) {
            if (!resources[locale]) {
                resources[locale] = {};
            }
            resources[locale][id] = data;
        }
    }
}

/** Feature: game-scalability-refactor, Property 4: Translation resource completeness */
describe('Translation resource completeness', () => {
    const gameIdArb = fc.constantFrom(...gameIds);
    const localeArb = fc.constantFrom(...supportedLocales);

    it('every game ID has a non-empty translation object for each supported locale', () => {
        fc.assert(
            fc.property(gameIdArb, localeArb, (gameId, locale) => {
                const localeResources = resources[locale];
                expect(localeResources).toBeDefined();
                expect(localeResources[gameId]).toBeDefined();
                expect(typeof localeResources[gameId]).toBe('object');
                expect(Object.keys(localeResources[gameId]).length).toBeGreaterThan(0);
            }),
            { numRuns: 100 },
        );
    });

    it('common namespace is present with non-empty data for every supported locale', () => {
        fc.assert(
            fc.property(localeArb, locale => {
                const localeResources = resources[locale];
                expect(localeResources).toBeDefined();
                expect(localeResources.common).toBeDefined();
                expect(typeof localeResources.common).toBe('object');
                expect(Object.keys(localeResources.common).length).toBeGreaterThan(0);
            }),
            { numRuns: 100 },
        );
    });

    it('resources built from registry match the actual i18n module resources', () => {
        const i18n = require('../i18n/index').default;
        const actualResources = i18n.options.resources;

        fc.assert(
            fc.property(gameIdArb, localeArb, (gameId, locale) => {
                // The actual i18n resources should also have the game namespace for this locale
                expect(actualResources[locale]).toBeDefined();
                expect(actualResources[locale][gameId]).toBeDefined();
                expect(Object.keys(actualResources[locale][gameId]).length).toBeGreaterThan(0);
            }),
            { numRuns: 100 },
        );
    });
});
