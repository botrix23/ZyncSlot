"use client";

import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ChevronRight, 
  ShieldCheck, 
  UserCircle, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LangToggle } from '@/components/LangToggle';
import { useTranslations } from 'next-intl';

import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const t = useTranslations('Login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const locale = window.location.pathname.split('/')[1];
    const result = await loginAction(formData, locale);

    if (result.success) {
      window.location.href = `/${locale}/admin`;
    } else {
      setError("Credenciales inválidas. Prueba con admin@zyncslot.com / admin123");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        {/* Toggles */}
        <div className="absolute top-8 right-8 flex gap-2">
            <ThemeToggle />
            <LangToggle />
        </div>

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl shadow-xl shadow-purple-500/20 mb-4 animate-bounce-slow">
            <Calendar className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">ZyncAdmin</h1>
          <p className="text-slate-500 dark:text-zinc-500 font-medium mt-2">Gestión de Reservas Premium</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl shadow-purple-500/5 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('title')}</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest ml-1">{t('emailLabel')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')} 
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-purple-500/50 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest ml-1">{t('passwordLabel')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordPlaceholder')} 
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-purple-500/50 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800/50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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

        <div className="mt-8 text-center space-y-4">
            <p className="text-slate-500 dark:text-zinc-500 text-sm">
            {t('forgotPassword')} <button className="text-purple-600 font-bold hover:underline">{t('recover')}</button>
            </p>
            <p className="text-slate-500 dark:text-zinc-500 text-sm">
            {t('noAccount')} <a href={`/${window.location.pathname.split('/')[1]}/admin/register`} className="text-purple-600 font-bold hover:underline cursor-pointer">{t('register')}</a>
            </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 3;
        }
      `}</style>
    </div>
  );
}
