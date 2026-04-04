import { getBookingAction } from "@/app/actions/booking";
import ReviewClient from "@/app/[locale]/review/[bookingId]/ReviewClient";
import { getTranslations } from "next-intl/server";
import { db } from "@/db";
import { tenants, surveyQuestions } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export default async function ReviewPage({ params }: { params: { locale: string; bookingId: string } }) {
  const t = await getTranslations('Review');
  const booking = await getBookingAction(params.bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-black">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-[32px] p-8 shadow-2xl text-center space-y-6 border border-slate-200 dark:border-white/5">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('notFound')}</h1>
          <p className="text-slate-500 dark:text-zinc-400">Verifica el enlace o contacta con soporte.</p>
        </div>
      </div>
    );
  }

  // Fetch tenant to check if reviews are enabled
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, booking.tenantId),
  });

  if (!tenant || !tenant.reviewsEnabled) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-black">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-[32px] p-8 shadow-2xl text-center space-y-6 border border-slate-200 dark:border-white/5">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('notFound')}</h1>
            <p className="text-slate-500 dark:text-zinc-400">El sistema de reseñas no está activo para este negocio.</p>
          </div>
        </div>
      );
  }

  const activeQuestions = await db.query.surveyQuestions.findMany({
    where: and(
        eq(surveyQuestions.tenantId, booking.tenantId),
        eq(surveyQuestions.isActive, true)
    ),
    orderBy: [asc(surveyQuestions.sortOrder)]
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-black">
      <ReviewClient 
        booking={booking} 
        questions={activeQuestions as any}
      />
    </div>
  );
}
