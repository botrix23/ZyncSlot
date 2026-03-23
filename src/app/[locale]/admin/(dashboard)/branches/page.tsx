import React from 'react';
import { getSession } from '@/lib/auth-session';
import { redirect } from 'next/navigation';
import { getBranchesAction } from '@/app/actions/branches';
import BranchesClient from './BranchesClient';

export default async function BranchesPage() {
  const session = await getSession();
  
  if (!session || !session.tenantId) {
    redirect('/admin/login');
  }

  const tenantId = session.tenantId;
  const initialBranches = await getBranchesAction(tenantId);

  return (
    <BranchesClient 
      initialBranches={initialBranches} 
      tenantId={tenantId} 
    />
  );
}
