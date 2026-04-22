import { db } from "@/db";
import { tenants, branches, staff, services } from "@/db/schema";
import { eq } from "drizzle-orm";
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

  const plan = tenant?.plan || "FREE";
  const features = getPlanFeatures(plan);

  let current = 0;
  let limit = 0;

  if (resource === "branches") {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(branches)
      .where(eq(branches.tenantId, tenantId));
    current = row?.count ?? 0;
    limit = features.maxBranches;
  } else if (resource === "staff") {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(staff)
      .where(eq(staff.tenantId, tenantId));
    current = row?.count ?? 0;
    limit = features.maxStaff;
  } else if (resource === "services") {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(services)
      .where(eq(services.tenantId, tenantId));
    current = row?.count ?? 0;
    limit = features.maxServices;
  }

  return { allowed: current < limit, current, limit, plan };
}
