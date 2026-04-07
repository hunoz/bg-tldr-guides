import type { CoBSchema } from './translations/castles-of-burgundy/schema';
import { CommonSchema } from './translations/common/schema';
import type { QuacksSchema } from './translations/quacks/schema';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common';
        resources: {
            'castles-of-burgundy': CoBSchema;
            'quacks': QuacksSchema;
            'common': CommonSchema;
        };
    }
}
