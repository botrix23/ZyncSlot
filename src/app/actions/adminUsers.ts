"use server";

import { db } from "@/db";
import { users, tenants } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { getSession, getEffectiveTenantId } from "@/lib/auth-session";
import { logAuditEvent } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

const ADMIN_LIMITS: Record<string, number> = {
  BASIC: 1,
  PROFESSIONAL: 2,
  ENTERPRISE: Infinity,
};

async function assertAdmin() {
  const session = await getSession();
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
    throw new Error('Unauthorized');
  }
  const tenantId = getEffectiveTenantId(session);
  if (!tenantId) throw new Error('No tenantId');
  return { session, tenantId };
}

export async function getAdminsAction() {
  const { tenantId } = await assertAdmin();
  return db.query.users.findMany({
    where: and(eq(users.tenantId, tenantId), eq(users.role, 'ADMIN')),
    columns: { id: true, name: true, email: true, isActive: true, createdAt: true },
  });
}

export async function createAdminAction(data: { name: string; email: string }) {
  const { session, tenantId } = await assertAdmin();

  const tenant = await db.query.tenants.findFirst({ where: eq(tenants.id, tenantId) });
  if (!tenant) return { success: false, error: 'TENANT_NOT_FOUND' };

  const limit = ADMIN_LIMITS[tenant.plan] ?? 1;
  const activeAdmins = await db.query.users.findMany({
    where: and(eq(users.tenantId, tenantId), eq(users.role, 'ADMIN'), eq(users.isActive, true)),
  });

  if (activeAdmins.length >= limit) {
    return { success: false, error: 'PLAN_LIMIT', limit, plan: tenant.plan };
  }

  const existing = await db.query.users.findFirst({ where: eq(users.email, data.email) });
  if (existing) return { success: false, error: 'EMAIL_EXISTS' };

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  const tempPassword = 'Tmp@' + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const hashed = await bcrypt.hash(tempPassword, 10);
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  await db.insert(users).values({
    tenantId,
    name: data.name,
    email: data.email,
    password: hashed,
    role: 'ADMIN',
    isActive: true,
    mustChangePassword: true,
    tempPasswordExpiresAt: expires,
  });

  await logAuditEvent({
    action: 'ADMIN_CREATED',
    userId: session.userId,
    tenantId,
    details: { email: data.email },
  });

  revalidatePath('/[locale]/admin/settings', 'page');
  return { success: true, tempPassword };
}

export async function toggleAdminAction(userId: string, isActive: boolean) {
  const { session, tenantId } = await assertAdmin();

  if (!isActive) {
    const activeAdmins = await db.query.users.findMany({
      where: and(eq(users.tenantId, tenantId), eq(users.role, 'ADMIN'), eq(users.isActive, true)),
    });
    if (activeAdmins.length <= 1) {
      return { success: false, error: 'LAST_ADMIN' };
    }
  }

  await db.update(users)
    .set({ isActive })
    .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)));

  await logAuditEvent({
    action: 'ADMIN_STATUS_CHANGED',
    userId: session.userId,
    tenantId,
    details: { targetUserId: userId, isActive },
  });

  return { success: true };
}

export async function deleteAdminAction(userId: string) {
  const { session, tenantId } = await assertAdmin();

  if (session.userId === userId) {
    return { success: false, error: 'CANNOT_DELETE_SELF' };
  }

  const remaining = await db.query.users.findMany({
    where: and(eq(users.tenantId, tenantId), eq(users.role, 'ADMIN'), ne(users.id, userId)),
  });
  if (remaining.length === 0) {
    return { success: false, error: 'LAST_ADMIN' };
  }

  await db.delete(users).where(and(eq(users.id, userId), eq(users.tenantId, tenantId)));

  await logAuditEvent({
    action: 'ADMIN_DELETED',
    userId: session.userId,
    tenantId,
    details: { deletedUserId: userId },
  });

  revalidatePath('/[locale]/admin/settings', 'page');
  return { success: true };
}

export async function updateRecoveryEmailAction(recoveryEmail: string) {
  const { session, tenantId } = await assertAdmin();

  await db.update(tenants)
    .set({ recoveryEmail: recoveryEmail || null, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId));

  await logAuditEvent({
    action: 'SETTINGS_UPDATED',
    userId: session.userId,
    tenantId,
    details: { field: 'recoveryEmail' },
  });

  revalidatePath('/[locale]/admin/settings', 'page');
  return { success: true };
}

export async function getRecoveryEmailAction() {
  const { tenantId } = await assertAdmin();
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
    columns: { recoveryEmail: true },
  });
  return tenant?.recoveryEmail ?? null;
}
