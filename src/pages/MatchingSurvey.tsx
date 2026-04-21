import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { PageTransition } from '../shared/components/PageTransition';
import { ProgressBar } from '../shared/components/ProgressBar';

import { R2SectionValues } from '../features/matching/components/Round2/R2SectionValues';
import { R2SectionMatch } from '../features/matching/components/Round2/R2SectionMatch';
import { R2SectionPersonality } from '../features/matching/components/Round2/R2SectionPersonality';
import { R2SectionLifestyle } from '../features/matching/components/Round2/R2SectionLifestyle';
import { R2SectionInterests } from '../features/matching/components/Round2/R2SectionInterests';
import { R2SectionBackground } from '../features/matching/components/Round2/R2SectionBackground';
import { R2SectionExpression } from '../features/matching/components/Round2/R2SectionExpression';

// Shared
import { useMatchingSurvey } from '../features/matching/hooks/useMatchingSurvey';

export const MatchingSurvey = () => {
  const {
    step,
    formMethods,
    progress,
    handleNext,
    handleBack,
    t
  } = useMatchingSurvey();

  const stepComponents = useMemo(() => ({
    1: <R2SectionValues onNext={handleNext} onBack={handleBack} />,
    2: <R2SectionMatch onNext={handleNext} onBack={handleBack} />,
    3: <R2SectionPersonality onNext={handleNext} onBack={handleBack} />,
    4: <R2SectionLifestyle onNext={handleNext} onBack={handleBack} />,
    5: <R2SectionInterests onNext={handleNext} onBack={handleBack} />,
    6: <R2SectionBackground onNext={handleNext} onBack={handleBack} />,
    7: <R2SectionExpression onNext={handleNext} onBack={handleBack} />
  }), [handleNext, handleBack]);

  return (
    <FormProvider {...formMethods}>
      <div className="h-[100dvh] w-full bg-background-paper z-50 overflow-hidden relative">
        {/* Background Particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          {[...Array(15)].map((_, i) => (
            <motion.div key={i} className="absolute w-1 h-1 bg-primary/30 rounded-full transform-gpu" initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: Math.random() * 0.3 + 0.1, scale: Math.random() * 2 + 0.5 }} animate={{ y: [0, -40, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: "transform, opacity" }} />
          ))}
        </div>

        <div className="h-full flex flex-col items-center p-4 sm:p-6 animate-in fade-in duration-1000">
          <div className="w-full max-w-lg h-full flex flex-col relative z-10">
            <div className="fixed top-0 left-0 w-full z-[60]">
              <ProgressBar progress={progress} />
            </div>
            <header className="pt-8 shrink-0" />
            <main className="flex-1 min-h-0 relative overflow-hidden pb-4">
              <AnimatePresence mode="wait">
                <PageTransition key={`r2-step-${step}`} className="overflow-y-auto custom-scrollbar px-2">
                  {stepComponents[step as keyof typeof stepComponents] || stepComponents[1]}
                </PageTransition>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
