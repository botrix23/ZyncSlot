"use client";

import React, { useState } from 'react';
import { 
  Building, 
  User, 
  Mail, 
  Lock, 
  ChevronRight, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LangToggle } from '@/components/LangToggle';
import { useTranslations } from 'next-intl';
import { registerTenantAction } from '@/app/actions/auth';

export default function RegisterPage() {
  const t = useTranslations('Register');
  const [businessName, setBusinessName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("businessName", businessName);
    formData.append("adminName", adminName);
    formData.append("email", email);
    formData.append("password", password);

    const locale = window.location.pathname.split('/')[1];
    const result = await registerTenantAction(formData, locale);

    if (result.success) {
      window.location.href = `/${locale}/admin`;
    } else {
      setError(result.error || "Error al registrar");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-lg">
        <div className="absolute top-8 right-8 flex gap-2">
            <ThemeToggle />
            <LangToggle />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl shadow-xl shadow-purple-500/20 mb-4">
            <Calendar className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">ZyncSlot</h1>
          <p className="text-slate-500 dark:text-zinc-500 font-medium mt-2">La nueva era de las reservas</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('title')}</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest ml-1">{t('businessName')}</label>
                <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                    type="text" 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="ej. Salon Imperial" 
                    className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-purple-500/50 rounded-2xl py-3 pl-11 pr-4 text-slate-900 dark:text-white outline-none transition-all text-sm"
                    required
                    />
                </div>
                </div>

                <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest ml-1">{t('adminName')}</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                    type="text" 
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Tu nombre" 
                    className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-purple-500/50 rounded-2xl py-3 pl-11 pr-4 text-slate-900 dark:text-white outline-none transition-all text-sm"
                    required
                    />
                </div>
                </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest ml-1">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@negocio.com" 
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-purple-500/50 rounded-2xl py-3 pl-11 pr-4 text-slate-900 dark:text-white outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest ml-1">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-purple-500/50 rounded-2xl py-3 pl-11 pr-4 text-slate-900 dark:text-white outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800/50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-600/20 transition-all mt-4"
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        {t('submit')}
                        <ChevronRight className="w-5 h-5" />
                    </>
                )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-500 dark:text-zinc-500 text-sm">
          {t('hasAccount')} <button onClick={() => window.location.href=`/${window.location.pathname.split('/')[1]}/admin/login`} className="text-purple-600 font-bold hover:underline">{t('login')}</button>
        </p>
      </div>
    </div>
  );
}
