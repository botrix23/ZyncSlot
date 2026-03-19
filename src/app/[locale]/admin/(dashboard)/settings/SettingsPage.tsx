"use client";

import { useState } from "react";
import { 
  Settings, 
  Truck, 
  Save, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { updateTenantSettingsAction } from "@/app/actions/tenant";
import { useRouter } from "next/navigation";

export default function SettingsPage({ 
  tenant 
}: { 
  tenant: { 
    id: string; 
    name: string; 
    logoUrl?: string | null;
    homeServiceTerms: string | null; 
    homeServiceTermsEnabled: boolean; 
  } 
}) {
  const [name, setName] = useState(tenant.name);
  const [logoUrl, setLogoUrl] = useState(tenant.logoUrl || "");
  const [homeServiceTerms, setHomeServiceTerms] = useState(tenant.homeServiceTerms || "");
  const [homeServiceTermsEnabled, setHomeServiceTermsEnabled] = useState(tenant.homeServiceTermsEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);
    
    const result = await updateTenantSettingsAction({
      tenantId: tenant.id,
      name,
      logoUrl,
      homeServiceTerms,
      homeServiceTermsEnabled
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Configuración guardada correctamente.' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: 'Error al guardar la configuración.' });
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Configuración del Negocio</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-1">Personaliza el comportamiento de tu plataforma ZyncSlot.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-bold text-sm">{message.text}</p>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm space-y-8">
        {/* Sección: Identidad de Marca */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Settings className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold">Identidad de Marca</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300">Nombre del Negocio</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: ZyncSalón Spa"
                className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300">URL del Logo</label>
              <input 
                type="text" 
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://ejemplo.com/logo.png"
                className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sección: Servicio a Domicilio */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Truck className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold">Servicio a Domicilio</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent">
              <div>
                <p className="font-bold text-sm">Activar Términos y Condiciones</p>
                <p className="text-[10px] text-zinc-500">Muestra un aviso legal obligatorio antes de confirmar la cita</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={homeServiceTermsEnabled} 
                  onChange={(e) => setHomeServiceTermsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className={`space-y-2 transition-all duration-500 ${homeServiceTermsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300">Mensaje de Términos</label>
              <textarea 
                value={homeServiceTerms}
                onChange={(e) => setHomeServiceTerms(e.target.value)}
                placeholder="Escribe aquí los términos que se mostrarán en el widget de reservas..."
                className="w-full min-h-[150px] p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all resize-none text-sm"
              />
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 bg-slate-100 dark:bg-white/5 p-3 rounded-xl">
                 <Info className="w-4 h-4 text-purple-500" />
                 Este texto aparecerá en el último paso cuando el cliente elija "Servicio a Domicilio".
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 dark:bg-white dark:text-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
