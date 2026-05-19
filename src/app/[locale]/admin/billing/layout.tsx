import { getSession } from "@/lib/auth-session";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { tenants, users, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Layout para la página de billing.
 * Igual al dashboard layout PERO sin el redirect por trial expirado —
 * justamente para que los usuarios con trial vencido puedan llegar aquí y pagar.
 */
export default async function BillingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getSession();
  const locale = params.locale || "es";

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  // Verificar que el usuario sigue activo en la DB
  if (session.userId) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { isActive: true, mustChangePassword: true },
    });
    if (!dbUser || !dbUser.isActive) {
      redirect(`/${locale}/admin/login`);
    }
    if (dbUser?.mustChangePassword) {
      redirect(`/${locale}/admin/change-password?forced=1`);
    }
  }

  let tenantName = "";
  let tenantPlan: string | null = null;
  let tenantStatus: string = "ACTIVE";
  let trialEndsAt: Date | null = null;
  let nextBillingDate: Date | null = null;
  const userEmail: string | null = session?.email ?? null;

  if (session.tenantId) {
    try {
      const [tenant, sub] = await Promise.all([
        db.query.tenants.findFirst({ where: eq(tenants.id, session.tenantId) }),
        db.query.subscriptions.findFirst({
          where: eq(subscriptions.tenantId, session.tenantId),
        }),
      ]);
      tenantName = tenant?.name || "";
      tenantPlan = tenant?.plan ?? null;
      tenantStatus = tenant?.status ?? "ACTIVE";
      trialEndsAt = tenant?.subscriptionExpiresAt ?? null;
      nextBillingDate = sub?.currentPeriodEnd ?? null;
    } catch (error) {
      console.error("Error fetching billing tenant details:", error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex overflow-hidden">
      <AdminSidebar
        user={session}
        locale={locale}
        tenantName={tenantName}
        tenantPlan={tenantPlan}
      />
      <main className="flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden">
        <AdminHeader
          user={session}
          locale={locale}
          userEmail={userEmail}
          nextBillingDate={nextBillingDate}
          tenantStatus={tenantStatus}
          trialEndsAt={trialEndsAt}
        />
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-slate-50 dark:bg-black/40">
          {children}
        </div>
      </main>
    </div>
  );
}
