import React from 'react';
import { db } from '@/db';
import { services as servicesTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth-session';
import { redirect } from 'next/navigation';
import ServicesClient from './ServicesClient';

export default async function ServicesPage() {
  const session = await getSession();
  
  if (!session || !session.tenantId) {
    redirect('/admin/login');
  }

  const tenantId = session.tenantId;

  // Obtener servicios reales de la base de datos
  const dbServices = await db.select()
    .from(servicesTable)
    .where(eq(servicesTable.tenantId, tenantId))
    .orderBy(desc(servicesTable.createdAt));

  return (
    <ServicesClient 
      initialServices={dbServices} 
      tenantId={tenantId} 
    />
  );
}
