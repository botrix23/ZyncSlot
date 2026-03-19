import React from 'react';
import { db } from '@/db';
import { staff as staffTable, branches as branchesTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth-session';
import { redirect } from 'next/navigation';
import StaffClient from './StaffClient';

export default async function StaffPage() {
  const session = await getSession();
  
  if (!session || !session.tenantId) {
    redirect('/admin/login');
  }

  const tenantId = session.tenantId;

  // Obtener staff y sucursales (para el selector en el modal)
  const [dbStaff, dbBranches] = await Promise.all([
    db.select()
      .from(staffTable)
      .where(eq(staffTable.tenantId, tenantId))
      .orderBy(desc(staffTable.createdAt)),
    db.select()
      .from(branchesTable)
      .where(eq(branchesTable.tenantId, tenantId))
  ]);

  return (
    <StaffClient 
      initialStaff={dbStaff} 
      branches={dbBranches}
      tenantId={tenantId} 
    />
  );
}
