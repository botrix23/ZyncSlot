import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, users } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { addDays } from "date-fns";
import { resend } from "@/lib/resend";
import { TrialWarningEmail } from "@/components/emails/TrialWarningEmail";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // Window: tenants expiring between now+2d and now+3d → 3-day warning
    const warn3Start = addDays(now, 2);
    const warn3End = addDays(now, 3);

    // Window: tenants expiring between now and now+1d → 1-day warning
    const warn1End = addDays(now, 1);

    const expiring3 = await db.query.tenants.findMany({
      where: and(
        eq(tenants.status, 'TRIAL'),
        gte(tenants.subscriptionExpiresAt, warn3Start),
        lte(tenants.subscriptionExpiresAt, warn3End),
      ),
      with: {
        users: {
          where: eq(users.role, 'ADMIN'),
          columns: { email: true, name: true },
        },
      },
      columns: { id: true, name: true },
    });

    const expiring1 = await db.query.tenants.findMany({
      where: and(
        eq(tenants.status, 'TRIAL'),
        gte(tenants.subscriptionExpiresAt, now),
        lte(tenants.subscriptionExpiresAt, warn1End),
      ),
      with: {
        users: {
          where: eq(users.role, 'ADMIN'),
          columns: { email: true, name: true },
        },
      },
      columns: { id: true, name: true },
    });

    let sent = 0;
    let failed = 0;

    const sendWarnings = async (
      trialTenants: typeof expiring3,
      daysLeft: number,
    ) => {
      for (const tenant of trialTenants) {
        for (const admin of tenant.users) {
          if (!admin.email) continue;
          try {
            await resend.emails.send({
              from: "Zyncrox <noreply@zyncrox.com>",
              to: admin.email,
              subject: daysLeft === 0
                ? `Tu período de prueba en Zyncrox ha vencido`
                : `Tu trial en Zyncrox vence en ${daysLeft} día${daysLeft === 1 ? "" : "s"}`,
              react: TrialWarningEmail({
                businessName: tenant.name,
                daysLeft,
                adminName: admin.name ?? undefined,
              }),
            });
            sent++;
          } catch (e) {
            console.error(`[Trial Cron] Failed for tenant ${tenant.id}:`, e);
            failed++;
          }
        }
      }
    };

    await sendWarnings(expiring3, 3);
    await sendWarnings(expiring1, 1);

    await logAuditEvent({
      action: "CRON_TRIAL_RUN",
      details: {
        sent,
        failed,
        expiring3: expiring3.length,
        expiring1: expiring1.length,
        success: true,
      },
    });

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      expiring3: expiring3.length,
      expiring1: expiring1.length,
    });
  } catch (error) {
    console.error("[Trial Cron] Error:", error);
    await logAuditEvent({
      action: "CRON_TRIAL_RUN",
      details: { success: false, error: String(error) },
    }).catch(() => {});
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
