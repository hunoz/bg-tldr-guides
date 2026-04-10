import fc from 'fast-check';
import { themeMap, homeTheme, cobTheme, quacksTheme, Theme } from '../theme/themes';

/**
 * Resolves a route segment to its theme using the themeMap,
 * falling back to homeTheme for unknown segments.
 * This mirrors the logic in ThemeContext.tsx: `themeMap[segment] ?? homeTheme`
 */
function resolveTheme(segment: string): Theme {
  return themeMap[segment] ?? homeTheme;
}

/** Known route segments and their expected themes. */
const knownSegments: Array<[string, Theme]> = [
  ['', homeTheme],
  ['castles-of-burgundy', cobTheme],
  ['quacks', quacksTheme],
];

const knownSegmentStrings = knownSegments.map(([seg]) => seg);

/**
 * Validates: Requirements 4.4
 *
 * Property 7: Route segment resolves to correct theme
 *
 * For any route segment string in the theme map, the ThemeProvider should
 * supply the theme whose colors, fonts, and spacing match the defined theme
 * for that route. For any route segment not in the theme map, the
 * ThemeProvider should supply the home theme as default.
 */
describe('Route segment resolves to correct theme', () => {
  /**
   * Arbitrary that produces a random known route segment
   * paired with its expected theme.
   */
  const knownSegmentArb = fc.constantFrom(...knownSegments);

  /**
   * Arbitrary that produces a random string guaranteed NOT to be
   * a known route segment, simulating an unknown/undefined route.
   */
  const unknownSegmentArb = fc
    .stringMatching(/^[a-z][a-z0-9-]{0,39}$/)
    .filter((s) => !knownSegmentStrings.includes(s));

  it('should resolve known route segments to their defined theme', () => {
    fc.assert(
      fc.property(knownSegmentArb, ([segment, expectedTheme]) => {
        const resolved = resolveTheme(segment);
        expect(resolved).toBe(expectedTheme);
      }),
      { numRuns: 100 },
    );
  });

  it('should resolve unknown route segments to homeTheme', () => {
    fc.assert(
      fc.property(unknownSegmentArb, (segment) => {
        const resolved = resolveTheme(segment);
        expect(resolved).toBe(homeTheme);
      }),
      { numRuns: 100 },
    );
  });

  it('should match all color, font, and spacing properties for known segments', () => {
    fc.assert(
      fc.property(knownSegmentArb, ([segment, expectedTheme]) => {
        const resolved = resolveTheme(segment);
        expect(resolved.colors).toEqual(expectedTheme.colors);
        expect(resolved.fonts).toEqual(expectedTheme.fonts);
        expect(resolved.spacing).toEqual(expectedTheme.spacing);
      }),
      { numRuns: 100 },
    );
  });

  it('should return homeTheme colors, fonts, and spacing for unknown segments', () => {
    fc.assert(
      fc.property(unknownSegmentArb, (segment) => {
        const resolved = resolveTheme(segment);
        expect(resolved.colors).toEqual(homeTheme.colors);
        expect(resolved.fonts).toEqual(homeTheme.fonts);
        expect(resolved.spacing).toEqual(homeTheme.spacing);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Unit tests for theme resolution.
 *
 * Verifies that each known route segment maps to the correct theme object
 * and that unknown segments fall back to the home theme.
 */
describe('Theme resolution unit tests', () => {
  describe('themeMap contains all expected route segments', () => {
    it('should have exactly three entries', () => {
      expect(Object.keys(themeMap)).toHaveLength(3);
    });

    it('should contain the empty string, castles-of-burgundy, and quacks keys', () => {
      expect(themeMap).toHaveProperty('');
      expect(themeMap).toHaveProperty('castles-of-burgundy');
      expect(themeMap).toHaveProperty('quacks');
    });
  });

  describe('homeTheme properties', () => {
    it('should use dark background #1a1a2e', () => {
      expect(homeTheme.colors.background).toBe('#1a1a2e');
    });

    it('should use system sans-serif fonts', () => {
      expect(homeTheme.fonts.body).toBe('System');
      expect(homeTheme.fonts.heading).toBe('System');
    });

    it('should use accent color #6c63ff', () => {
      expect(homeTheme.colors.accent).toBe('#6c63ff');
    });

    it('should map to the empty route segment', () => {
      expect(themeMap['']).toBe(homeTheme);
    });
  });

  describe('cobTheme properties', () => {
    it('should use warm background #1a0f0a', () => {
      expect(cobTheme.colors.background).toBe('#1a0f0a');
    });

    it('should use Crimson Text body font and Cinzel heading font', () => {
      expect(cobTheme.fonts.body).toBe('Crimson Text');
      expect(cobTheme.fonts.heading).toBe('Cinzel');
    });

    it('should use gold accent color #c9a84c', () => {
      expect(cobTheme.colors.accent).toBe('#c9a84c');
    });

    it('should use parchment card background #faf3e6', () => {
      expect(cobTheme.colors.card).toBe('#faf3e6');
      expect(cobTheme.colors.parchment).toBe('#faf3e6');
    });

    it('should map to the castles-of-burgundy route segment', () => {
      expect(themeMap['castles-of-burgundy']).toBe(cobTheme);
    });
  });

  describe('quacksTheme properties', () => {
    it('should use dark purple background #1a0e2e', () => {
      expect(quacksTheme.colors.background).toBe('#1a0e2e');
    });

    it('should use dark purple card background #2a1745', () => {
      expect(quacksTheme.colors.card).toBe('#2a1745');
    });

    it('should use gold accent color #d4a843', () => {
      expect(quacksTheme.colors.accent).toBe('#d4a843');
    });

    it('should use parchment variant #f5e6c8', () => {
      expect(quacksTheme.colors.parchment).toBe('#f5e6c8');
    });

    it('should use Georgia heading font', () => {
      expect(quacksTheme.fonts.heading).toBe('Georgia');
    });

    it('should map to the quacks route segment', () => {
      expect(themeMap['quacks']).toBe(quacksTheme);
    });
  });

  describe('unknown route segments default to homeTheme', () => {
    it('should return homeTheme for an unknown segment', () => {
      expect(resolveTheme('nonexistent-game')).toBe(homeTheme);
    });

    it('should return homeTheme for a random string', () => {
      expect(resolveTheme('some-random-route')).toBe(homeTheme);
    });

    it('should return homeTheme for a numeric string', () => {
      expect(resolveTheme('12345')).toBe(homeTheme);
    });
  });

  describe('theme switching between routes', () => {
    it('should resolve different themes for different known segments', () => {
      const home = resolveTheme('');
      const cob = resolveTheme('castles-of-burgundy');
      const quacks = resolveTheme('quacks');

      expect(home).not.toBe(cob);
      expect(home).not.toBe(quacks);
      expect(cob).not.toBe(quacks);
    });

    it('should return the exact same theme object reference for repeated lookups', () => {
      expect(resolveTheme('castles-of-burgundy')).toBe(resolveTheme('castles-of-burgundy'));
      expect(resolveTheme('quacks')).toBe(resolveTheme('quacks'));
      expect(resolveTheme('')).toBe(resolveTheme(''));
    });
  });
});
