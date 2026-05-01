import { getSession } from "@/lib/auth-session";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import PaymentsClient from "./PaymentsClient";

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session?.tenantId) {
    redirect(`/${locale}/admin/login`);
  }

  const tenant = await db
    .select({
      id: tenants.id,
      wompiAppId: tenants.wompiAppId,
      wompiApiSecret: tenants.wompiApiSecret,
      wompiIsProduction: tenants.wompiIsProduction,
    })
    .from(tenants)
    .where(eq(tenants.id, session.tenantId))
    .then((rows) => rows[0]);

  if (!tenant) redirect(`/${locale}/admin`);

  return <PaymentsClient tenant={tenant} />;
}
