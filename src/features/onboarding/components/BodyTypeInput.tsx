import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const BodyTypeInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();

  const options = [
    { id: 'slim', label: t('onboarding.body_type.options.slim') },
    { id: 'athletic', label: t('onboarding.body_type.options.athletic') },
    { id: 'average', label: t('onboarding.body_type.options.average') },
    { id: 'slightly_overweight', label: t('onboarding.body_type.options.slightly_overweight') },
    { id: 'overweight', label: t('onboarding.body_type.options.overweight') }
  ];

  const handleSelect = (id) => {
    onChange(id);
    setTimeout(() => onNext(), 300);
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.vitality')}
      title={t('onboarding.body_type.title')}
      description={t('onboarding.body_type.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      showNext={false}
    >
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between transition-all border text-left ${
              value === option.id 
                ? 'bg-primary/20 border-primary shadow-[0_4px_15px_rgba(255,215,0,0.1)]' 
                : 'bg-background-warm border-divider hover:bg-ink/5'
            }`}
          >
            <span className={`text-base ${value === option.id ? 'text-primary font-bold' : 'text-slate-300'}`}>
              {option.label}
            </span>
            {value === option.id && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-background-dark text-sm font-bold">check</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </StepLayout>
  );
};
