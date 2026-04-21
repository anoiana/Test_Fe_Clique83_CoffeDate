import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const BioInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  const textareaRef = useRef(null);
  const wordCount = value ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  const wordLimit = 300;

  useEffect(() => {
    const timer = setTimeout(() => textareaRef.current?.focus(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.expression')}
      title={t('onboarding.bio.title')}
      description={t('onboarding.bio.description', { wordLimit })}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value.trim() || wordCount > wordLimit}
    >
      <div className="relative group">
        <textarea
          ref={textareaRef}
          autoFocus
          rows={5}
          placeholder={t('onboarding.bio.placeholder')}
          value={value}
          onChange={(e) => {
            const words = e.target.value.trim().split(/\s+/).filter(Boolean).length;
            if (words <= wordLimit || e.target.value.length < value.length) {
              onChange(e.target.value);
            }
          }}
          className="w-full bg-background-warm/60 border-b-2 border-primary/40 focus:border-primary p-4 text-ink text-xl font-light placeholder:text-slate-800 focus:outline-none transition-all resize-none rounded-t-2xl min-h-[160px]"
        />
        <div className="absolute bottom-2 right-4 text-xs font-bold tracking-widest bg-background-paper/80 px-2 py-1 rounded border border-divider">
          <span className={wordCount > (wordLimit - 10) ? 'text-red-500' : 'text-primary/60'}>{wordCount}</span>
          <span className="text-slate-700 ml-1">{t('onboarding.bio.words_limit', { wordLimit })}</span>
        </div>
      </div>
    </StepLayout>
  );
};
