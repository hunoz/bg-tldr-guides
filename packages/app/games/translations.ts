import cobEn from '../assets/i18n/castles-of-burgundy/en.json';
import cobEsMX from '../assets/i18n/castles-of-burgundy/es-MX.json';
import quacksEn from '../assets/i18n/quacks/en.json';
import quacksEsMX from '../assets/i18n/quacks/es-MX.json';

export const translationMap: Record<string, Record<string, object>> = {
    'castles-of-burgundy': {
        'en': cobEn,
        'es-MX': cobEsMX,
    },
    'quacks': {
        'en': quacksEn,
        'es-MX': quacksEsMX,
    },
};
