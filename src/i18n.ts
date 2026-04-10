import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['es', 'en'];

export default getRequestConfig(async ({locale}) => {
  const currentLocale = locale || 'es';
  
  if (!locales.includes(currentLocale as any)) notFound();

  const messages = (await import(`../messages/${currentLocale}.json`)).default;
  return {
    locale: currentLocale,
    messages
  };
});
