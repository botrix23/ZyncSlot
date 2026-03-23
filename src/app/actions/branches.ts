"use server";

import { db } from "@/db";
import { branches } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth-session";
import { logAuditEvent } from "@/lib/audit";
import { revalidatePath } from "next/cache";

/**
 * Obtener todas las sucursales de un tenant
 */
export async function getBranchesAction(tenantId: string) {
  const session = await getSession();
  if (!session || (session.tenantId !== tenantId && session.role !== 'SUPER_ADMIN')) {
    throw new Error("Unauthorized");
  }

  return await db.query.branches.findMany({
    where: eq(branches.tenantId, tenantId),
    orderBy: [desc(branches.createdAt)]
  });
}

/**
 * Crear una nueva sucursal
 */
export async function createBranchAction(data: {
  tenantId: string;
  name: string;
  address?: string;
  phone?: string;
  businessHours?: string;
}) {
  const session = await getSession();
  if (!session || (session.tenantId !== data.tenantId && session.role !== 'SUPER_ADMIN')) {
    throw new Error("Unauthorized");
  }

  const [newBranch] = await db.insert(branches).values({
    ...data,
    createdAt: new Date(),
  }).returning();

  await logAuditEvent({
    action: 'SETTINGS_UPDATED',
    userId: session.userId,
    tenantId: data.tenantId,
    details: { type: 'BRANCH_CREATED', branchName: data.name }
  });

  revalidatePath('/[locale]/admin/branches', 'page');
  return { success: true, branch: newBranch };
}

/**
 * Actualizar una sucursal existente
 */
export async function updateBranchAction(data: {
  id: string;
  tenantId: string;
  name: string;
  address?: string;
  phone?: string;
  businessHours?: string;
}) {
  const session = await getSession();
  if (!session || (session.tenantId !== data.tenantId && session.role !== 'SUPER_ADMIN')) {
    throw new Error("Unauthorized");
  }

  await db.update(branches)
    .set({
      name: data.name,
      address: data.address,
      phone: data.phone,
      businessHours: data.businessHours,
    })
    .where(and(eq(branches.id, data.id), eq(branches.tenantId, data.tenantId)));

  await logAuditEvent({
    action: 'SETTINGS_UPDATED',
    userId: session.userId,
    tenantId: data.tenantId,
    details: { type: 'BRANCH_UPDATED', branchName: data.name }
  });

  revalidatePath('/[locale]/admin/branches', 'page');
  return { success: true };
}

/**
 * Eliminar una sucursal
 */
export async function deleteBranchAction(id: string, tenantId: string) {
  const session = await getSession();
  if (!session || (session.tenantId !== tenantId && session.role !== 'SUPER_ADMIN')) {
    throw new Error("Unauthorized");
  }

  // Verificar si hay más sucursales antes de eliminar (no dejar al tenant sin sucursales)
  const existing = await db.query.branches.findMany({
    where: eq(branches.tenantId, tenantId)
  });

  if (existing.length <= 1) {
    return { success: false, error: "Debes tener al menos una sucursal." };
  }

  const branchToDelete = existing.find(b => b.id === id);

  await db.delete(branches).where(and(eq(branches.id, id), eq(branches.tenantId, tenantId)));

  await logAuditEvent({
    action: 'SETTINGS_UPDATED',
    userId: session.userId,
    tenantId: tenantId,
    details: { type: 'BRANCH_DELETED', branchName: branchToDelete?.name }
  });

  revalidatePath('/[locale]/admin/branches', 'page');
  return { success: true };
}
