import { Mail } from 'lucide-react';
import { getEmailTemplatesAction } from '@/app/actions/superAdmin';
import EmailTemplatesClient from './EmailTemplatesClient';

export const dynamic = 'force-dynamic';

export default async function EmailTemplatesPage() {
  const templates = await getEmailTemplatesAction();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-zinc-900 dark:text-white">
          <Mail className="w-7 h-7 text-purple-400" />
          Templates de Email
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Visualiza y personaliza los correos que se envían a los usuarios. Los cambios se aplican en todos los envíos.
        </p>
      </div>

      <EmailTemplatesClient initialTemplates={templates} />
    </div>
  );
}
