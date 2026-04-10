import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Static imports of all translation JSON files
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

const LOCALE_STORAGE_KEY = 'rulesnap_locale';

const ns = ['common', 'castles-of-burgundy', 'quacks'];

/** All game namespace IDs (excludes "common"). */
export const gameIds = ns.filter((n) => n !== 'common');

/**
 * Detect the user's preferred locale.
 * Native: expo-localization getLocales()
 * Web: navigator.language
 */
function detectLocale(): string {
  if (Platform.OS === 'web') {
    return typeof navigator !== 'undefined' ? navigator.language : 'en';
  }

  try {
    const locales = getLocales();
    if (locales && locales.length > 0) {
      return locales[0].languageTag;
    }
  } catch {
    // Fall back to English if expo-localization is unavailable
  }

  return 'en';
}

i18n.use(initReactI18next).init({
  resources,
  ns,
  defaultNS: ns[0],
  lng: detectLocale(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Load persisted locale (async — overrides device locale if user previously chose one)
AsyncStorage.getItem(LOCALE_STORAGE_KEY).then((saved) => {
  if (saved && saved !== i18n.language) {
    i18n.changeLanguage(saved);
  }
});

// Persist locale whenever it changes
i18n.on('languageChanged', (lng) => {
  AsyncStorage.setItem(LOCALE_STORAGE_KEY, lng);
});

export { ns };
export default i18n;
