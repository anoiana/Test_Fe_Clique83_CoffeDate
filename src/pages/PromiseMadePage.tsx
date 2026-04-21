import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { PageTransition } from '../shared/components/PageTransition';

/**
 * PromiseMadePage — Phase 33
 * Route: /meeting/:meetingId/promise
 *
 * Step 1 of the feedback flow.
 * Shown after user clicks "Bạn sẽ có mặt đúng giờ".
 * Displays a simple congratulations screen.
 * After a short delay, user can proceed to ConfirmCompletePage.
 */
export const PromiseMadePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();

  const handleContinue = () => {
    navigate(`/meeting/${meetingId}/confirm-complete`, { replace: true });
  };

  // Auto-redirect after 3 seconds (optional UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/meeting/${meetingId}/confirm-complete`, { replace: true });
    }, 4000);
    return () => clearTimeout(timer);
  }, [meetingId]);

  return (
    <PageTransition className="bg-background-paper flex flex-col min-h-screen">
      <div className="flex flex-col flex-1 p-6 pb-10 font-sans relative overflow-hidden max-w-lg mx-auto w-full">

        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 items-center justify-center text-center relative z-10 gap-8">

          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150" />
            <div className="w-28 h-28 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center relative">
              <CheckCircle2 className="w-14 h-14 text-primary drop-shadow-[0_0_20px_rgba(122,46,46,0.5)]" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight">
              {t('feedback.promise.title')}
            </h1>
            <div className="h-0.5 w-16 bg-primary/40 rounded-full" />
            <p className="text-ink/50 text-[15px] leading-relaxed max-w-[300px]">
              {t('feedback.promise.desc')}
            </p>
          </motion.div>

          {/* Decorative hearts */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
            <Heart className="w-7 h-7 text-primary/60 fill-primary/30" />
            <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
          </motion.div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-6 py-5 rounded-2xl bg-background-warm/60 border border-divider text-left w-full max-w-[320px]"
          >
            <p className="text-[12px] text-ink/40 font-bold uppercase tracking-widest mb-2">
              {t('feedback.promise.next_step_label')}
            </p>
            <div className="text-[13px] text-ink/70 leading-relaxed">
              <Trans i18nKey="feedback.promise.next_step_desc">
                Sau buổi hẹn, bạn có thể đánh giá và gửi phản hồi cho Clique83 sau <span className="text-primary font-bold">30 phút</span> kể từ lúc bắt đầu.
              </Trans>
            </div>
          </motion.div>
        </div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative z-10"
        >
          <button
            onClick={handleContinue}
            className="w-full py-5 rounded-full bg-primary text-black font-bold uppercase tracking-[0.2em] text-[12px] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {t('feedback.promise.action')}
            <ArrowRight size={16} strokeWidth={3} />
          </button>
        </motion.div>

      </div>
    </PageTransition>
  );
};
