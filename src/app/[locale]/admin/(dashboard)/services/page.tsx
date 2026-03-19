import React from 'react';
import { 
  Plus, 
  Search, 
  Scissors, 
  Clock, 
  DollarSign, 
  MoreVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';

import { db } from '@/db';
import { services as servicesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth-session';
import { redirect } from 'next/navigation';

export default async function ServicesPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  // Aislamiento de datos: Filtrar estrictamente por tenantId para ADMIN
  const dbServices = session.role === 'SUPER_ADMIN'
    ? await db.select().from(servicesTable)
    : await db.select().from(servicesTable).where(eq(servicesTable.tenantId, session.tenantId!));

  // Mapear para la UI con tipos seguros
  const displayServices = dbServices.map((s: any) => ({
    id: s.id,
    name: s.name,
    duration: `${s.durationMinutes} min`,
    price: `$${s.price}`,
    status: 'Activo'
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Servicios</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Gestiona el catálogo de servicios ofrecidos a tus clientes.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-purple-500/20 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Nuevo Servicio
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <select className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-sm text-slate-600 dark:text-zinc-300 outline-none focus:border-purple-500/50 transition-all cursor-pointer shadow-sm">
          <option>Todos los estados</option>
          <option>Activos</option>
          <option>Inactivos</option>
        </select>
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Servicio</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Duración</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Precio</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-600 dark:text-zinc-300">
            {displayServices.map((service) => (
              <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600">
                      <Scissors className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{service.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>{service.price.replace('$', '')}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    service.status === 'Activo' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'
                  }`}>
                    {service.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
