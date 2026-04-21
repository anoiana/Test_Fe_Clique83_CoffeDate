import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormProvider } from 'react-hook-form';
import { PageTransition } from '../../../../shared/components/PageTransition';
import { ProgressBar } from '../../../../shared/components/ProgressBar';

import { R3SectionVision } from './R3SectionVision';
import { R3SectionBackground } from './R3SectionBackground';
import { R3SectionLifestyle } from './R3SectionLifestyle';
import { R3SectionExpression } from './R3SectionExpression';

import { useRound3Survey } from "../../hooks/useRound3Survey";

export const Round3Survey = () => {

  const {
    step,
    formMethods,
    progress,
    handleNext,
    handleBack,
  } = useRound3Survey();

  const stepComponents = useMemo(() => ({
    1: <R3SectionVision onNext={handleNext} onBack={handleBack} />,
    2: <R3SectionBackground onNext={handleNext} onBack={handleBack} />,
    3: <R3SectionLifestyle onNext={handleNext} onBack={handleBack} />,
    4: <R3SectionExpression onNext={handleNext} onBack={handleBack} />
  }), [handleNext, handleBack]);

  // Prevent rendering if somehow step is invalid
  if (!stepComponents[step as keyof typeof stepComponents]) {
    handleBack(); // safety redirect
    return null;
  }

  return (
    <FormProvider {...formMethods}>
      <div className="h-[100dvh] w-full bg-background-paper z-50 overflow-hidden relative">
        {/* Background Particles (Optional, consistent with Round 2) */}
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
                <PageTransition key={`r3-step-${step}`} className="overflow-y-auto custom-scrollbar px-2">
                  {stepComponents[step as keyof typeof stepComponents]}
                </PageTransition>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
