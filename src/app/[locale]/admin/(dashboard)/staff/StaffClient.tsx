"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  User, 
  Mail, 
  MoreVertical,
  Trash2,
  Edit2,
  X,
  ChevronRight
} from 'lucide-react';
import { createStaffAction, updateStaffAction, deleteStaffAction } from "@/app/actions/staff";
import { useRouter } from "next/navigation";

export default function StaffClient({ 
  initialStaff,
  branches,
  tenantId 
}: { 
  initialStaff: any[],
  branches: any[],
  tenantId: string 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branchId: branches[0]?.id || ""
  });

  const filteredStaff = initialStaff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (member?: any) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email || "",
        branchId: member.branchId
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: "",
        email: "",
        branchId: branches[0]?.id || ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let result;
    if (editingMember) {
      result = await updateStaffAction({
        id: editingMember.id,
        tenantId,
        ...formData
      });
    } else {
      result = await createStaffAction({
        tenantId,
        ...formData
      });
    }

    if (result.success) {
      setIsModalOpen(false);
      router.refresh();
    } else {
      alert("Error al guardar el miembro del equipo");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar a este miembro del equipo?")) return;
    
    const result = await deleteStaffAction(id, tenantId);
    if (result.success) {
      router.refresh();
    } else {
      alert("Error al eliminar el miembro del equipo");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Staff / Equipo</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Gestiona a los profesionales que atienden en tu negocio.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-purple-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Añadir Miembro
        </button>
      </div>

      {/* Grid Layout for Staff */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button onClick={() => handleOpenModal(member)} className="p-2 text-slate-400 hover:text-purple-600">
                    <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-1">
                <div className="w-full h-full rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                    <User className="w-12 h-12 text-slate-300" />
                    <div className="absolute bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur-sm py-1">
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter">Verified</span>
                    </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{member.name}</h3>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1">Profesional</p>
              </div>

              <div className="w-full pt-6 space-y-3">
                <div className="flex items-center gap-3 text-slate-500 dark:text-zinc-500 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-medium truncate">{member.email || 'Sin email'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-xl font-bold">{editingMember ? 'Editar Miembro' : 'Añadir Miembro'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Nombre Completo</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
                  placeholder="Ej: Ana Gomez"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
                  placeholder="ana@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Sucursal Principal</label>
                <select 
                  required
                  value={formData.branchId}
                  onChange={e => setFormData({...formData, branchId: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
                >
                  <option value="">Selecciona una sucursal</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                ) : (
                  editingMember ? 'Guardar Cambios' : 'Añadir Miembro'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
