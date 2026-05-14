import { Mail } from 'lucide-react';
import { getEmailTemplatesAction } from '@/app/actions/superAdmin';
import EmailTemplatesClient from './EmailTemplatesClient';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function EmailTemplatesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'es';
  const [templates, t] = await Promise.all([
    getEmailTemplatesAction(),
    getTranslations({ locale, namespace: 'SuperAdmin.emailTemplatesPage' }),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-zinc-900 dark:text-white">
          <Mail className="w-7 h-7 text-purple-400" />
          {t('title')}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">{t('subtitle')}</p>
      </div>

      <EmailTemplatesClient initialTemplates={templates} locale={locale} />
    </div>
  );
}
