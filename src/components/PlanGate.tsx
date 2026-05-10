'use client';

import { Lock } from 'lucide-react';
import { canUseFeature, getPlanDisplayName } from '@/core/plans';
import type { PlanFeatures } from '@/core/plans';

interface PlanGateProps {
  plan: string | null | undefined;
  feature: keyof PlanFeatures;
  children: React.ReactNode;
  /** Mensaje de upgrade personalizado. Si no se pasa, se genera automáticamente. */
  upgradeMessage?: string;
  /** Si true, muestra el contenido bloqueado con overlay en lugar de ocultarlo */
  overlay?: boolean;
}

/**
 * PlanGate – muestra el contenido si el plan tiene acceso, o un bloqueo con upgrade prompt.
 *
 * Uso básico:
 * <PlanGate plan={plan} feature="customTheme">
 *   <ThemeSelector />
 * </PlanGate>
 *
 * Con overlay (contenido visible pero bloqueado):
 * <PlanGate plan={plan} feature="advancedAnalytics" overlay>
 *   <AdvancedChart />
 * </PlanGate>
 */
export function PlanGate({ plan, feature, children, upgradeMessage, overlay = false }: PlanGateProps) {
  const allowed = canUseFeature(plan, feature);

  if (allowed) return <>{children}</>;

  const currentPlan = getPlanDisplayName(plan);
  const message = upgradeMessage ?? `Esta función no está disponible en el plan ${currentPlan}. Actualiza tu plan para acceder.`;

  if (overlay) {
    return (
      <div className="relative">
        {/* Children visibles pero desactivados */}
        <div className="pointer-events-none select-none opacity-40">
          {children}
        </div>
        {/* Overlay de bloqueo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm border border-zinc-200 dark:border-white/10">
          <PlanLockBadge message={message} currentPlan={currentPlan} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-xl border border-dashed border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02]">
      <PlanLockBadge message={message} currentPlan={currentPlan} />
    </div>
  );
}

function PlanLockBadge({ message, currentPlan }: { message: string; currentPlan: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center max-w-xs">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-200 dark:bg-white/10">
        <Lock className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-snug">{message}</p>
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 rounded-full">
        Plan actual: {currentPlan}
      </span>
    </div>
  );
}

/**
 * PlanGateSection – versión para secciones completas de formulario.
 * Muestra un banner de upgrade encima de la sección y la deshabilita.
 */
export function PlanGateSection({ plan, feature, children, upgradeMessage }: Omit<PlanGateProps, 'overlay'>) {
  const allowed = canUseFeature(plan, feature);

  if (allowed) return <>{children}</>;

  const currentPlan = getPlanDisplayName(plan);
  const message = upgradeMessage ?? `Esta función no está disponible en el plan ${currentPlan}.`;

  return (
    <div className="relative rounded-xl">
      {/* Banner de upgrade */}
      <div className="flex items-center gap-3 mb-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
        <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <p className="text-sm text-amber-700 dark:text-amber-300 flex-1">{message}</p>
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
          {currentPlan}
        </span>
      </div>
      {/* Contenido bloqueado */}
      <div className="pointer-events-none select-none opacity-40">
        {children}
      </div>
    </div>
  );
}
