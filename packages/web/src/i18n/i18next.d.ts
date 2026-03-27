import type { CoBSchema } from './translations/castles-of-burgundy/schema';
import { CommonSchema } from './translations/common/schema';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common';
        resources: {
            'castles-of-burgundy': CoBSchema;
            'common': CommonSchema;
        };
    }
}
