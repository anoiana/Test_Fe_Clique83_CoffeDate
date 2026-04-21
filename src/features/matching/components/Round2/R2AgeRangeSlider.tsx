import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from '../../../onboarding/components/StepLayout';
import { useAuthContext } from '../../../../shared/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Handle Range Selection (From-To) using two sliders or a single interaction.
 * Styled to match the Clique 83 aesthetic.
 */
export const R2AgeRangeSlider = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const data = value || { from: 21, to: 35 };
  const minLimit = 21;
  const maxLimit = 65;

  const updateFrom = (amount) => {
    const curr = parseInt(data.from) || minLimit;
    const currTo = parseInt(data.to) || maxLimit;
    const newVal = Math.max(minLimit, Math.min(curr + amount, currTo - 1));
    onChange({ ...data, from: newVal });
  };

  const updateTo = (amount) => {
    const curr = parseInt(data.to) || maxLimit;
    const currFrom = parseInt(data.from) || minLimit;
    const newVal = Math.max(currFrom + 1, Math.min(curr + amount, maxLimit));
    onChange({ ...data, to: newVal });
  };

  const isInvalid = !data.from || !data.to || parseInt(data.from) < minLimit || parseInt(data.to) > maxLimit || parseInt(data.from) >= parseInt(data.to);

  // Calculate actual age from birthdate
  const userAge = useMemo(() => {
    if (user?.age) return user.age;
    if (user?.birthdate) {
      const birthDate = new Date(user.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    return null;
  }, [user]);

  // Warning logic
  const showWarning = useMemo(() => {
    if (!userAge) return true;
    return Math.abs(data.to - userAge) > 10 || Math.abs(data.from - userAge) > 10;
  }, [userAge, data.from, data.to]);

  // Long press logic
  const useLongPress = (callback, ms = 100) => {
    const [startLongPress, setStartLongPress] = useState(false);

    useEffect(() => {
      let timer;
      if (startLongPress) {
        timer = setInterval(callback, ms);
      } else {
        clearInterval(timer);
      }
      return () => clearInterval(timer);
    }, [startLongPress, callback, ms]);

    return {
      onMouseDown: () => setStartLongPress(true),
      onMouseUp: () => setStartLongPress(false),
      onMouseLeave: () => setStartLongPress(false),
      onTouchStart: () => setStartLongPress(true),
      onTouchEnd: () => setStartLongPress(false),
    };
  };

  const pressFromMinus = useLongPress(() => updateFrom(-1));
  const pressFromPlus = useLongPress(() => updateFrom(1));
  const pressToMinus = useLongPress(() => updateTo(-1));
  const pressToPlus = useLongPress(() => updateTo(1));

  return (
    <StepLayout

      title={t('matching.round2.age_range.title')}
      onNext={onNext}
      onBack={onBack}
      showNext={true}
      nextDisabled={isInvalid}
      scrollable={true}
    >
      <div className="flex flex-col gap-2 pt-2 pb-20 px-1 h-full items-center justify-start">
        
        {/* Dynamic Age Warning - More Compact Spacing */}
        <div className="w-full min-h-[50px] mb-6 z-10"> 
          <AnimatePresence mode="wait">
            {showWarning && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="bg-amber-500/15 border border-amber-500/30 rounded-[1.5rem] p-4 flex items-center gap-4 shadow-2xl"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-500 text-[18px]">priority_high</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-normal font-medium">
                  {t('matching.round2.age_range.age_warning')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compact Stepper Layout with Long Press & Manual Input */}
        <div className="flex flex-col gap-2 w-full max-w-[340px] items-center">
          
          {/* FROM Stepper */}
          <div className="w-full flex items-center justify-between bg-background-warm/60 p-4 rounded-[2.2rem] border border-divider group transition-all focus-within:border-primary/40 focus-within:bg-primary/5 shadow-inner">
            <button 
              {...pressFromMinus}
              onClick={() => updateFrom(-1)}
              className="w-14 h-14 rounded-full bg-background-warm flex items-center justify-center border border-divider active:scale-95 active:bg-white/20 transition-all hover:bg-ink/5 select-none touch-none shadow-lg"
            >
              <span className="material-symbols-outlined text-ink/50 text-2xl">remove</span>
            </button>
            
            <div className="flex flex-col items-center flex-1">
              <span className="text-[9px] font-black text-ink/20 uppercase tracking-[0.3em] mb-1">{t('matching.round2.age_range.from')}</span>
              <input 
                type="number"
                value={data.from}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({ ...data, from: val === '' ? '' : parseInt(val) });
                }}
                className="w-full bg-transparent border-none text-center text-5xl font-black text-primary drop-shadow-[0_0_15px_rgba(255,215,0,0.15)] leading-none tabular-nums outline-none focus:ring-0 p-0"
              />
            </div>

            <button 
              {...pressFromPlus}
              onClick={() => updateFrom(1)}
              className="w-14 h-14 rounded-full bg-background-warm flex items-center justify-center border border-divider active:scale-95 active:bg-white/20 transition-all hover:bg-ink/5 select-none touch-none shadow-lg"
            >
              <span className="material-symbols-outlined text-ink/50 text-2xl">add</span>
            </button>
          </div>

          <div className="flex flex-col items-center opacity-5 my-[-10px]">
            <span className="material-symbols-outlined text-2xl">keyboard_arrow_down</span>
          </div>

          {/* TO Stepper */}
          <div className="w-full flex items-center justify-between bg-background-warm/60 p-4 rounded-[2.2rem] border border-divider group transition-all focus-within:border-primary/40 focus-within:bg-primary/5 shadow-inner">
            <button 
              {...pressToMinus}
              onClick={() => updateTo(-1)}
              className="w-14 h-14 rounded-full bg-background-warm flex items-center justify-center border border-divider active:scale-95 active:bg-white/20 transition-all hover:bg-ink/5 select-none touch-none shadow-lg"
            >
              <span className="material-symbols-outlined text-ink/50 text-2xl">remove</span>
            </button>
            
            <div className="flex flex-col items-center flex-1">
              <span className="text-[9px] font-black text-ink/20 uppercase tracking-[0.3em] mb-1">{t('matching.round2.age_range.to')}</span>
              <input 
                type="number"
                value={data.to}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({ ...data, to: val === '' ? '' : parseInt(val) });
                }}
                className="w-full bg-transparent border-none text-center text-5xl font-black text-primary drop-shadow-[0_0_15px_rgba(255,215,0,0.15)] leading-none tabular-nums outline-none focus:ring-0 p-0"
              />
            </div>

            <button 
              {...pressToPlus}
              onClick={() => updateTo(1)}
              className="w-14 h-14 rounded-full bg-background-warm flex items-center justify-center border border-divider active:scale-95 active:bg-white/20 transition-all hover:bg-ink/5 select-none touch-none shadow-lg"
            >
              <span className="material-symbols-outlined text-ink/50 text-2xl">add</span>
            </button>
          </div>

        </div>
      </div>
    </StepLayout>
  );
};
