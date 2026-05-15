"use server";

import { db } from "@/db";
import { branches } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { getSession, getEffectiveTenantId } from "@/lib/auth-session";
import { logAuditEvent } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { checkPlanLimit } from "@/lib/plan-guard";

/**
 * Obtener todas las sucursales de un tenant (activas e inactivas)
 */
export async function getBranchesAction(tenantId: string) {
  const session = await getSession();
  if (!session || (session.tenantId !== tenantId && session.role !== 'SUPER_ADMIN')) {
    throw new Error("Unauthorized");
  }

  return await db.query.branches.findMany({
    where: eq(branches.tenantId, tenantId),
    orderBy: [asc(branches.createdAt)]
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

  const limitCheck = await checkPlanLimit(data.tenantId, "branches");
  if (!limitCheck.allowed) {
    return {
      success: false,
      error: "PLAN_LIMIT_EXCEEDED",
      limit: limitCheck.limit,
      current: limitCheck.current,
      plan: limitCheck.plan,
    };
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

  // Verificar si hay más sucursales activas antes de eliminar
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

/**
 * Activar / desactivar una sucursal
 * Al reactivar, verifica que no se exceda el límite del plan
 */
export async function toggleBranchActiveAction(id: string, tenantId: string, currentlyActive: boolean) {
  const session = await getSession();
  if (!session || (session.tenantId !== tenantId && session.role !== 'SUPER_ADMIN')) {
    throw new Error("Unauthorized");
  }

  // Si queremos reactivar, checar límite del plan
  if (!currentlyActive) {
    const limitCheck = await checkPlanLimit(tenantId, "branches");
    if (!limitCheck.allowed) {
      return {
        success: false,
        error: "PLAN_LIMIT_EXCEEDED",
        limit: limitCheck.limit,
        current: limitCheck.current,
        plan: limitCheck.plan,
      };
    }
  }

  await db.update(branches)
    .set({ isActive: !currentlyActive })
    .where(and(eq(branches.id, id), eq(branches.tenantId, tenantId)));

  revalidatePath('/[locale]/admin/branches', 'page');
  return { success: true };
}
