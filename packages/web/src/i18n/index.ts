import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18n, { type Resource } from 'i18next';

// Eagerly import all translation JSON files under translations/<game>/<lang>.json
const translationModules = import.meta.glob<Record<string, unknown>>('./translations/*/*.json', {
    eager: true,
});

// Build the resources object: { [lang]: { [namespace]: translations } }
const resources: Resource = {};
const namespaces = new Set<string>();

for (const [path, mod] of Object.entries(translationModules)) {
    // path looks like: ./translations/castles-of-burgundy/en.json
    const parts = path.split('/');
    const namespace = parts[2]; // game folder name
    const lang = parts[3].replace('.json', ''); // e.g. "en", "es-MX"

    namespaces.add(namespace);
    resources[lang] ??= {};
    resources[lang][namespace] = ((mod as { default?: unknown }).default ?? mod) as Record<
        string,
        string
    >;
}

const ns = [...namespaces];

/** All auto-discovered game namespace IDs (excludes "common"). */
export const gameIds = ns.filter(n => n !== 'common');

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        ns,
        defaultNS: ns[0],
        fallbackLng: 'en',
        detection: {
            order: ['querystring', 'navigator'],
            caches: [],
        },
        interpolation: { escapeValue: false },
    });

export default i18n;
