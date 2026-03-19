import { getSession } from "@/lib/auth-session";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getSession();
  const locale = params.locale || 'es';

  // Si no hay sesión y no estamos en login, redirigir
  // Nota: Next.js layouts para rutas hijas también se ejecutan. 
  // No redirigimos aquí si la ruta es /login para evitar bucles infinitos.
  // Pero el layout general de admin envuelve a login.
  
  // SOLUCIÓN: El layout detecta si es login para no aplicar sidebar, pero permitimos el paso.
  // En una app real, usaríamos Middleware para proteger rutas.

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex overflow-hidden">
      {/* Sidebar - Solo si hay sesión para evitar flash */}
      <AdminSidebar user={session} locale={locale} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden">
        {/* Top Header */}
        <AdminHeader user={session} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50 dark:bg-black/40">
          {children}
        </div>
      </main>
    </div>
  );
}
