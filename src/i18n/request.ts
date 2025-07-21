import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  // This can either be defined statically at the top level if the locale
  // doesn't change, or alternatively read from the user's profile, a database,
  // the `Accept-Language` header, etc.
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Detect locale from Accept-Language header or default to English
  let locale = 'en';
  if (acceptLanguage.includes('es')) {
    locale = 'es';
  } else if (acceptLanguage.includes('en')) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
