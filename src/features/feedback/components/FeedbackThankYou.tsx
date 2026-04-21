import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Heart } from 'lucide-react';
import { PageTransition } from '../../../shared/components/PageTransition';

interface FeedbackThankYouProps {
  meetingId: string;
}

export const FeedbackThankYou = ({ meetingId }: FeedbackThankYouProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/match', { replace: true });
  };

  return (
    <PageTransition className="bg-background-paper flex flex-col min-h-screen">
      <div className="flex flex-col flex-1 p-6 pb-10 font-sans relative overflow-hidden max-w-lg mx-auto w-full">

        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="flex flex-col flex-1 items-center justify-center text-center relative z-10 gap-6">

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
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight">
              {t('feedback.thankYou.title')}
            </h1>
            <p className="text-primary text-sm font-bold uppercase tracking-[0.3em]">
              {t('feedback.thankYou.subtitle')}
            </p>
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-ink/50 text-[15px] leading-relaxed max-w-[300px]"
          >
            {t('feedback.thankYou.message')}
          </motion.p>

          {/* Decorative hearts */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-3 mt-2"
          >
            <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
            <Heart className="w-7 h-7 text-primary/60 fill-primary/30" />
            <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
          </motion.div>
        </div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative z-10"
        >
          <button
            onClick={handleBack}
            className="w-full py-5 rounded-full bg-primary text-black font-bold uppercase tracking-[0.2em] text-[12px] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {t('feedback.thankYou.back_home')}
          </button>
        </motion.div>

      </div>
    </PageTransition>
  );
};
