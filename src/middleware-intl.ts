import createMiddleware from 'next-intl/middleware';
import { defaultLocale } from './lib/i18n/translations';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'es'],
  
  // Used when no locale matches
  defaultLocale,
  
  // This is the strategy to detect the locale from the request
  localeDetection: true,
  
  // This is the strategy to determine which locale to use for each request
  localePrefix: 'never'
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
