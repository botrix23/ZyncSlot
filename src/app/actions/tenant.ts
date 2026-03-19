"use server";

import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateTenantSettingsAction(data: {
  tenantId: string;
  name?: string;
  logoUrl?: string;
  homeServiceTerms?: string;
  homeServiceTermsEnabled?: boolean;
}) {
  try {
    await db.update(tenants)
      .set({
        name: data.name,
        logoUrl: data.logoUrl,
        homeServiceTerms: data.homeServiceTerms,
        homeServiceTermsEnabled: data.homeServiceTermsEnabled,
        updatedAt: new Date()
      })
      .where(eq(tenants.id, data.tenantId));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating tenant settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
