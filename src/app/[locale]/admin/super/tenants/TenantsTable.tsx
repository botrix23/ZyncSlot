'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllTenantsAction, updateTenantStatusAction, deleteTenantAction, impersonateTenantAction } from '@/app/actions/superAdmin';
import { CheckCircle, Clock, XCircle, Trash2, ShieldCheck, MoreVertical, AlertTriangle } from 'lucide-react';

type Tenant = Awaited<ReturnType<typeof getAllTenantsAction>>[number];

const statusConfig = {
  ACTIVE:    { label: 'Activa',     icon: CheckCircle, color: 'text-emerald-400 bg-emerald-400/10' },
  TRIAL:     { label: 'Trial',      icon: Clock,        color: 'text-amber-400 bg-amber-400/10' },
  SUSPENDED: { label: 'Suspendida', icon: XCircle,      color: 'text-rose-400 bg-rose-400/10' },
};

function DeleteConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-center w-12 h-12 bg-rose-500/10 rounded-2xl mb-4 mx-auto">
          <AlertTriangle className="w-6 h-6 text-rose-400" />
        </div>
        <h3 className="text-lg font-black text-white text-center">¿Eliminar empresa?</h3>
        <p className="text-sm text-zinc-400 text-center mt-2">
          Vas a eliminar permanentemente <span className="font-bold text-white">"{name}"</span> y todos sus datos. Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TenantsTable({ tenants: initialTenants }: { tenants: Tenant[] }) {
  const [tenants, setTenants] = useState(initialTenants);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    if (!openMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setMenuPos(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  // Calcular posición del dropdown usando el bounding rect del botón
  const handleOpenMenu = useCallback((e: React.MouseEvent<HTMLButtonElement>, tenantId: string) => {
    if (openMenu === tenantId) {
      setOpenMenu(null);
      setMenuPos(null);
      return;
    }
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    setMenuPos({ 
      top: rect.bottom + window.scrollY + 4, 
      left: rect.right - 176, // 176 = w-44 (11rem)
    });
    setOpenMenu(tenantId);
  }, [openMenu]);

  const handleStatus = async (id: string, status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL') => {
    setLoadingId(id);
    setOpenMenu(null);
    setMenuPos(null);
    await updateTenantStatusAction(id, status);
    setLoadingId(null);
    // Actualizar localmente sin full-reload
    setTenants(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleDelete = (id: string, name: string) => {
    setOpenMenu(null);
    setMenuPos(null);
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setLoadingId(deleteTarget.id);
    setDeleteTarget(null);
    await deleteTenantAction(deleteTarget.id);
    setTenants(prev => prev.filter(t => t.id !== deleteTarget.id));
    setLoadingId(null);
  };

  const handleImpersonate = async (id: string) => {
    setLoadingId(id);
    const res = await impersonateTenantAction(id);
    if (res.success) {
      const locale = window.location.pathname.split('/')[1] || 'es';
      window.location.href = `/${locale}/admin`;
    } else {
      alert(res.error);
      setLoadingId(null);
    }
  };

  return (
    <>
      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 border-b border-white/5 bg-black/20">
                <th className="text-left px-6 py-4 font-semibold">Empresa</th>
                <th className="text-left px-6 py-4 font-semibold">Slug / URL</th>
                <th className="text-center px-6 py-4 font-semibold">Estado</th>
                <th className="text-center px-6 py-4 font-semibold">Plan</th>
                <th className="text-center px-6 py-4 font-semibold">Reservas</th>
                <th className="text-center px-6 py-4 font-semibold">Trial</th>
                <th className="text-center px-6 py-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(tenant => {
                const cfg = statusConfig[tenant.status as keyof typeof statusConfig] || statusConfig.SUSPENDED;
                const isLoading = loadingId === tenant.id;
                return (
                  <tr key={tenant.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{tenant.name}</p>
                      <p className="text-xs text-zinc-500">{tenant.adminCount} admin(s) · {tenant.branchCount} sucursal(es)</p>
                      {tenant.users?.find(u => u.role === 'ADMIN')?.email && (
                        <p className="text-xs text-purple-400 mt-0.5">{tenant.users.find(u => u.role === 'ADMIN')?.email}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg">{tenant.slug}</code>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
                        <cfg.icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-full">{tenant.plan}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-white">{tenant.bookingCount}</td>
                    <td className="px-6 py-4 text-center">
                      {tenant.daysLeft !== null ? (
                        <span className={`font-bold text-sm ${tenant.daysLeft < 3 ? 'text-rose-400' : tenant.daysLeft < 7 ? 'text-amber-400' : 'text-zinc-300'}`}>
                          {tenant.daysLeft}d
                        </span>
                      ) : <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Acceder como soporte */}
                        <button
                          onClick={() => handleImpersonate(tenant.id)}
                          disabled={isLoading}
                          title="Acceder como soporte (mantiene tu sesión Super Admin)"
                          className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                          ) : (
                            <ShieldCheck className="w-4 h-4" />
                          )}
                        </button>

                        {/* Botón de estado — dropdown con posición fixed */}
                        <button
                          onClick={(e) => handleOpenMenu(e, tenant.id)}
                          disabled={isLoading}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 ${openMenu === tenant.id ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dropdown con posición fixed — escapa completamente del overflow del padre */}
      {openMenu && menuPos && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
          className="w-44 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {tenants.find(t => t.id === openMenu)?.status !== 'ACTIVE' && (
            <button onClick={() => handleStatus(openMenu, 'ACTIVE')} className="w-full text-left px-4 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5" /> Activar
            </button>
          )}
          {tenants.find(t => t.id === openMenu)?.status !== 'SUSPENDED' && (
            <button onClick={() => handleStatus(openMenu, 'SUSPENDED')} className="w-full text-left px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5" /> Suspender
            </button>
          )}
          <div className="border-t border-white/5">
            <button
              onClick={() => {
                const t = tenants.find(t => t.id === openMenu);
                if (t) handleDelete(t.id, t.name);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Eliminar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
