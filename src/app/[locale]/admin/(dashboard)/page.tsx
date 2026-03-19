import React from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Settings, 
  ChevronRight,
  Plus,
  MoreVertical,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Reservas Hoy', value: '12', icon: Calendar, trend: '+20%', color: 'from-purple-600 to-indigo-600' },
    { label: 'Clientes Nuevos', value: '45', icon: Users, trend: '+12%', color: 'from-blue-600 to-cyan-600' },
    { label: 'Ingresos Mes', value: '$3,450', icon: TrendingUp, trend: '+8.5%', color: 'from-emerald-600 to-teal-600' },
    { label: 'Ocupación', value: '85%', icon: Clock, trend: '+5%', color: 'from-orange-600 to-amber-600' },
  ];

  const recentBookings = [
    { id: 1, customer: 'Roberto Menjívar', service: 'Corte Premium', time: '10:30 AM', status: 'Confirmada', avatar: 'RM' },
    { id: 2, customer: 'Lucía Fernández', service: 'Manicura Luxury', time: '11:45 AM', status: 'En Proceso', avatar: 'LF' },
    { id: 3, customer: 'Eduardo Paz', service: 'Matizado Olaplex', time: '01:00 PM', status: 'Pendiente', avatar: 'EP' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Admin</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Bienvenido de nuevo. Aquí tienes un resumen de tu negocio hoy.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
            <Activity className="w-4 h-4" />
            Reportes
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/25 transition-all">
            <Plus className="w-4 h-4" />
            Nueva Cita
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="group relative bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-purple-500/5">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-slate-500 dark:text-zinc-400 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-3xl p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Citas Recientes</h2>
            <button className="text-purple-500 hover:text-purple-400 text-sm font-semibold flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold">
                    {booking.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{booking.customer}</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">{booking.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{booking.time}</p>
                    <p className={`text-[10px] font-bold uppercase mt-1 ${
                      booking.status === 'Confirmada' ? 'text-emerald-500' : 
                      booking.status === 'En Proceso' ? 'text-blue-500' : 'text-orange-500'
                    }`}>
                      {booking.status}
                    </p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Settings Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-purple-500/20">
          <Settings className="absolute -right-8 -top-8 w-48 h-48 opacity-10 rotate-12" />
          <h2 className="text-xl font-bold relative z-10">Configuración Rápida</h2>
          <p className="text-purple-200 text-sm mt-2 relative z-10 mb-8">Personaliza tu widget de reserva y horarios de atención al instante.</p>
          
          <div className="space-y-4 relative z-10">
            <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-between transition-all group backdrop-blur-md border border-white/10">
              <span className="font-semibold">Editar Servicios</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-between transition-all group backdrop-blur-md border border-white/10">
              <span className="font-semibold">Horarios de Sucursal</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-between transition-all group backdrop-blur-md border border-white/10">
              <span className="font-semibold">Personalizar Marca</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-12 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
            <p className="text-xs text-purple-300">Tu cuenta Premium vence en 24 días</p>
            <button className="mt-2 text-sm font-bold text-white underline">Renovar ahora</button>
          </div>
        </div>
      </div>
    </div>
  );
}
