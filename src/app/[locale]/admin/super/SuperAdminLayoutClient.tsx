"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Users, BarChart2, FileText, LogOut, CreditCard, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/es/admin/super', label: 'Dashboard', icon: BarChart2 },
  { href: '/es/admin/super/tenants', label: 'Empresas', icon: Users },
  { href: '/es/admin/super/payments', label: 'Pagos Wompi', icon: CreditCard },
  { href: '/es/admin/super/logs', label: 'Logs de Auditoría', icon: FileText },
];

export function SuperAdminLayoutClient({ children, email }: { children: React.ReactNode; email: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <span className="font-black text-lg tracking-tight">Zyncrox</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">Super Admin</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
              pathname === href || (href !== '/es/admin/super' && pathname.startsWith(href))
                ? 'bg-purple-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/5 pt-4 mt-4">
        <p className="text-xs text-zinc-500 mb-1">Sesión activa</p>
        <p className="text-sm font-semibold text-white truncate">{email}</p>
        <form action="/es/admin/login">
          <button type="submit" className="mt-3 flex items-center gap-2 text-xs text-zinc-500 hover:text-rose-400 transition-colors">
            <LogOut className="w-3 h-3" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-white/5 flex flex-col p-6 z-40 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <aside className="w-64 bg-black/40 border-r border-white/5 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-4 border-b border-white/5 bg-black/40 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-sm">Super Admin</span>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
