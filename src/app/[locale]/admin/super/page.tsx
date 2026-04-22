import { getAllTenantsAction } from '@/app/actions/superAdmin';
import { Users, Building2, TrendingUp, Calendar, ShieldAlert, CheckCircle, Clock, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const statusConfig = {
  ACTIVE:    { label: 'Activa',     icon: CheckCircle, color: 'text-emerald-400 bg-emerald-400/10' },
  TRIAL:     { label: 'Trial',      icon: Clock,        color: 'text-amber-400 bg-amber-400/10' },
  SUSPENDED: { label: 'Suspendida', icon: XCircle,      color: 'text-rose-400 bg-rose-400/10' },
};

export default async function SuperAdminDashboard() {
  const tenants = await getAllTenantsAction();

  const totalBookings = tenants.reduce((a, t) => a + t.bookingCount, 0);
  const activeCount   = tenants.filter(t => t.status === 'ACTIVE').length;
  const trialCount    = tenants.filter(t => t.status === 'TRIAL').length;
  const suspended     = tenants.filter(t => t.status === 'SUSPENDED').length;

  const kpis = [
    { label: 'Empresas Registradas', value: tenants.length, icon: Building2, color: 'from-purple-600 to-indigo-600' },
    { label: 'Activas',              value: activeCount,     icon: CheckCircle, color: 'from-emerald-600 to-teal-600' },
    { label: 'En Trial',             value: trialCount,      icon: Clock,        color: 'from-amber-500 to-orange-600' },
    { label: 'Reservas Totales',     value: totalBookings,   icon: Calendar,     color: 'from-blue-600 to-cyan-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <ShieldAlert className="w-6 h-6 text-purple-400" />
          <h1 className="text-3xl font-black tracking-tight">Panel Super Admin</h1>
        </div>
        <p className="text-zinc-500">Vista global de todas las empresas en Zyncrox.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${kpi.color} mb-4`}>
              <kpi.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-zinc-400 text-sm font-medium">{kpi.label}</p>
            <p className="text-3xl font-black mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Tabla de empresas */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Empresas Registradas</h2>
          <a href="/es/admin/super/tenants" className="text-sm text-purple-400 hover:text-purple-300 font-semibold">
            Ver todas →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 border-b border-white/5">
                <th className="text-left px-6 py-3 font-semibold">Empresa</th>
                <th className="text-left px-6 py-3 font-semibold">Slug</th>
                <th className="text-center px-6 py-3 font-semibold">Estado</th>
                <th className="text-center px-6 py-3 font-semibold">Reservas</th>
                <th className="text-center px-6 py-3 font-semibold">Plan</th>
                <th className="text-center px-6 py-3 font-semibold">Días Trial</th>
              </tr>
            </thead>
            <tbody>
              {tenants.slice(0, 10).map(tenant => {
                const cfg = statusConfig[tenant.status as keyof typeof statusConfig] || statusConfig.SUSPENDED;
                return (
                  <tr key={tenant.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold">{tenant.name}</td>
                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                      <a 
                        href={`/es/${tenant.slug}`} 
                        target="_blank" 
                        className="hover:text-purple-400 transition-colors"
                      >
                        {tenant.slug}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
                        <cfg.icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold">{tenant.bookingCount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-full">{tenant.plan}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {tenant.daysLeft !== null ? (
                        <span className={`font-bold ${tenant.daysLeft < 3 ? 'text-rose-400' : tenant.daysLeft < 7 ? 'text-amber-400' : 'text-zinc-300'}`}>
                          {tenant.daysLeft}d
                        </span>
                      ) : <span className="text-zinc-600">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
