"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Home, 
  MoreVertical,
  Trash2,
  Edit2,
  X,
  Clock
} from 'lucide-react';
import { createBranchAction, updateBranchAction, deleteBranchAction } from "@/app/actions/branches";
import { useRouter } from "next/navigation";

export default function BranchesClient({ 
  initialBranches,
  tenantId 
}: { 
  initialBranches: any[],
  tenantId: string 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    businessHours: ""
  });

  const filteredBranches = initialBranches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.address && b.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (branch?: any) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address || "",
        phone: branch.phone || "",
        businessHours: branch.businessHours || ""
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: "",
        address: "",
        phone: "",
        businessHours: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let result;
    if (editingBranch) {
      result = await updateBranchAction({
        id: editingBranch.id,
        tenantId,
        ...formData
      });
    } else {
      result = await createBranchAction({
        tenantId,
        ...formData
      });
    }

    if (result.success) {
      setIsModalOpen(false);
      router.refresh();
    } else {
      alert("Error al guardar la sucursal");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar la sucursal "${name}"?`)) return;
    
    const result = await deleteBranchAction(id, tenantId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Error al eliminar la sucursal");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Sucursales</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Administra las ubicaciones físicas de tu negocio.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-purple-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nueva Sucursal
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o dirección..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <div 
            key={branch.id} 
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(branch)}
                  className="p-2 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-purple-600 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(branch.id, branch.name)}
                  className="p-2 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{branch.name}</h3>
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">ID: {branch.id.slice(0, 8)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Home className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <p className="text-sm text-slate-600 dark:text-zinc-400">
                  {branch.address || "Sin dirección registrada"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <p className="text-sm text-slate-600 dark:text-zinc-400">
                  {branch.phone || "Sin teléfono registrado"}
                </p>
              </div>
              {branch.businessHours && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="text-xs text-slate-500 dark:text-zinc-500 italic truncate">
                    {branch.businessHours}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {initialBranches.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-black/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/5">
          <MapPin className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No hay sucursales aún</h3>
          <p className="text-slate-500 dark:text-zinc-500 max-w-xs mx-auto mt-2">Agrega la primera sucursal de tu negocio para empezar a recibir citas.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-xl font-bold">{editingBranch ? 'Editar Sucursal' : 'Nueva Sucursal'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-widest">Nombre de la Sucursal</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                  placeholder="Ej: Sucursal Zona Rosa"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-widest">Dirección</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                  placeholder="Dirección completa"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-widest">Teléfono</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                    placeholder="Ej: +503 2222-2222"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-widest">Horarios</label>
                  <input 
                    type="text" 
                    value={formData.businessHours}
                    onChange={e => setFormData({...formData, businessHours: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                    placeholder="Ej: Lun-Vie 8am a 6pm"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    {editingBranch ? 'Guardar Cambios' : 'Crear Sucursal'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
