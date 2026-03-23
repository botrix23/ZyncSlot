"use client";

import { 
  LayoutDashboard,
  Settings,
  Calendar,
  Users,
  Scissors,
  Package,
  LogOut,
  ShieldAlert,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { endImpersonationAction } from '@/app/actions/superAdmin';
import { SessionUser } from '@/lib/auth-session';
import { useState } from 'react';

export function AdminSidebar({ user, locale }: { user: SessionUser | null, locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [endingImpersonation, setEndingImpersonation] = useState(false);

  const isImpersonating = user?.role === 'SUPER_ADMIN' && !!user?.impersonatedTenantId;
  
  const baseItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: `/${locale}/admin`, active: pathname === `/${locale}/admin` },
    { name: 'Citas', icon: Calendar, href: `/${locale}/admin/bookings`, active: pathname.includes('/bookings') },
    { name: 'Servicios', icon: Scissors, href: `/${locale}/admin/services`, active: pathname.includes('/services') },
    { name: 'Staff / Equipo', icon: Users, href: `/${locale}/admin/staff`, active: pathname.includes('/staff') },
    { name: 'Sucursales', icon: MapPin, href: `/${locale}/admin/branches`, active: pathname.includes('/branches') },
    { name: 'Productos', icon: Package, href: `/${locale}/admin/products`, active: pathname.includes('/products') },
    { name: 'Configuración', icon: Settings, href: `/${locale}/admin/settings`, active: pathname.includes('/settings') },
  ];

  const handleEndImpersonation = async () => {
    setEndingImpersonation(true);
    await endImpersonationAction();
    router.push(`/${locale}/admin/super`);
    router.refresh();
  };

  return (
    <aside className="w-72 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-white/5 hidden lg:flex flex-col h-screen sticky top-0 shrink-0">
      
      {/* Banner de impersonación — visible cuando el Super Admin está dentro de una empresa */}
      {isImpersonating && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3">
          <div className="flex items-start gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-black text-amber-500 uppercase tracking-wide">Modo Soporte</p>
              <p className="text-xs text-amber-400/80 truncate font-medium">
                Viendo: <strong className="text-amber-300">{user.impersonatedTenantName}</strong>
              </p>
              <p className="text-xs text-amber-400/60 truncate">Como: {user.email}</p>
            </div>
          </div>
          <button
            onClick={handleEndImpersonation}
            disabled={endingImpersonation}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition-all disabled:opacity-60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {endingImpersonation ? 'Saliendo...' : 'Regresar al Super Admin'}
          </button>
        </div>
      )}

      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Calendar className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">ZyncAdmin</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
        {baseItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
              item.active 
                ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20' 
                : 'text-slate-500 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'group-hover:text-purple-500 transition-colors'}`} />
              <span className="font-semibold text-sm">{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-200 dark:border-white/5">
        {!isImpersonating && (
          <button 
            onClick={() => logoutAction(locale)}
            className="flex items-center gap-3 px-4 py-3 w-full text-rose-500 font-semibold hover:bg-rose-500/5 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Salir
          </button>
        )}
      </div>
    </aside>
  );
}
