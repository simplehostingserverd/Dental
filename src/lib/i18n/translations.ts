import enMessages from '@/i18n/messages/en.json';
import esMessages from '@/i18n/messages/es.json';

export type Locale = 'en' | 'es';

export const translations = {
  en: enMessages,
  es: esMessages,
};

export const defaultLocale: Locale = 'en';

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && value !== null && fallbackKey in value) {
          value = (value as Record<string, unknown>)[fallbackKey];
        } else {
          return key; // Return key if not found in fallback
        }
      }
      break;
    }
  }

  return typeof value === 'string' ? value : key;
}
