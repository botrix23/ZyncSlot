import React from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  User, 
  Clock, 
  Scissors, 
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  AlertCircle
} from 'lucide-react';

import { db } from '@/db';
import { getSession } from '@/lib/auth-session';
import { redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';
import { bookings as bookingsTable } from '@/db/schema';

export default async function BookingsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Aislamiento Multi-tenant
  const dbBookings = await db.query.bookings.findMany({
    where: session.role === 'ADMIN' ? eq(bookingsTable.tenantId, session.tenantId!) : undefined,
    with: {
        service: true,
        staff: true
    },
    orderBy: [desc(bookingsTable.startTime)]
  });

  const displayBookings = dbBookings.map((b: any) => ({
    id: b.id,
    customer: b.customerName,
    service: b.service?.name || 'Servicio eliminado',
    date: new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(b.startTime)),
    time: new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(b.startTime)),
    status: b.status === 'CONFIRMED' ? 'Confirmada' : (b.status === 'PENDING' ? 'Pendiente' : 'Cancelada'),
    staff: b.staff?.name || 'Personal eliminado'
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Citas / Reservas</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Control de agenda y seguimiento de clientes.</p>
        </div>
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-zinc-300 rounded-2xl text-sm font-bold shadow-sm transition-all active:scale-95">
                <Filter className="w-4 h-4" />
                Filtrar
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-purple-500/20 transition-all active:scale-95">
                <Calendar className="w-5 h-5" />
                Agendar Cita
            </button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-4 overflow-x-auto custom-scrollbar no-scrollbar">
        {['Todas', 'Pendientes', 'Confirmadas', 'Finalizadas', 'Canceladas'].map((tab, i) => (
            <button key={tab} className={`text-sm font-bold whitespace-nowrap px-4 py-2 rounded-xl transition-all ${
                i === 0 ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}>
                {tab}
            </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {displayBookings.map((booking: any) => (
            <div key={booking.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm hover:border-purple-500/50 transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-5 lg:w-1/4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                            <User className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-lg">{booking.customer}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                                    booking.status === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-500' :
                                    booking.status === 'En Proceso' ? 'bg-blue-500/10 text-blue-500' :
                                    booking.status === 'Cancelada' ? 'bg-rose-500/10 text-rose-500' : 'bg-orange-500/10 text-orange-500'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-8 flex-1">
                        <div className="space-y-1 min-w-[120px]">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Servicio</p>
                            <div className="flex items-center gap-2">
                                <Scissors className="w-4 h-4 text-purple-500" />
                                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{booking.service}</span>
                            </div>
                        </div>
                        <div className="space-y-1 min-w-[120px]">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha y Hora</p>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{booking.date} · {booking.time}</span>
                            </div>
                        </div>
                        <div className="space-y-1 min-w-[120px]">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atendido por</p>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-600 font-bold">
                                    {booking.staff.charAt(0)}
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{booking.staff}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex-1 lg:flex-none px-6 py-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                            Detalles
                        </button>
                        <button className="p-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl text-slate-400 transition-all">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
