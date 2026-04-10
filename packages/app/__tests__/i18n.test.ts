import fc from 'fast-check';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Static imports of translation files (same as i18n/index.ts)
import commonEn from '../assets/i18n/common/en.json';
import commonEsMX from '../assets/i18n/common/es-MX.json';
import cobEn from '../assets/i18n/castles-of-burgundy/en.json';
import cobEsMX from '../assets/i18n/castles-of-burgundy/es-MX.json';
import quacksEn from '../assets/i18n/quacks/en.json';
import quacksEsMX from '../assets/i18n/quacks/es-MX.json';

const resources = {
  en: { common: commonEn, 'castles-of-burgundy': cobEn, quacks: quacksEn },
  'es-MX': { common: commonEsMX, 'castles-of-burgundy': cobEsMX, quacks: quacksEsMX },
};

const ns = ['common', 'castles-of-burgundy', 'quacks'];
const supportedLocales = ['en', 'es-MX'];

/**
 * Validates: Requirements 6.4
 *
 * Property 6: Unsupported locale falls back to English
 *
 * For any locale string that is not in the set of supported locales (en, es-MX),
 * the i18n service should resolve translation keys using the English (en) translations.
 */
describe('Unsupported locale falls back to English', () => {
  /**
   * Arbitrary that generates random locale-like strings that are guaranteed
   * NOT to be 'en' or 'es-MX'. Produces strings like 'fr', 'de-DE', 'zh-CN', etc.
   */
  const unsupportedLocaleArb = fc
    .stringMatching(/^[a-z]{2}(-[A-Z]{2})?$/)
    .filter((locale) => !supportedLocales.includes(locale));

  beforeEach(async () => {
    // Reset i18next instance between tests so each init is clean
    if (i18n.isInitialized) {
      // Remove the react-i18next plugin to avoid double-init warnings,
      // then re-create a fresh instance state
      await i18n.changeLanguage('en');
    }
  });

  it('should resolve common namespace keys to English values for any unsupported locale', () => {
    fc.assert(
      fc.property(unsupportedLocaleArb, (locale) => {
        // Re-init i18n with the unsupported locale
        i18n.use(initReactI18next).init({
          resources,
          ns,
          defaultNS: ns[0],
          lng: locale,
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
          // Prevent console warnings about re-initialization
          initImmediate: false,
        });

        // The resolved language should fall back to 'en' since the locale is unsupported
        const resolvedLang = i18n.resolvedLanguage;
        expect(resolvedLang).toBe('en');

        // Verify a known key resolves to the English translation
        const title = i18n.t('title', { ns: 'common' });
        expect(title).toBe(commonEn.title);
      }),
      { numRuns: 100 },
    );
  });

  it('should never resolve to es-MX translations for any unsupported locale', () => {
    fc.assert(
      fc.property(unsupportedLocaleArb, (locale) => {
        i18n.use(initReactI18next).init({
          resources,
          ns,
          defaultNS: ns[0],
          lng: locale,
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
          initImmediate: false,
        });

        // The title in es-MX is different from en — verify we get the English one
        const title = i18n.t('title', { ns: 'common' });
        expect(title).not.toBe(commonEsMX.title);
        expect(title).toBe(commonEn.title);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Validates: Requirements 6.6
 *
 * Property 11: Locale change updates translation output
 *
 * For any supported locale and any translation key that exists in both en and es-MX,
 * changing the i18n language to that locale should cause t(key) to return the value
 * from that locale's translation file.
 */
describe('Locale change updates translation output', () => {
  /**
   * Recursively collect all dot-separated key paths that resolve to a string value
   * in a nested JSON object.
   */
  function collectStringKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    const keys: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'string') {
        keys.push(path);
      } else if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        keys.push(...collectStringKeys(v as Record<string, unknown>, path));
      }
    }
    return keys;
  }

  /**
   * Resolve a dot-separated key path against a nested object, returning the leaf value.
   */
  function resolve(obj: Record<string, unknown>, keyPath: string): unknown {
    return keyPath.split('.').reduce<unknown>((acc, part) => {
      if (acc !== null && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  }

  // Build a list of { locale, namespace, key } tuples where the key exists as a
  // string in both en and es-MX for the given namespace.
  type TranslationEntry = { locale: string; namespace: string; key: string };

  const namespacePairs: Array<{
    namespace: string;
    en: Record<string, unknown>;
    esMX: Record<string, unknown>;
  }> = [
    { namespace: 'common', en: commonEn, esMX: commonEsMX },
    { namespace: 'castles-of-burgundy', en: cobEn, esMX: cobEsMX },
    { namespace: 'quacks', en: quacksEn, esMX: quacksEsMX },
  ];

  const entries: TranslationEntry[] = [];
  for (const { namespace, en, esMX } of namespacePairs) {
    const enKeys = collectStringKeys(en as Record<string, unknown>);
    const esMXKeys = new Set(collectStringKeys(esMX as Record<string, unknown>));
    // Only include keys present in both locales
    const sharedKeys = enKeys.filter((k) => esMXKeys.has(k));
    for (const key of sharedKeys) {
      for (const locale of supportedLocales) {
        entries.push({ locale, namespace, key });
      }
    }
  }

  // Arbitrary that picks a random entry from the pre-computed list
  const entryArb = fc.constantFrom(...entries);

  beforeAll(() => {
    // Ensure i18n is initialized before running property tests
    i18n.use(initReactI18next).init({
      resources,
      ns,
      defaultNS: ns[0],
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      initImmediate: false,
    });
  });

  it('should return the correct locale value after changing language', () => {
    fc.assert(
      fc.property(entryArb, ({ locale, namespace, key }) => {
        // Change to the target locale
        i18n.changeLanguage(locale);

        const result = i18n.t(key, { ns: namespace });

        // Look up the expected value from the raw resource for this locale + namespace
        const localeResources = resources[locale as keyof typeof resources];
        const nsResource = localeResources[namespace as keyof typeof localeResources];
        const expected = resolve(nsResource as Record<string, unknown>, key);

        expect(result).toBe(expected);
      }),
      { numRuns: 100 },
    );
  });

  it('should reflect the new locale for every shared key after switching languages', () => {
    fc.assert(
      fc.property(entryArb, ({ locale, namespace, key }) => {
        // Start from the opposite locale to ensure a real switch happens
        const startLocale = locale === 'en' ? 'es-MX' : 'en';
        i18n.changeLanguage(startLocale);

        // Verify we get the start locale's value first
        const startResources = resources[startLocale as keyof typeof resources];
        const startNsResource = startResources[namespace as keyof typeof startResources];
        const startExpected = resolve(startNsResource as Record<string, unknown>, key);
        expect(i18n.t(key, { ns: namespace })).toBe(startExpected);

        // Now switch to the target locale
        i18n.changeLanguage(locale);

        const targetResources = resources[locale as keyof typeof resources];
        const targetNsResource = targetResources[namespace as keyof typeof targetResources];
        const targetExpected = resolve(targetNsResource as Record<string, unknown>, key);
        expect(i18n.t(key, { ns: namespace })).toBe(targetExpected);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Validates: Requirements 6.8
 *
 * Property 12: Dot-separated key resolution
 *
 * For any dot-separated key path and any nested JSON translation object,
 * the i18n service should resolve the key by walking the nested structure
 * and returning the leaf value.
 */
describe('Dot-separated key resolution', () => {
  /**
   * Resolve a dot-separated key path against a nested object, returning the leaf value.
   */
  function resolve(obj: Record<string, unknown>, keyPath: string): unknown {
    return keyPath.split('.').reduce<unknown>((acc, part) => {
      if (acc !== null && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  }

  /**
   * Recursively collect all dot-separated key paths that resolve to a string value.
   */
  function collectStringKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    const keys: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'string') {
        keys.push(path);
      } else if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        keys.push(...collectStringKeys(v as Record<string, unknown>, path));
      }
    }
    return keys;
  }

  /**
   * Arbitrary that generates a nested object with string leaf values.
   * Keys are simple alphabetic identifiers; values are non-empty strings.
   * Depth is bounded to 1–4 levels to keep generation tractable.
   */
  const keyArb = fc.stringMatching(/^[a-z][a-zA-Z0-9]{0,7}$/);
  const leafArb = fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0);

  const nestedObjectArb: fc.Arbitrary<Record<string, unknown>> = fc.letrec((tie) => ({
    leaf: leafArb,
    node: fc.dictionary(
      keyArb,
      fc.oneof(
        { weight: 3, arbitrary: tie('leaf') },
        { weight: 1, arbitrary: tie('node') },
      ),
      { minKeys: 1, maxKeys: 4 },
    ),
  })).node;

  it('should resolve every dot-separated key path to the correct leaf value', () => {
    fc.assert(
      fc.property(nestedObjectArb, (translationObj) => {
        const keys = collectStringKeys(translationObj as Record<string, unknown>);

        // Skip if the generated object has no string leaves
        fc.pre(keys.length > 0);

        // Create a fresh i18n instance with the generated object as a custom namespace
        const testInstance = i18n.createInstance();
        testInstance.use(initReactI18next).init({
          resources: {
            en: { generated: translationObj },
          },
          ns: ['generated'],
          defaultNS: 'generated',
          lng: 'en',
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
          initImmediate: false,
          keySeparator: '.',
        });

        // For each dot-separated key, i18n should resolve to the same leaf value
        for (const keyPath of keys) {
          const i18nResult = testInstance.t(keyPath, { ns: 'generated' });
          const expected = resolve(translationObj as Record<string, unknown>, keyPath);
          expect(i18nResult).toBe(expected);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('should resolve deeply nested keys the same way as manual object traversal', () => {
    // Arbitrary that generates objects with guaranteed depth >= 2
    const deepObjectArb = fc.dictionary(
      keyArb,
      fc.dictionary(
        keyArb,
        fc.oneof(
          { weight: 2, arbitrary: leafArb },
          { weight: 1, arbitrary: fc.dictionary(keyArb, leafArb, { minKeys: 1, maxKeys: 3 }) },
        ),
        { minKeys: 1, maxKeys: 3 },
      ),
      { minKeys: 1, maxKeys: 3 },
    );

    fc.assert(
      fc.property(deepObjectArb, (translationObj) => {
        const keys = collectStringKeys(translationObj as Record<string, unknown>);
        fc.pre(keys.length > 0);

        const testInstance = i18n.createInstance();
        testInstance.use(initReactI18next).init({
          resources: {
            en: { deep: translationObj },
          },
          ns: ['deep'],
          defaultNS: 'deep',
          lng: 'en',
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
          initImmediate: false,
          keySeparator: '.',
        });

        for (const keyPath of keys) {
          const i18nResult = testInstance.t(keyPath, { ns: 'deep' });
          const expected = resolve(translationObj as Record<string, unknown>, keyPath);
          expect(i18nResult).toBe(expected);
        }
      }),
      { numRuns: 100 },
    );
  });
});


// ---------------------------------------------------------------------------
// Unit tests for i18n initialization
// ---------------------------------------------------------------------------

describe('i18n initialization', () => {
  /**
   * Helper: create a fresh i18n instance with the standard resources.
   */
  function createI18nInstance(lng: string) {
    const instance = i18n.createInstance();
    instance.use(initReactI18next).init({
      resources,
      ns,
      defaultNS: ns[0],
      lng,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      initImmediate: false,
      keySeparator: '.',
    });
    return instance;
  }

  describe('locale loading', () => {
    it('should load the en locale and resolve common keys', () => {
      const instance = createI18nInstance('en');
      expect(instance.language).toBe('en');
      expect(instance.t('title', { ns: 'common' })).toBe('Board Game Guides');
    });

    it('should load the es-MX locale and resolve common keys', () => {
      const instance = createI18nInstance('es-MX');
      expect(instance.language).toBe('es-MX');
      expect(instance.t('title', { ns: 'common' })).toBe('Guías de juegos de mesa');
    });

    it('should load en translations for the castles-of-burgundy namespace', () => {
      const instance = createI18nInstance('en');
      expect(instance.t('app.title', { ns: 'castles-of-burgundy' })).toBe(
        'The Castles of Burgundy',
      );
    });

    it('should load es-MX translations for the castles-of-burgundy namespace', () => {
      const instance = createI18nInstance('es-MX');
      expect(instance.t('app.title', { ns: 'castles-of-burgundy' })).toBe(
        'Los castillos de Borgoña',
      );
    });

    it('should load en translations for the quacks namespace', () => {
      const instance = createI18nInstance('en');
      const title = instance.t('app.title', { ns: 'quacks' });
      expect(title).toBe(quacksEn.app.title);
    });

    it('should load es-MX translations for the quacks namespace', () => {
      const instance = createI18nInstance('es-MX');
      const title = instance.t('app.title', { ns: 'quacks' });
      expect(title).toBe(quacksEsMX.app.title);
    });
  });

  describe('specific key resolution', () => {
    it('should return the expected English string for a known flat key', () => {
      const instance = createI18nInstance('en');
      expect(instance.t('home-subtitle', { ns: 'common' })).toBe(
        'Quick setup & play references for your favorite tabletop games.',
      );
    });

    it('should return the expected es-MX string for a known flat key', () => {
      const instance = createI18nInstance('es-MX');
      expect(instance.t('home-subtitle', { ns: 'common' })).toBe(
        'Referencias rápidas de preparación y juego para tus juegos de mesa favoritos.',
      );
    });

    it('should return the key itself when the key does not exist', () => {
      const instance = createI18nInstance('en');
      const result = instance.t('nonexistent.key.path', { ns: 'common' });
      expect(result).toBe('nonexistent.key.path');
    });
  });

  describe('dot-separated key resolution', () => {
    it('should resolve a two-level dot-separated key (app.title)', () => {
      const instance = createI18nInstance('en');
      expect(instance.t('app.title', { ns: 'castles-of-burgundy' })).toBe(
        'The Castles of Burgundy',
      );
    });

    it('should resolve a two-level dot-separated key (app.icon)', () => {
      const instance = createI18nInstance('en');
      expect(instance.t('app.icon', { ns: 'castles-of-burgundy' })).toBe('🏰');
    });

    it('should resolve a two-level dot-separated key (overview.heading)', () => {
      const instance = createI18nInstance('en');
      expect(instance.t('overview.heading', { ns: 'castles-of-burgundy' })).toBe(
        "What You're Trying to Do",
      );
    });

    it('should resolve dot-separated keys in es-MX locale', () => {
      const instance = createI18nInstance('es-MX');
      expect(instance.t('overview.heading', { ns: 'castles-of-burgundy' })).toBe(
        'Lo que está tratando de hacer',
      );
    });

    it('should resolve dot-separated keys across different namespaces', () => {
      const instance = createI18nInstance('en');
      expect(instance.t('app.icon', { ns: 'quacks' })).toBe(quacksEn.app.icon);
      expect(instance.t('app.icon', { ns: 'castles-of-burgundy' })).toBe('🏰');
    });
  });
});
