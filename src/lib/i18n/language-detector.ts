import { cookies, headers } from 'next/headers';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { defaultLocale } from './translations';

// Define the supported locales
export const locales = ['en', 'es'];

// Get the preferred locale from the request
export function getLocale(request: Request): string {
  // Check for locale cookie first
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  if (localeCookie?.value && locales.includes(localeCookie.value)) {
    return localeCookie.value;
  }

  // Then check the Accept-Language header
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Use Negotiator to parse the Accept-Language header
  const languages = new Negotiator({ headers: { 'accept-language': acceptLanguage } }).languages();
  
  // Use intl-localematcher to find the best match
  try {
    return match(languages, locales, defaultLocale);
  } catch (error) {
    return defaultLocale;
  }
}

// Set the locale cookie
export function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
}

// Get the locale from the browser
export function getBrowserLocale(): string {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }
  
  // Check for locale in localStorage
  const storedLocale = localStorage.getItem('NEXT_LOCALE');
  if (storedLocale && locales.includes(storedLocale)) {
    return storedLocale;
  }
  
  // Check navigator.language
  const browserLocale = navigator.language.split('-')[0];
  if (locales.includes(browserLocale)) {
    return browserLocale;
  }
  
  return defaultLocale;
}
