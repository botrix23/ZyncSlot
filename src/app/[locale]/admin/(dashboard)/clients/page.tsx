import { db } from "@/db";
import { bookings, services } from "@/db/schema";
import { eq, desc, and, not } from "drizzle-orm";
import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import ClientsClient from "./ClientsClient";

export const metadata = {
  title: "Clientes | ZincSlot",
};

export default async function ClientsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const session = await getSession();
  if (!session) redirect(`/${locale}/admin/login`);

  const tenantId = session.role === 'SUPER_ADMIN' && session.impersonatedTenantId
    ? session.impersonatedTenantId
    : session.tenantId;

  if (!tenantId) redirect(`/${locale}/admin`);

  // Obtener citas válidas (no canceladas)
  const tenantBookings = await db.select().from(bookings).where(
    and(
        eq(bookings.tenantId, tenantId),
        not(eq(bookings.status, 'CANCELLED'))
    )
  ).orderBy(desc(bookings.createdAt));

  // Obtener catálogo de servicios para calcular precios
  const tenantServices = await db.select().from(services).where(eq(services.tenantId, tenantId));

  return (
    <ClientsClient 
      bookings={tenantBookings} 
      services={tenantServices}
    />
  );
}
