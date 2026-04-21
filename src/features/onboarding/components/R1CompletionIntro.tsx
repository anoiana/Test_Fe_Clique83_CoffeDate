import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, ArrowRight, CheckCircle2, User, MapPin, Briefcase, Heart } from 'lucide-react';
import { PageTransition } from '../../../shared/components/PageTransition';
import { Button } from '../../../shared/components/Button';
import { BackButton } from '../../../shared/components/BackButton';
import { matchingApi } from '../../matching/api/matchingApi';
import { InfoRowProps } from '../../../shared/types/index';

export const R1CompletionIntro = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [evaluation, setEvaluation] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await matchingApi.getEvaluationMe();
        setEvaluation(data);
      } catch (err) {
        console.error('Failed to fetch evaluation:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      navigate('/onboarding/matching-survey');
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate('/dashboard');
    }
  };

  const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 bg-background-warm rounded-3xl border border-divider group hover:border-primary/30 transition-all duration-500"
    >
      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex flex-col text-left overflow-hidden">
        <span className="text-[9px] text-ink/30 uppercase font-black tracking-[0.2em] mb-0.5">{label}</span>
        <span className="text-ink font-bold text-sm tracking-wide truncate">{value || '---'}</span>
      </div>
    </motion.div>
  );

  return (
    <PageTransition className="bg-background-paper min-h-[100dvh] h-full flex flex-col items-center justify-between px-8 py-6 relative overflow-y-auto custom-scrollbar">
      {/* Fixed Navigation */}
      <div className="absolute top-4 left-4 z-[100] sm:top-6 sm:left-6">
        <BackButton onClick={handleBack} />
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="congrats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full text-center z-10 flex flex-col min-h-full"
          >
            <div className="flex-1 flex flex-col justify-center w-full max-w-md mx-auto gap-2">
              {/* Top Logo Section with System Color Effects */}
              <div className="relative mb-2 sm:mb-4 w-28 h-28 mx-auto flex items-center justify-center shrink-0">
                {/* 1. Main Pulsing Glow (Primary Color) */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-2 bg-primary/20 rounded-full blur-3xl"
                />

                {/* 2. Slow Rotating Decorative Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-primary/10 rounded-full scale-110"
                />

                {/* 3. System Sparkles (Floating Burgundy Dots) */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary rounded-full z-0"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      scale: [0, 1.2, 0],
                      opacity: [0, 0.6, 0],
                      x: [0, (i % 2 === 0 ? 1 : -1) * (25 + Math.random() * 30)],
                      y: [0, (i < 3 ? 1 : -1) * (25 + Math.random() * 30)],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut"
                    }}
                  />
                ))}

                {/* 4. Animated Logo */}
                <motion.img
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.1
                  }}
                  src="/logo.png"
                  alt="Clique Logo"
                  className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain z-10 logo-glow"
                />
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl font-black text-ink mb-1 tracking-tight leading-[1.15] font-serif">
                {t('onboarding.r1_completion.title')}
              </h1>

              {/* Subtitle (Only if exists) */}
              {t('onboarding.r1_completion.subtitle') && (
                <p className="text-ink/40 text-sm sm:text-lg mb-6 leading-relaxed font-medium px-2">
                  {t('onboarding.r1_completion.subtitle')}
                </p>
              )}

              {/* UP NEXT CARD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-background-warm rounded-[32px] p-6 sm:p-7 border border-divider relative overflow-hidden group text-left shadow-elevated"
              >
                {/* Decorative Background Element */}
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles className="w-24 h-24 text-ink" />
                </div>

                <div className={`flex gap-4 items-center shrink-0 ${t('onboarding.r1_completion.next_desc') ? 'mb-5' : ''}`}>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/10">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-primary font-black tracking-[0.3em] uppercase mb-1">
                      {t('onboarding.r1_completion.up_next')}
                    </span>
                    <h2 className="text-lg font-black text-ink italic uppercase tracking-tighter font-serif leading-tight">
                      {t('onboarding.r1_completion.next_topic')}
                    </h2>
                  </div>
                </div>

                {t('onboarding.r1_completion.next_desc') && (
                  <p className="text-ink/50 text-[15px] leading-relaxed font-medium mb-4">
                    {t('onboarding.r1_completion.next_desc')}
                  </p>
                )}
                {t('onboarding.r1_completion.next_desc2') && (
                  <p className="text-ink/40 text-[13px] leading-relaxed font-medium">
                    {t('onboarding.r1_completion.next_desc2')}
                  </p>
                )}
              </motion.div>
            </div>

            <div className="w-full max-w-[280px] mx-auto pb-6 shrink-0 mt-8">
              <Button
                onClick={handleNext}
                variant="golden"
                icon="arrow_forward"
                className="h-14 rounded-2xl"
              >
                {t('onboarding.r1_completion.start_continue')}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="intro-r2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full z-10 flex flex-col min-h-full items-center"
          >
            <div className="flex-1 flex flex-col justify-center py-10 w-full max-w-md mx-auto text-center">
              {/* Logo & Phase Header */}
              <div className="flex flex-col items-center mb-12">
                <div className="relative mb-8 w-28 h-28 flex items-center justify-center">
                  {/* Layered Pulsing Glow */}
                  <motion.div 
                    animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" 
                  />
                  
                  <motion.img 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src="/logo.png" 
                    alt="Clique Logo" 
                    className="w-24 h-24 object-contain relative z-10 logo-glow"
                  />
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-primary font-black text-[11px] tracking-[0.5em] uppercase opacity-70">
                    {t('onboarding.r1_completion.phase_02', 'GIAI ĐOẠN 02')}
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-black text-ink uppercase italic tracking-tighter font-serif leading-none">
                    {t('onboarding.r1_completion.r2_title')}
                  </h2>
                </div>
              </div>

              {/* Enhanced Highlight Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-background-warm/40 border border-divider/50 rounded-[40px] p-10 shadow-sm backdrop-blur-md relative overflow-hidden group mb-6"
              >
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary/10 rounded-tl-[40px]" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary/10 rounded-br-[40px]" />

                {/* Headline inside card - Highlighted in Primary */}
                <h3 className="text-xl sm:text-2xl font-black text-primary mb-5 leading-tight text-center font-serif relative z-10 uppercase tracking-tight">
                  {t('onboarding.r1_completion.r2_headline')}
                </h3>

                {/* Elegant Divider */}
                <div className="h-[1px] bg-primary/20 w-12 mx-auto mb-6 relative z-10" />

                {/* Description Blocks */}
                <div className="space-y-6 relative z-10">
                  {t('onboarding.r1_completion.r2_desc1') && (
                    <p className="text-ink/60 leading-relaxed text-[15px] font-medium text-center px-4">
                      {t('onboarding.r1_completion.r2_desc1')}
                    </p>
                  )}
                  {t('onboarding.r1_completion.r2_desc2') && (
                    <p className="text-ink/60 leading-relaxed text-[15px] font-medium text-center px-4">
                      {t('onboarding.r1_completion.r2_desc2')}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Action Area */}
            <div className="w-full max-w-[280px] mx-auto pb-10 flex flex-col items-center shrink-0">
              <Button
                onClick={handleNext}
                variant="golden"
                icon="rocket_launch"
                className="h-14 rounded-2xl w-full shadow-elevated"
              >
                {t('onboarding.r1_completion.start_r2')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};
