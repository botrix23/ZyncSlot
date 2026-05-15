import { db } from "@/db";
import { tenants, branches, staff, services } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getPlanFeatures } from "@/core/plans";
import { sql } from "drizzle-orm";

type Resource = "branches" | "staff" | "services";

export async function checkPlanLimit(
  tenantId: string,
  resource: Resource
): Promise<{ allowed: boolean; current: number; limit: number; plan: string }> {
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
    columns: { plan: true },
  });

  const plan = tenant?.plan || "BASIC";
  const features = getPlanFeatures(plan);

  let current = 0;
  let limit = 0;

  if (resource === "branches") {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(branches)
      .where(and(eq(branches.tenantId, tenantId), eq(branches.isActive, true)));
    current = row?.count ?? 0;
    limit = features.maxBranches;
  } else if (resource === "staff") {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(staff)
      .where(and(eq(staff.tenantId, tenantId), eq(staff.isActive, true)));
    current = row?.count ?? 0;
    limit = features.maxStaff;
  } else if (resource === "services") {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(services)
      .where(and(eq(services.tenantId, tenantId), eq(services.isActive, true)));
    current = row?.count ?? 0;
    limit = features.maxServices;
  }

  return { allowed: current < limit, current, limit, plan };
}
