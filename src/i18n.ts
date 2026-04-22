import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['es', 'en'];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = (await requestLocale) || 'es';

  if (!locales.includes(locale as any)) notFound();

  const messages = (await import(`../messages/${locale}.json`)).default;
  return {
    locale,
    messages
  };
});
