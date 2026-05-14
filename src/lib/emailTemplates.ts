import { db } from '@/db';
import { platformConfig } from '@/db/schema';

export async function getPlatformEmailTemplates() {
  return db.select().from(platformConfig).limit(1).then(rows => rows[0] ?? null);
}

export function replaceTemplateVars(html: string, vars: Record<string, string | undefined>): string {
  return Object.entries(vars).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value ?? '');
  }, html);
}

export function buildEmailPayload(
  customHtml: string | null | undefined,
  reactElement: React.ReactElement,
  vars: Record<string, string | undefined>
): { react: React.ReactElement } | { html: string } {
  if (customHtml) {
    return { html: replaceTemplateVars(customHtml, vars) };
  }
  return { react: reactElement };
}
