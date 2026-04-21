import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const ExtraMessageInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  const textareaRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => textareaRef.current?.focus(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.feedback')}
      title={t('onboarding.extra_message.title')}
      description={t('onboarding.extra_message.description')}
      onNext={onNext}
      onBack={onBack}
      nextLabel={t('onboarding.extra_message.finish_label')}
    >
      <div className="flex flex-col gap-6">
        <textarea
          ref={textareaRef}
          autoFocus
          rows={6}
          placeholder={t('onboarding.extra_message.placeholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-background-warm/60 border-2 border-divider focus:border-primary/50 p-6 text-ink text-lg font-light placeholder:text-slate-800 focus:outline-none transition-all resize-none rounded-[32px]"
        />
        
        <p className="text-center text-ink/30 text-[10px] uppercase tracking-[0.2em] font-bold">
          {t('onboarding.extra_message.footer')}
        </p>
      </div>
    </StepLayout>
  );
};
