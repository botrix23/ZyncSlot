"use client";

import { 
  Bell,
  Search,
  User,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LangToggle } from '@/components/LangToggle';
import { SessionUser } from '@/lib/auth-session';
import { useTranslations } from "next-intl";

export function AdminHeader({ user }: { user: SessionUser | null }) {
  const t = useTranslations('Dashboard.header');
  return (
    <header className="h-20 border-b border-slate-200 dark:border-white/5 px-8 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-xl shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-transparent focus-within:border-purple-500/50 transition-all w-96">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder={t('searchPlaceholder')} 
          className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-slate-500 dark:placeholder:text-zinc-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
          <ThemeToggle />
          <LangToggle />
        </div>
        
        <button className="relative p-2 text-slate-500 dark:text-zinc-400 hover:text-purple-500 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-black"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:border-white/10"></div>
        
        <div className="flex items-center gap-3 group">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                {user?.email.split('@')[0] || 'Admin User'}
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
                {user?.role === 'SUPER_ADMIN' ? (
                    <span className="text-[9px] font-black bg-purple-600 text-white px-1.5 py-0.5 rounded flex items-center gap-1 tracking-tighter shadow-lg shadow-purple-500/20">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        {t('superAdmin')}
                    </span>
                ) : (
                    <span className="text-[9px] font-bold bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-1.5 py-0.5 rounded flex items-center gap-1 tracking-tighter">
                        <UserCircle className="w-2.5 h-2.5" />
                        {t('admin')}
                    </span>
                )}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-white/10 overflow-hidden">
            {user?.role === 'SUPER_ADMIN' ? (
                <ShieldCheck className="text-white w-6 h-6" />
            ) : (
                <User className="text-white w-6 h-6" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
