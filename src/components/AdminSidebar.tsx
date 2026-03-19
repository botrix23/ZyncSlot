"use client";

import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  Users, 
  Scissors, 
  Package, 
  LogOut,
  Terminal
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { SessionUser } from '@/lib/auth-session';

export function AdminSidebar({ user, locale }: { user: SessionUser | null, locale: string }) {
  const pathname = usePathname();
  
  const baseItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: `/${locale}/admin`, active: pathname === `/${locale}/admin` },
    { name: 'Citas', icon: Calendar, href: `/${locale}/admin/bookings` },
    { name: 'Servicios', icon: Scissors, href: `/${locale}/admin/services` },
    { name: 'Staff / Equipo', icon: Users, href: `/${locale}/admin/staff` },
    { name: 'Productos', icon: Package, href: `/${locale}/admin/products` },
    { name: 'Configuración', icon: Settings, href: `/${locale}/admin/settings` },
  ];

  // Módulo exclusivo para Super Admin
  const techItems = user?.role === 'SUPER_ADMIN' ? [
    { name: 'Configuración Técnica', icon: Terminal, href: `/${locale}/admin/settings/technical`, active: pathname.includes('/technical') }
  ] : [];

  const menuItems = [...baseItems, ...techItems];

  return (
    <aside className="w-72 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-white/5 hidden lg:flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Calendar className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">ZyncAdmin</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
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
        <button 
          onClick={() => logoutAction(locale)}
          className="flex items-center gap-3 px-4 py-3 w-full text-rose-500 font-semibold hover:bg-rose-500/5 rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Salir
        </button>
      </div>
    </aside>
  );
}
