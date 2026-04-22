"use client";

import Link from "next/link";
import { useState } from "react";

const FREE_FEATS = [
  { ok: true,  t: "1 sucursal" },
  { ok: true,  t: "3 empleados" },
  { ok: true,  t: "5 servicios" },
  { ok: true,  t: "Widget básico de reservas" },
  { ok: true,  t: "Email de confirmación" },
  { ok: false, t: "Marca personalizada" },
  { ok: false, t: "Servicio a domicilio" },
];

const PRO_FEATS = [
  { t: "3 sucursales · 15 empleados" },
  { t: "30 servicios" },
  { t: "Múltiples servicios por cita" },
  { t: "Servicios en días distintos" },
  { t: "Servicio a domicilio" },
  { t: "Marca 100% personalizada" },
  { t: "Rotaciones de staff" },
  { t: "Encuestas avanzadas" },
  { t: "Soporte prioritario" },
];

const ENT_FEATS = [
  { t: "Sucursales ilimitadas" },
  { t: "Staff ilimitado · Servicios ilimitados" },
  { t: "Todo lo del plan PRO" },
  { t: "Analytics avanzados" },
  { t: "Soporte dedicado" },
];

const COMPARE_ROWS = [
  { cat: "Límites" },
  { f: "Sucursales",          free: "1",    pro: "3",    ent: "∞" },
  { f: "Empleados",           free: "3",    pro: "15",   ent: "∞" },
  { f: "Servicios",           free: "5",    pro: "30",   ent: "∞" },
  { cat: "Reservas" },
  { f: "Widget de reservas",           free: true,  pro: true,  ent: true },
  { f: "Email de confirmación",        free: true,  pro: true,  ent: true },
  { f: "Múltiples servicios por cita", free: false, pro: true,  ent: true },
  { f: "Servicios en días distintos",  free: false, pro: true,  ent: true },
  { f: "Servicio a domicilio",         free: false, pro: true,  ent: true },
  { cat: "Marca" },
  { f: "Marca personalizada",          free: false, pro: true,  ent: true },
  { f: "URL propia",                   free: false, pro: true,  ent: true },
  { f: "Logo y colores",               free: false, pro: true,  ent: true },
  { cat: "Staff" },
  { f: "Rotaciones automáticas",       free: false, pro: true,  ent: true },
  { f: "Horarios individuales",        free: false, pro: true,  ent: true },
  { cat: "Clientes" },
  { f: "Encuestas post-cita",          free: false, pro: true,  ent: true },
  { f: "Detección clientes VIP",       free: false, pro: true,  ent: true },
  { f: "Analytics avanzados",          free: false, pro: false, ent: true },
  { cat: "Soporte" },
  { f: "Soporte por email",            free: true,  pro: true,  ent: true },
  { f: "Soporte prioritario",          free: false, pro: true,  ent: true },
  { f: "Soporte dedicado",             free: false, pro: false, ent: true },
];

function CmpCell({ v }: { v: boolean | string }) {
  if (v === true) return <span className="text-green-600 font-bold">✓</span>;
  if (v === false) return <span className="text-red-400">✕</span>;
  return <span className="text-slate-500 dark:text-zinc-400">{v}</span>;
}

export function LandingPricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="relative z-10 bg-transparent py-[clamp(72px,9vw,120px)] px-5 lg:px-16" id="precios">
      <div className="max-w-[1120px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[clamp(36px,5vw,52px)]">
          <div className="inline-flex items-center gap-[6px] bg-purple-500/[0.08] border border-purple-500/25 text-purple-300 text-[13px] font-medium px-4 py-[7px] rounded-full mb-[22px]">
            ⏱ 14 días gratis · Todas las funciones · Sin tarjeta de crédito
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,60px)] leading-[1.1] tracking-[-0.4px] text-slate-900 dark:text-white mb-8 transition-colors duration-300">
            Un precio simple.<br />
            <em className="italic text-purple-600">Sin sorpresas.</em>
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center bg-white dark:bg-zinc-900 border border-black/[0.13] dark:border-white/[0.13] rounded-full p-1 transition-colors duration-300">
            <button
              onClick={() => setAnnual(false)}
              className={`text-[13px] font-semibold px-5 py-[7px] rounded-full transition-all duration-150 whitespace-nowrap ${!annual ? "bg-purple-600 text-white" : "text-slate-500 dark:text-zinc-400 bg-transparent"}`}
            >
              Mensual
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`text-[13px] font-semibold px-5 py-[7px] rounded-full transition-all duration-150 flex items-center gap-[6px] whitespace-nowrap ${annual ? "bg-purple-600 text-white" : "text-slate-500 dark:text-zinc-400 bg-transparent"}`}
            >
              Anual
              {annual && (
                <span className="text-[10.5px] font-bold text-green-400 bg-green-400/10 border border-green-400/25 px-2 py-0.5 rounded-full">
                  20% off
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-4 max-w-[420px] sm:max-w-none mx-auto items-stretch">
          {/* Free */}
          <div className="group bg-white dark:bg-zinc-900 border border-black/[0.13] dark:border-white/[0.13] rounded-[20px] p-[32px_26px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_-12px_rgba(139,92,246,0.15)] hover:border-purple-500/30 flex flex-col">
            <div className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 tracking-[1px] uppercase mb-[10px]">Free</div>
            <div className="flex items-baseline gap-0.5 mb-1">
              <span className="text-[20px] font-semibold text-slate-900 dark:text-white">$</span>
              <span className="text-[46px] font-black text-slate-900 dark:text-white tracking-[-2px] leading-none">0</span>
            </div>
            <div className="text-[13px] text-slate-500 dark:text-zinc-400 mb-1">/mes · Para siempre</div>
            <div className="text-[12.5px] text-slate-400 dark:text-zinc-500 italic mb-[22px]">Para empezar</div>
            <div className="h-px bg-black/[0.08] dark:bg-white/[0.08] mb-[18px]" />
            <ul className="flex flex-col gap-[9px] mb-[26px] list-none p-0 flex-grow">
              {FREE_FEATS.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] text-slate-500 dark:text-zinc-400">
                  <span className={`flex-shrink-0 mt-px font-bold ${f.ok ? "text-green-600" : "text-red-400"}`}>
                    {f.ok ? "✓" : "✕"}
                  </span>
                  {f.t}
                </li>
              ))}
            </ul>
            <Link
              href="/admin/register"
              className="block w-full text-center py-[13px] rounded-[10px] text-[14px] font-bold text-purple-600 border-2 border-purple-500/40 hover:border-purple-600 hover:bg-purple-500/[0.06] transition-all duration-150 no-underline"
            >
              Empezar gratis
            </Link>
          </div>

          {/* Pro */}
          <div className="group relative bg-white dark:bg-zinc-900 border-2 border-purple-600 rounded-[20px] overflow-visible transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_-12px_rgba(139,92,246,0.4)] flex flex-col">
            <div className="absolute inset-0 rounded-[18px] pointer-events-none overflow-hidden">
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(109,40,217,0.18) 0%, transparent 65%)" }}
              />
            </div>
            <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[11.5px] font-bold px-4 py-[5px] rounded-full whitespace-nowrap z-10 shadow-[0_4px_14px_rgba(139,92,246,0.35)] group-hover:scale-105 transition-transform duration-300">
              Más popular
            </div>
            
            <div className="relative p-[32px_26px] flex flex-col flex-grow">
              <div className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 tracking-[1px] uppercase mb-[10px]">Pro</div>
              <div className="flex items-baseline gap-0.5 mb-1">
                <span className="text-[20px] font-semibold text-slate-900 dark:text-white">$</span>
                <span className="text-[46px] font-black text-slate-900 dark:text-white tracking-[-2px] leading-none">
                  {annual ? "23" : "29"}
                </span>
                {annual && <span className="text-[16px] text-slate-400 line-through ml-2 font-normal">$29</span>}
              </div>
              <div className="text-[13px] text-slate-500 dark:text-zinc-400 mb-1">
                /mes {annual ? "· facturado anual" : ""}
              </div>
              <div className="text-[12.5px] text-slate-400 dark:text-zinc-500 italic mb-[22px]">El más elegido</div>
              <div className="h-px bg-black/[0.08] dark:bg-white/[0.08] mb-[18px]" />
              
              <ul className="flex flex-col gap-[9px] mb-[26px] list-none p-0 flex-grow">
                {PRO_FEATS.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13.5px] text-slate-500 dark:text-zinc-400">
                    <span className="flex-shrink-0 mt-px font-bold text-green-600">✓</span>
                    {f.t}
                  </li>
                ))}
              </ul>
              
              <Link
                href="/admin/register"
                className="block w-full text-center py-[13px] rounded-[10px] text-[14px] font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-[0_2px_12px_rgba(139,92,246,0.35)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.45)] hover:-translate-y-px transition-all duration-150 no-underline mt-auto"
              >
                Empezar 14 días gratis
              </Link>
            </div>
          </div>

          {/* Enterprise */}
          <div className="group bg-white dark:bg-zinc-900 border border-black/[0.13] dark:border-white/[0.13] rounded-[20px] p-[32px_26px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_-12px_rgba(139,92,246,0.15)] hover:border-purple-500/30 flex flex-col">
            <div className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 tracking-[1px] uppercase mb-[10px]">Enterprise</div>
            <div className="flex items-baseline gap-0.5 mb-1">
              <span className="text-[20px] font-semibold text-slate-900 dark:text-white">$</span>
              <span className="text-[46px] font-black text-slate-900 dark:text-white tracking-[-2px] leading-none">
                {annual ? "63" : "79"}
              </span>
              {annual && <span className="text-[16px] text-slate-400 line-through ml-2 font-normal">$79</span>}
            </div>
            <div className="text-[13px] text-slate-500 dark:text-zinc-400 mb-1">
              /mes {annual ? "· facturado anual" : ""}
            </div>
            <div className="text-[12.5px] text-slate-400 dark:text-zinc-500 italic mb-[22px]">Para equipos grandes</div>
            <div className="h-px bg-black/[0.08] dark:bg-white/[0.08] mb-[18px]" />
            <ul className="flex flex-col gap-[9px] mb-[26px] list-none p-0 flex-grow">
              {ENT_FEATS.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] text-slate-500 dark:text-zinc-400">
                  <span className="flex-shrink-0 mt-px font-bold text-green-600">✓</span>
                  {f.t}
                </li>
              ))}
            </ul>
            <button className="w-full py-[13px] rounded-[10px] text-[14px] font-bold text-purple-600 border-2 border-purple-500/40 hover:border-purple-600 hover:bg-purple-500/[0.06] transition-all duration-150 cursor-pointer bg-transparent">
              Contactar ventas
            </button>
          </div>
        </div>

        <p className="text-center text-[13px] text-slate-400 dark:text-zinc-500 mb-[52px] transition-colors duration-300">
          Todos los planes incluyen 14 días de prueba completa. Sin tarjeta. Cancela cuando quieras.
        </p>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 540 }}>
            <thead>
              <tr>
                <th className="text-[12.5px] font-bold text-slate-500 dark:text-zinc-400 px-[14px] py-3 text-left border-b border-black/[0.13] dark:border-white/[0.13] w-[40%]">
                  Funcionalidad
                </th>
                <th className="text-[12.5px] font-bold text-slate-500 dark:text-zinc-400 px-[14px] py-3 text-center border-b border-black/[0.13] dark:border-white/[0.13]">Free</th>
                <th className="text-[12.5px] font-bold text-purple-500 px-[14px] py-3 text-center border-b border-black/[0.13] dark:border-white/[0.13]">Pro</th>
                <th className="text-[12.5px] font-bold text-slate-500 dark:text-zinc-400 px-[14px] py-3 text-center border-b border-black/[0.13] dark:border-white/[0.13]">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r, i) =>
                "cat" in r ? (
                  <tr key={i}>
                    <td
                      colSpan={4}
                      className="text-[10.5px] font-bold text-purple-500 uppercase tracking-[0.8px] px-[14px] pt-[18px] pb-[6px]"
                    >
                      {r.cat}
                    </td>
                  </tr>
                ) : (
                  <tr key={i} className="even:bg-black/[0.02] dark:even:bg-white/[0.02]">
                    <td className="text-[13px] text-slate-500 dark:text-zinc-400 px-[14px] py-[10px] border-b border-black/[0.04] dark:border-white/[0.04]">
                      {r.f}
                    </td>
                    <td className="text-center px-[14px] py-[10px] border-b border-black/[0.04] dark:border-white/[0.04]">
                      <CmpCell v={r.free!} />
                    </td>
                    <td className="text-center px-[14px] py-[10px] border-b border-black/[0.04] dark:border-white/[0.04]">
                      <CmpCell v={r.pro!} />
                    </td>
                    <td className="text-center px-[14px] py-[10px] border-b border-black/[0.04] dark:border-white/[0.04]">
                      <CmpCell v={r.ent!} />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
