import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es'
});

export const config = {
  // Solo rutas que no sean archivos estáticos ni API
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
