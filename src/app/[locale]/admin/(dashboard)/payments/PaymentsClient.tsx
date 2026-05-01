"use client";

import { useState } from "react";
import {
  CreditCard,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FlaskConical,
  Zap,
  ExternalLink,
  ShieldCheck,
  Building2,
} from "lucide-react";
import {
  saveWompiCredentialsAction,
  testWompiCredentialsAction,
} from "@/app/actions/wompi";

interface Tenant {
  id: string;
  wompiAppId: string | null;
  wompiApiSecret: string | null;
  wompiIsProduction: boolean;
}

interface TestResult {
  success: boolean;
  accountName?: string;
  email?: string;
  businesses?: { id: string; name: string; isProduction: boolean }[];
  error?: string;
}

export default function PaymentsClient({ tenant }: { tenant: Tenant }) {
  const [appId, setAppId] = useState(tenant.wompiAppId ?? "");
  const [apiSecret, setApiSecret] = useState(tenant.wompiApiSecret ?? "");
  const [isProduction, setIsProduction] = useState(tenant.wompiIsProduction);
  const [showSecret, setShowSecret] = useState(false);

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const isConfigured = !!(tenant.wompiAppId && tenant.wompiApiSecret);

  // ── Test connection ────────────────────────────────────────────────────────
  async function handleTest() {
    if (!appId || !apiSecret) return;
    setTesting(true);
    setTestResult(null);
    const result = await testWompiCredentialsAction({
      wompiAppId: appId,
      wompiApiSecret: apiSecret,
      wompiIsProduction: isProduction,
    });
    setTestResult(result);
    setTesting(false);
  }

  // ── Save credentials ────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    setSaveResult(null);
    const result = await saveWompiCredentialsAction({
      tenantId: tenant.id,
      wompiAppId: appId,
      wompiApiSecret: apiSecret,
      wompiIsProduction: isProduction,
    });
    setSaveResult(result);
    setSaving(false);
    if (result.success) {
      setTimeout(() => setSaveResult(null), 4000);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Pagos con tarjeta
          </h1>
        </div>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1 ml-13">
          Conecta tu cuenta de{" "}
          <a
            href="https://wompi.sv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline inline-flex items-center gap-1"
          >
            Wompi El Salvador <ExternalLink className="w-3 h-3" />
          </a>{" "}
          para aceptar pagos con tarjeta de crédito y débito desde tu portal.
        </p>
      </div>

      {/* Status banner */}
      {isConfigured ? (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Wompi conectado
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              Modo:{" "}
              <span className="font-bold">
                {tenant.wompiIsProduction ? "Producción" : "Pruebas"}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Aún no has configurado tus credenciales de Wompi.
          </p>
        </div>
      )}

      {/* Credentials form */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wide">
            Credenciales de tu cuenta Wompi
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-zinc-500">
          Obtén tu App ID y API Secret desde el{" "}
          <a
            href="https://panel.wompi.sv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline"
          >
            panel de Wompi
          </a>{" "}
          → Configuraciones generales → tu negocio.
        </p>

        {/* Environment toggle */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
          <button
            type="button"
            onClick={() => setIsProduction(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              !isProduction
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Pruebas (Sandbox)
          </button>
          <button
            type="button"
            onClick={() => setIsProduction(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              isProduction
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            <Zap className="w-4 h-4" />
            Producción
          </button>
        </div>

        {/* App ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">
            App ID
          </label>
          <input
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            placeholder="Ej: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* API Secret */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">
            API Secret
          </label>
          <div className="relative">
            <input
              type={showSecret ? "text" : "password"}
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Tu clave secreta de Wompi"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition"
            >
              {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-600 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Tus credenciales se almacenan de forma segura y nunca se comparten.
          </p>
        </div>

        {/* Test result */}
        {testResult && (
          <div
            className={`p-4 rounded-xl border text-sm ${
              testResult.success
                ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
            }`}
          >
            {testResult.success ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Conexión exitosa
                </div>
                <p className="text-emerald-600 dark:text-emerald-500">
                  Cuenta: <strong>{testResult.accountName}</strong>
                </p>
                <p className="text-emerald-600 dark:text-emerald-500">
                  Email: {testResult.email}
                </p>
                {testResult.businesses && testResult.businesses.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase">Negocios encontrados:</p>
                    {testResult.businesses.map((b) => (
                      <div key={b.id} className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-500">
                        <Building2 className="w-3 h-3" />
                        {b.name} — {b.isProduction ? "Producción" : "Pruebas"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {testResult.error}
              </div>
            )}
          </div>
        )}

        {/* Save result */}
        {saveResult && (
          <div
            className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
              saveResult.success
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            {saveResult.success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Credenciales guardadas correctamente.
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                {saveResult.error}
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleTest}
            disabled={!appId || !apiSecret || testing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FlaskConical className="w-4 h-4" />
            )}
            Probar conexión
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!appId || !apiSecret || saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md shadow-purple-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {saving ? "Guardando..." : "Guardar credenciales"}
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300">
          ¿Cómo obtener tus credenciales?
        </h3>
        <ol className="space-y-2 text-sm text-slate-600 dark:text-zinc-400">
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            Ingresa a{" "}
            <a
              href="https://panel.wompi.sv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              panel.wompi.sv
            </a>{" "}
            con tu cuenta.
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            Ve a <strong>Configuraciones generales</strong> y selecciona tu negocio.
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            Copia el <strong>App ID</strong> y el <strong>API Secret</strong> que aparecen ahí.
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
            Pégalos arriba, prueba la conexión, y guarda. ¡Listo!
          </li>
        </ol>
      </div>
    </div>
  );
}
