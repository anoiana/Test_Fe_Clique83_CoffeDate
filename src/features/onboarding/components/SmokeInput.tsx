import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const SmokeInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  const options = [
    { id: 'yes', label: t('onboarding.smoke.options.yes') },
    { id: 'socially', label: t('onboarding.smoke.options.socially') },
    { id: 'no', label: t('onboarding.smoke.options.no') }
  ];

  const handleSelect = (id) => {
    onChange(id);
    setTimeout(() => onNext(), 300);
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.habits')}
      title={t('onboarding.smoke.title')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      showNext={false}
    >
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`w-full py-5 px-6 rounded-2xl transition-all border text-left ${
              value === opt.id 
                ? 'bg-primary/20 border-primary text-primary font-bold shadow-[0_4px_15px_rgba(255,215,0,0.1)]' 
                : 'bg-background-warm border-divider text-slate-300 hover:bg-ink/5'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </StepLayout>
  );
};
