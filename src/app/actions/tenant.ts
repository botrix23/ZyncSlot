"use server";

import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth-session";
import { logAuditEvent } from "@/lib/audit";

export async function updateTenantSettingsAction(data: {
  tenantId: string;
  name?: string;
  logoUrl?: string;
  whatsappNumber?: string;
  homeServiceTerms?: string;
  homeServiceTermsEnabled?: boolean;
  waMessageTemplate?: string | null;
}) {
  try {
    const session = await getSession();
    await db.update(tenants)
      .set({
        name: data.name,
        logoUrl: data.logoUrl,
        whatsappNumber: data.whatsappNumber,
        homeServiceTerms: data.homeServiceTerms,
        homeServiceTermsEnabled: data.homeServiceTermsEnabled,
        waMessageTemplate: data.waMessageTemplate,
        updatedAt: new Date()
      })
      .where(eq(tenants.id, data.tenantId));

    await logAuditEvent({
      action: 'SETTINGS_UPDATED',
      userId: session?.userId,
      tenantId: data.tenantId,
      details: { updatedFields: Object.keys(data).filter(k => k !== 'tenantId') },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating tenant settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
