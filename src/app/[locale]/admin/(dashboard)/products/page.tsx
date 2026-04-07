import { Package } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center text-purple-600">
        <Package className="w-10 h-10" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Productos</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-2 font-medium">Esta sección estará disponible próximamente.</p>
      </div>
      <div className="px-6 py-3 bg-purple-600/10 text-purple-600 rounded-2xl text-xs font-bold border border-purple-600/20">
        Módulo en Desarrollo
      </div>
    </div>
  );
}
