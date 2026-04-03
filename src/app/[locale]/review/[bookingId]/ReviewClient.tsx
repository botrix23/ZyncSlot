"use client";
import { useState } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";
import { createReviewAction } from "@/app/actions/review";
import { useTranslations } from "next-intl";

export default function ReviewClient({ booking }: { booking: any }) {
  const t = useTranslations('Review');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(t('invalidRating'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await createReviewAction({
        tenantId: booking.tenantId,
        bookingId: booking.id,
        staffId: booking.staffId,
        rating,
        comment
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        if (result.error === 'REVIEW_ALREADY_EXISTS') {
          setError(t('alreadyReviewed'));
        } else {
          setError("Error al enviar la reseña. Inténtalo de nuevo.");
        }
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-[32px] p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500 border border-slate-200 dark:border-white/5">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t('success')}</h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">{t('successSubtitle')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-10 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 border border-slate-200 dark:border-white/5">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-purple-500/10 rounded-2xl mb-2 text-purple-600 dark:text-purple-400">
           <Star className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">{t('title')}</h1>
        <p className="text-slate-500 dark:text-zinc-400 font-medium">
          {t('subtitle', { staff: booking.staff?.name || "nuestro staff" })}
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block text-center">
            {t('ratingLabel')}
          </label>
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="group relative transition-all duration-300 transform active:scale-90"
              >
                <Star 
                  className={`w-10 h-10 transition-all duration-300 ${
                    (hoverRating || rating) >= star 
                      ? 'text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] fill-current' 
                      : 'text-slate-200 dark:text-zinc-800'
                  }`} 
                />
                {(hoverRating || rating) >= star && (
                  <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full scale-150 animate-pulse -z-10" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">
            {t('commentLabel')}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('commentPlaceholder')}
            rows={4}
            className="w-full p-5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-white/10 rounded-[24px] focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all resize-none text-sm font-medium dark:text-white"
          />
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-shake">
            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold text-center">
              {error}
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-100 dark:disabled:bg-white/5 disabled:text-slate-400 dark:disabled:text-zinc-600 rounded-[20px] font-black tracking-widest shadow-2xl shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase text-xs"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {t('submit')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
