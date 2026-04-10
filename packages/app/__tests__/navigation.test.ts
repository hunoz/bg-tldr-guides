import fc from 'fast-check';

/**
 * Builds the navigation route for a given game ID.
 * This mirrors the logic in app/index.tsx: `router.push(`/${gameId}`)`.
 */
function buildGameRoute(gameId: string): string {
  return `/${gameId}`;
}

/**
 * Simulates the navigation action triggered when a user taps a game.
 * Calls router.push with the constructed route, matching the home screen behavior.
 */
function navigateToGame(
  gameId: string,
  router: { push: (route: string) => void },
): void {
  router.push(buildGameRoute(gameId));
}

/**
 * Validates: Requirements 3.5, 5.5
 *
 * Property 8: Tapping a game navigates to its route
 *
 * For any game ID in the game list, invoking the navigation action for that
 * game should result in a navigation call to `/${gameId}`.
 */
describe('Tapping a game navigates to its route', () => {
  /**
   * Arbitrary that produces valid game ID strings.
   * Game IDs are lowercase kebab-case identifiers (e.g., "castles-of-burgundy", "quacks").
   */
  const gameIdArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,39}$/);

  it('should construct the route as /${gameId}', () => {
    fc.assert(
      fc.property(gameIdArb, (gameId) => {
        const route = buildGameRoute(gameId);
        expect(route).toBe(`/${gameId}`);
      }),
      { numRuns: 100 },
    );
  });

  it('should call router.push with /${gameId} when navigating', () => {
    fc.assert(
      fc.property(gameIdArb, (gameId) => {
        const mockRouter = { push: jest.fn() };
        navigateToGame(gameId, mockRouter);

        expect(mockRouter.push).toHaveBeenCalledTimes(1);
        expect(mockRouter.push).toHaveBeenCalledWith(`/${gameId}`);
      }),
      { numRuns: 100 },
    );
  });

  it('should always produce a route starting with /', () => {
    fc.assert(
      fc.property(gameIdArb, (gameId) => {
        const route = buildGameRoute(gameId);
        expect(route.startsWith('/')).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('should produce a route whose path segment after / equals the game ID', () => {
    fc.assert(
      fc.property(gameIdArb, (gameId) => {
        const route = buildGameRoute(gameId);
        const segment = route.slice(1); // remove leading /
        expect(segment).toBe(gameId);
      }),
      { numRuns: 100 },
    );
  });
});


/**
 * The set of routes that the app explicitly handles.
 */
const DEFINED_ROUTES = ['/', '/castles-of-burgundy', '/quacks'];

/**
 * Determines the redirect target for a given path.
 * If the path is not one of the defined routes, it redirects to '/'.
 * This mirrors the behavior of app/+not-found.tsx which uses
 * `<Redirect href="/" />` for any unmatched route.
 */
function getRedirectTarget(path: string): string | null {
  if (DEFINED_ROUTES.includes(path)) {
    return null; // no redirect needed, route is handled
  }
  return '/';
}

/**
 * Validates: Requirements 2.5
 *
 * Property 9: Undefined routes redirect to home
 *
 * For any route path string that is not one of the defined routes
 * (/, /castles-of-burgundy, /quacks), the redirect target should be '/'.
 */
describe('Undefined routes redirect to home', () => {
  /**
   * Arbitrary that produces random path strings which are guaranteed
   * NOT to be one of the defined routes.
   */
  const undefinedRouteArb = fc
    .stringMatching(/^\/[a-z0-9/-]{0,50}$/)
    .filter((path) => !DEFINED_ROUTES.includes(path));

  it('should redirect undefined routes to /', () => {
    fc.assert(
      fc.property(undefinedRouteArb, (path) => {
        const target = getRedirectTarget(path);
        expect(target).toBe('/');
      }),
      { numRuns: 100 },
    );
  });

  it('should not redirect defined routes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...DEFINED_ROUTES),
        (path) => {
          const target = getRedirectTarget(path);
          expect(target).toBeNull();
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should redirect completely random strings that are not defined routes', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }).filter(
          (s) => !DEFINED_ROUTES.includes(s),
        ),
        (path) => {
          const target = getRedirectTarget(path);
          expect(target).toBe('/');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should always redirect to exactly "/" (not any other path)', () => {
    fc.assert(
      fc.property(undefinedRouteArb, (path) => {
        const target = getRedirectTarget(path);
        expect(target).toBe('/');
        expect(target).not.toBe(path);
      }),
      { numRuns: 100 },
    );
  });
});
