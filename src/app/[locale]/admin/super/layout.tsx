import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-session';
import { SuperAdminLayoutClient } from './SuperAdminLayoutClient';

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect('/es/admin/login');
  }

  return (
    <SuperAdminLayoutClient email={session.email}>
      {children}
    </SuperAdminLayoutClient>
  );
}
