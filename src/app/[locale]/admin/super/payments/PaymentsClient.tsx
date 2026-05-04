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

interface PlatformConfig {
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

export default function PaymentsClient({ config }: { config: PlatformConfig }) {
  const [appId, setAppId] = useState(config.wompiAppId ?? "");
  const [apiSecret, setApiSecret] = useState(config.wompiApiSecret ?? "");
  const [isProduction, setIsProduction] = useState(config.wompiIsProduction);
  const [showSecret, setShowSecret] = useState(false);

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const isConfigured = !!(config.wompiAppId && config.wompiApiSecret);

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

  // ── Save credentials ───────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    setSaveResult(null);
    const result = await saveWompiCredentialsAction({
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
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Pagos — Wompi</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
              Configuración de plataforma
            </p>
          </div>
        </div>
        <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
          Configura las credenciales de{" "}
          <a
            href="https://wompi.sv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
          >
            Wompi El Salvador <ExternalLink className="w-3 h-3" />
          </a>{" "}
          para recibir pagos de suscripción de las empresas que usen Zyncrox.
          Estas credenciales son globales de la plataforma, no pertenecen a ninguna empresa en particular.
        </p>
      </div>

      {/* Status banner */}
      {isConfigured ? (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-400">
              Credenciales de Wompi guardadas
            </p>
            <p className="text-xs text-emerald-500">
              Modo:{" "}
              <span className="font-bold">
                {config.wompiIsProduction ? "Producción" : "Pruebas (Sandbox)"}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-400">
            Aún no has configurado las credenciales de Wompi para la plataforma.
          </p>
        </div>
      )}

      {/* Credentials form */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wide">
            Credenciales de Wompi
          </h2>
        </div>

        <p className="text-xs text-zinc-500">
          Obtén tu App ID y API Secret desde el{" "}
          <a
            href="https://panel.wompi.sv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300"
          >
            panel de Wompi
          </a>{" "}
          → Configuraciones generales → tu negocio.
        </p>

        {/* Environment toggle */}
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <button
            type="button"
            onClick={() => setIsProduction(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              !isProduction
                ? "bg-purple-600 text-white shadow-md"
                : "text-zinc-400 hover:bg-white/10"
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
                : "text-zinc-400 hover:bg-white/10"
            }`}
          >
            <Zap className="w-4 h-4" />
            Producción
          </button>
        </div>

        {/* App ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
            App ID
          </label>
          <input
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-zinc-900 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* API Secret */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
            API Secret
          </label>
          <div className="relative">
            <input
              type={showSecret ? "text" : "password"}
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Tu clave secreta de Wompi"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-white/10 bg-zinc-900 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition"
            >
              {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-zinc-600 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Las credenciales se almacenan de forma segura en la base de datos.
          </p>
        </div>

        {/* Test result */}
        {testResult && (
          <div
            className={`p-4 rounded-xl border text-sm ${
              testResult.success
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            {testResult.success ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Conexión exitosa
                </div>
                <p className="text-emerald-500">
                  Cuenta: <strong>{testResult.accountName}</strong>
                </p>
                <p className="text-emerald-500">Email: {testResult.email}</p>
                {testResult.businesses && testResult.businesses.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-bold text-emerald-500 uppercase">
                      Negocios encontrados:
                    </p>
                    {testResult.businesses.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center gap-2 text-xs text-emerald-500"
                      >
                        <Building2 className="w-3 h-3" />
                        {b.name} — {b.isProduction ? "Producción" : "Pruebas"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-400">
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
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 text-sm font-semibold hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-zinc-300">
          ¿Cómo obtener tus credenciales?
        </h3>
        <ol className="space-y-2 text-sm text-zinc-400">
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            Ingresa a{" "}
            <a
              href="https://panel.wompi.sv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              panel.wompi.sv
            </a>{" "}
            con tu cuenta.
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            Ve a <strong className="text-zinc-200">Configuraciones generales</strong> y selecciona tu negocio.
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            Copia el <strong className="text-zinc-200">App ID</strong> y el{" "}
            <strong className="text-zinc-200">API Secret</strong> que aparecen ahí.
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            Pégalos arriba, prueba la conexión y guarda. ¡Listo!
          </li>
        </ol>
      </div>
    </div>
  );
}
