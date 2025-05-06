import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import {store} from '../redux/store';
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: cb => {
    const selectedLanguage = store.getState().waiter?.settings?.locale;
    cb(selectedLanguage || 'en');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          ...en,
          toCurrency: '{{value, price}}',
        },
      },
      ar: {
        translation: {
          ...ar,
          toCurrency: '{{value, price}}',
        },
      },
      de: {
        translation: {
          ...de,
          toCurrency: '{{value, price}}',
        },
      },
      fr: {
        translation: {
          ...fr,
          toCurrency: '{{value, price}}',
        },
      },
      es: {
        translation: {
          ...es,
          toCurrency: '{{value, price}}',
        },
      },
    },
    interpolation: {
      format: (value, rawFormat, lng) => {
        const [format, ...additionalValues] = rawFormat
          .split(',')
          .map(v => v.trim());
        switch (format) {
          case 'uppercase':
            return value.toUpperCase();
          case 'price':
            return Intl.NumberFormat(`${lng}-US`, {
              style: 'currency',
              currency:
                store.getState().server.merchant.merchant.currency_code ||
                'USD',
            }).format(value);
        }
      },
    },
  });
