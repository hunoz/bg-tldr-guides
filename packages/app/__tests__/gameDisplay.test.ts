import fc from 'fast-check';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * Validates: Requirements 10.3
 *
 * Property 4: Game display label and icon from translation keys
 *
 * For any game ID in the gameIds list, the displayed label should equal the
 * value of t('app.title', { ns: gameId }) and the displayed icon should equal
 * the value of t('app.icon', { ns: gameId }).
 */
describe('Game display label and icon from translation keys', () => {
  /**
   * Arbitrary that generates a valid game ID string (lowercase with hyphens,
   * never 'common').
   */
  const gameIdArb = fc
    .stringMatching(/^[a-z][a-z0-9-]{1,25}$/)
    .filter((id) => id !== 'common');

  /** Arbitrary for a non-empty display title string. */
  const titleArb = fc.string({ minLength: 1, maxLength: 60 }).filter((s) => s.trim().length > 0);

  /** Arbitrary for an icon string (emoji or short text). */
  const iconArb = fc.string({ minLength: 1, maxLength: 10 }).filter((s) => s.trim().length > 0);

  /**
   * Arbitrary that produces a tuple of [gameId, title, icon] representing
   * a game with mock translation resources.
   */
  const gameWithTranslationsArb = fc.tuple(gameIdArb, titleArb, iconArb);

  it('should resolve app.title and app.icon to the correct translation values for any game ID', () => {
    fc.assert(
      fc.property(gameWithTranslationsArb, ([gameId, title, icon]) => {
        // Create a fresh i18n instance with mock resources for this game
        const testInstance = i18n.createInstance();
        testInstance.use(initReactI18next).init({
          resources: {
            en: {
              [gameId]: {
                app: { title, icon },
              },
            },
          },
          ns: [gameId],
          defaultNS: gameId,
          lng: 'en',
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
          initImmediate: false,
        });

        // Derive label and icon the same way the app does
        const resolvedLabel = testInstance.t('app.title', { ns: gameId });
        const resolvedIcon = testInstance.t('app.icon', { ns: gameId });

        expect(resolvedLabel).toBe(title);
        expect(resolvedIcon).toBe(icon);
      }),
      { numRuns: 100 },
    );
  });

  it('should resolve label and icon independently for multiple games', () => {
    /**
     * Generate an array of 2–5 unique games, each with distinct translations.
     */
    const multipleGamesArb = fc
      .uniqueArray(gameWithTranslationsArb, {
        minLength: 2,
        maxLength: 5,
        comparator: (a, b) => a[0] === b[0],
      });

    fc.assert(
      fc.property(multipleGamesArb, (games) => {
        // Build resources for all games
        const namespaces: Record<string, { app: { title: string; icon: string } }> = {};
        const nsList: string[] = [];
        for (const [gameId, title, icon] of games) {
          namespaces[gameId] = { app: { title, icon } };
          nsList.push(gameId);
        }

        const testInstance = i18n.createInstance();
        testInstance.use(initReactI18next).init({
          resources: { en: namespaces },
          ns: nsList,
          defaultNS: nsList[0],
          lng: 'en',
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
          initImmediate: false,
        });

        // Verify each game resolves to its own title and icon
        for (const [gameId, title, icon] of games) {
          const resolvedLabel = testInstance.t('app.title', { ns: gameId });
          const resolvedIcon = testInstance.t('app.icon', { ns: gameId });

          expect(resolvedLabel).toBe(title);
          expect(resolvedIcon).toBe(icon);
        }
      }),
      { numRuns: 100 },
    );
  });
});
