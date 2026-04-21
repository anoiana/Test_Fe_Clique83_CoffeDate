import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const SocialLinkInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.connect_with_us')}
      title={t('onboarding.social_link.title')}
      description={t('onboarding.social_link.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value.trim()}
    >
      <div className="relative pt-10">
        <input
          ref={inputRef}
          type="text"
          placeholder={t('onboarding.social_link.placeholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-14 bg-transparent border-b-2 border-primary/60 focus:border-primary px-0 text-ink text-3xl font-light placeholder:text-slate-800 focus:outline-none focus:ring-0 transition-colors"
        />
      </div>
    </StepLayout>
  );
};
