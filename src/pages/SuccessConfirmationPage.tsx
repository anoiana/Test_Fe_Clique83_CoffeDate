import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '../shared/components/PageTransition';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FloatingParticles from '../shared/components/FloatingParticles';

/**
 * Premium Success & Gratitude Screen for Clique 83.
 * Shown after a successful reservation to provide a cinematic sense of completion.
 */
export const SuccessConfirmationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Auto-return logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/meeting-status');
    }, 4500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageTransition className="bg-background-paper min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transform-gpu">

      {/* Cinematic Floating Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingParticles count={40} opacity={0.2} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.05),transparent_70%)]" />
      </div>

      {/* Background Large Text Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-ink/[0.01] pointer-events-none select-none z-0 tracking-tighter italic">
        {t('success_confirmation.ok')}
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center px-6">
        {/* Success Icon Group */}
        <div className="relative mb-12">
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="w-24 h-24 rounded-[2.5rem] bg-primary flex items-center justify-center shadow-[0_20px_50px_rgba(212,175,55,0.3)] relative z-10"
            >
                <CheckCircle2 className="w-10 h-10 text-black" strokeWidth={3} />
            </motion.div>
            
            {/* Animated Rings */}
            <motion.div 
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-[2.5rem] border-2 border-primary z-0"
            />
        </div>

        {/* Simplified Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center space-y-8"
        >
            <div className="flex flex-col items-center gap-6">
                <span className="typo-label-cinematic text-primary italic">
                    {t('success_confirmation.success')}
                </span>
                
                <h1 className="text-5xl md:text-7xl font-black text-ink tracking-tight italic uppercase leading-[1.1]">
                    <Trans i18nKey="success_confirmation.experience_awaits">
                        SEE YOU <br/><span className="text-primary font-light not-italic">SOON!</span>
                    </Trans>
                </h1>
            </div>

            <p className="typo-body-light leading-relaxed max-w-[260px] mx-auto mt-8 px-4 opacity-80">
                {t('success_confirmation.thank_you')}
            </p>
        </motion.div>

        {/* Cinematic Auto-Return indicator */}
        <div className="mt-24 flex flex-col items-center gap-6">
            <div className="w-20 h-[1px] bg-ink/5 relative overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 4.5, ease: "linear" }}
                    className="absolute inset-0 bg-primary/60"
                />
            </div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="typo-footnote-wide text-ink/20"
            >
                {t('success_confirmation.redirecting')}
            </motion.p>
        </div>
      </div>

    </PageTransition>
  );
};
