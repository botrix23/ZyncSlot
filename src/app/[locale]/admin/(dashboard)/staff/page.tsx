import React from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Mail, 
  Phone, 
  Star,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

import { db } from '@/db';
import { staff as staffTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth-session';
import { redirect } from 'next/navigation';

export default async function StaffPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Filtrado multitenant estricto
  const dbStaff = session.role === 'SUPER_ADMIN'
    ? await db.select().from(staffTable)
    : await db.select().from(staffTable).where(eq(staffTable.tenantId, session.tenantId!));

  const displayStaff = dbStaff.map((s: any) => ({
    id: s.id,
    name: s.name,
    role: 'Profesional',
    rating: '5.0',
    email: s.email || 'sin-email@zyncslot.com'
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Staff / Equipo</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Gestiona a los profesionales que atienden en tu negocio.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-purple-500/20 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Añadir Miembro
        </button>
      </div>

      {/* Grid Layout for Staff */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {displayStaff.map((member) => (
          <div key={member.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-purple-600">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-1">
                <div className="w-full h-full rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                    <User className="w-12 h-12 text-slate-300" />
                    {/* Role Overlay */}
                    <div className="absolute bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur-sm py-1">
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter">Verified</span>
                    </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{member.name}</h3>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1">{member.role}</p>
              </div>

              <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-xs font-black text-amber-600">{member.rating}</span>
                <span className="text-[10px] text-zinc-500 ml-1">(120+)</span>
              </div>

              <div className="w-full pt-6 space-y-3">
                <div className="flex items-center gap-3 text-slate-500 dark:text-zinc-500 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-medium truncate">{member.email}</span>
                </div>
                <button className="w-full py-3 bg-slate-100 dark:bg-zinc-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-zinc-300 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                    Editar Perfil
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
