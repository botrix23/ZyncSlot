import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import SettingsPage from "./SettingsPage";

export default async function SettingsPageWrapper({ params }: { params: { locale: string } }) {
  const session = await getSession();
  const locale = params.locale || 'es';

  if (!session || !session.tenantId) {
    redirect(`/${locale}/admin/login`);
  }

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.tenantId)
  });

  if (!tenant) {
    return <div>Negocio no encontrado.</div>;
  }

  return (
    <SettingsPage 
      tenant={{
        id: tenant.id,
        name: tenant.name,
        logoUrl: tenant.logoUrl,
        homeServiceTerms: tenant.homeServiceTerms,
        homeServiceTermsEnabled: tenant.homeServiceTermsEnabled
      }} 
    />
  );
}
