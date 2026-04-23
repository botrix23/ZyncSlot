"use server";

import { db } from "@/db";
import { absenceRequests, staff } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth-session";

export async function getNotificationsAction() {
  const session = await getSession();
  if (!session) return [];

  const tenantId = session.role === 'SUPER_ADMIN' && session.impersonatedTenantId
    ? session.impersonatedTenantId
    : session.tenantId;

  if (!tenantId) return [];

  try {
    if (session.role === 'STAFF' && session.staffId) {
      // STAFF: ver el estado de sus propias solicitudes (las más recientes)
      const requests = await db.query.absenceRequests.findMany({
        where: and(
          eq(absenceRequests.tenantId, tenantId),
          eq(absenceRequests.staffId, session.staffId)
        ),
        orderBy: [desc(absenceRequests.createdAt)],
        limit: 10,
      });

      return requests.map(r => ({
        id: r.id,
        title: r.status === 'PENDING' ? 'Solicitud enviada' : r.status === 'APPROVED' ? 'Solicitud aprobada' : 'Solicitud rechazada',
        body: r.reason || 'Sin motivo especificado',
        date: r.startTime,
        status: r.status,
        read: r.status !== 'PENDING',
        canAct: false,
      }));
    } else {
      // ADMIN: ver solicitudes pendientes para aprobar
      const pending = await db.query.absenceRequests.findMany({
        where: and(
          eq(absenceRequests.tenantId, tenantId),
          eq(absenceRequests.status, 'PENDING')
        ),
        with: { staff: true },
        orderBy: [desc(absenceRequests.createdAt)],
        limit: 20,
      });

      return pending.map(r => ({
        id: r.id,
        title: `Solicitud de ${(r as any).staff?.name || 'profesional'}`,
        body: r.reason || 'Sin motivo especificado',
        date: r.startTime,
        status: r.status,
        read: false,
        canAct: true,
        requestId: r.id,
      }));
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationsReadAction() {
  return { success: true };
}
