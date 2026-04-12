import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { gameIds } from '../games/registry';
import { translationMap } from '../games/translations';

// Common namespace translations
import commonEn from '../assets/i18n/common/en.json';
import commonEsMX from '../assets/i18n/common/es-MX.json';

// Build the namespace list from the registry plus the common namespace
const ns = ['common', ...gameIds];

// Build the resources object dynamically from the translation map
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

const LOCALE_STORAGE_KEY = 'rulesnap_locale';

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
AsyncStorage.getItem(LOCALE_STORAGE_KEY).then(saved => {
    if (saved && saved !== i18n.language) {
        i18n.changeLanguage(saved);
    }
});

// Persist locale whenever it changes
i18n.on('languageChanged', lng => {
    AsyncStorage.setItem(LOCALE_STORAGE_KEY, lng);
});

export { ns };
export default i18n;
