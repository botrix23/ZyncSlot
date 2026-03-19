"use server";

import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createServiceAction(data: {
  tenantId: string;
  name: string;
  durationMinutes: number;
  price: string;
  description?: string;
}) {
  try {
    const [newService] = await db.insert(services).values({
      tenantId: data.tenantId,
      name: data.name,
      durationMinutes: data.durationMinutes,
      price: data.price,
      description: data.description,
    }).returning();

    revalidatePath("/[locale]/admin/services", "page");
    revalidatePath("/[locale]/[slug]", "page");
    return { success: true, service: newService };
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, error: "Failed to create service" };
  }
}

export async function updateServiceAction(data: {
  id: string;
  tenantId: string;
  name?: string;
  durationMinutes?: number;
  price?: string;
  description?: string;
}) {
  try {
    await db.update(services)
      .set({
        name: data.name,
        durationMinutes: data.durationMinutes,
        price: data.price,
        description: data.description,
        updatedAt: new Date(),
      })
      .where(and(eq(services.id, data.id), eq(services.tenantId, data.tenantId)));

    revalidatePath("/[locale]/admin/services", "page");
    revalidatePath("/[locale]/[slug]", "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, error: "Failed to update service" };
  }
}

export async function deleteServiceAction(id: string, tenantId: string) {
  try {
    await db.delete(services).where(and(eq(services.id, id), eq(services.tenantId, tenantId)));
    revalidatePath("/[locale]/admin/services", "page");
    revalidatePath("/[locale]/[slug]", "page");
    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: "Failed to delete service" };
  }
}
