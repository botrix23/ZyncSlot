import React from 'react';
import { getSession, getEffectiveTenantId } from '@/lib/auth-session';
import { redirect } from 'next/navigation';
import { getBranchesAction } from '@/app/actions/branches';
import { getStaffAction } from '@/app/actions/staff';
import { checkPlanLimit } from '@/lib/plan-guard';
import BranchesClient from './BranchesClient';

export default async function BranchesPage() {
  const session = await getSession();

  const tenantId = getEffectiveTenantId(session);

  if (!tenantId) {
    redirect('/admin/login');
  }

  const [initialBranches, staffMembers, planLimit] = await Promise.all([
    getBranchesAction(tenantId),
    getStaffAction(tenantId),
    checkPlanLimit(tenantId, 'branches'),
  ]);

  return (
    <BranchesClient
      initialBranches={initialBranches}
      staff={staffMembers}
      tenantId={tenantId}
      planLimit={planLimit.limit}
      plan={planLimit.plan}
    />
  );
}
