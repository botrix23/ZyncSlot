import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import { 
  ShieldCheck, 
  Database, 
  Activity, 
  Server, 
  Terminal,
  Cpu,
  Lock,
  Zap,
  HardDrive
} from 'lucide-react';

export default async function TechnicalSettingsPage({ params }: { params: { locale: string } }) {
  const session = await getSession();
  const locale = params.locale || 'es';

  // Protección de Ruta: Solo Super Admin
  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect(`/${locale}/admin`); // Redirigir a dashboard normal si no es super admin
  }

  const systemMetrics = [
    { label: 'Estado de Base de Datos', value: 'Conectado (Postgres)', status: 'online', icon: Database },
    { label: 'Uso de CPU', value: '12%', status: 'optimal', icon: Cpu },
    { label: 'Memoria RAM', value: '1.2 GB / 2 GB', status: 'optimal', icon: HardDrive },
    { label: 'Latencia Promedio', value: '45ms', status: 'optimal', icon: Zap },
  ];

  const recentLogs = [
    { id: 1, type: 'INFO', msg: 'Tenant "ZyncSalon" actualizado correctamente.', time: 'Hace 5 min' },
    { id: 2, type: 'AUTH', msg: 'Login exitoso Super Admin desde 192.168.1.1', time: 'Hace 12 min' },
    { id: 3, type: 'DB', msg: 'Backup automático completado exitosamente.', time: 'Hace 1 hora' },
    { id: 4, type: 'WARN', msg: 'Intento fallido de login en sucursal Norte.', time: 'Hace 2 horas' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-600/10 p-2 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-[10px] font-black uppercase tracking-widest text-purple-600">Área Restringida</h1>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Configuración del Sistema</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Gestión técnica y herramientas de infraestructura global.</p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Modo Seguro Activo</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500">
                        <metric.icon className="w-5 h-5" />
                    </div>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${metric.status === 'online' || metric.status === 'optimal' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                </div>
                <h3 className="text-slate-500 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">{metric.label}</h3>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{metric.value}</p>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Terminal / Logs UI */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logs de Infraestructura</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
            </div>
            <div className="p-6 font-mono text-[13px] space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {recentBookingsLogs(recentLogs)}
            </div>
        </div>

        {/* Global Settings */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Controles Globales</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent">
                        <div>
                            <p className="font-bold text-sm">Modo Mantenimiento</p>
                            <p className="text-[10px] text-zinc-500">Bloquear acceso a clientes</p>
                        </div>
                        <div className="w-12 h-6 bg-slate-300 dark:bg-zinc-700 rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent">
                        <div>
                            <p className="font-bold text-sm">Registros Abiertos</p>
                            <p className="text-[10px] text-zinc-500">Permitir nuevos negocios</p>
                        </div>
                        <div className="w-12 h-6 bg-purple-600 rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-8 py-3 bg-slate-900 dark:bg-white dark:text-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
                    Guardar Cambios Globales
                </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-purple-500/20">
                <Activity className="w-8 h-8 mb-4 opacity-50" />
                <h3 className="text-lg font-bold">Resumen de Tráfico</h3>
                <p className="text-purple-100 text-sm mt-2">Carga actual del sistema estable. No se requieren acciones.</p>
                <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-black">99.9%</p>
                        <p className="text-[10px] uppercase font-bold opacity-60 mt-1">Uptime 30 días</p>
                    </div>
                    < Zap className="w-8 h-8 text-amber-300" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function recentBookingsLogs(logs: any[]) {
    return logs.map((log) => (
        <div key={log.id} className="flex gap-4 group">
            <span className="text-slate-600 shrink-0 select-none">[{new Date().toLocaleTimeString()}]</span>
            <span className={`font-bold shrink-0 ${
                log.type === 'WARN' ? 'text-rose-400' : 
                log.type === 'AUTH' ? 'text-purple-400' : 
                log.type === 'DB' ? 'text-blue-400' : 'text-emerald-400'
            }`}>{log.type}</span>
            <span className="text-slate-300 group-hover:text-white transition-colors">{log.msg}</span>
            <span className="ml-auto text-slate-600 italic text-[11px] shrink-0">{log.time}</span>
        </div>
    ));
}
