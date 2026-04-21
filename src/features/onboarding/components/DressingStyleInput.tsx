import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const DressingStyleInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();

  const options = [
    { id: 'sophisticated', label: t('onboarding.dressing_style.options.sophisticated') },
    { id: 'casual', label: t('onboarding.dressing_style.options.casual') },
    { id: 'trendy', label: t('onboarding.dressing_style.options.trendy') },
    { id: 'classical', label: t('onboarding.dressing_style.options.classical') },
    { id: 'business', label: t('onboarding.dressing_style.options.business') },
    { id: 'sporty', label: t('onboarding.dressing_style.options.sporty') }
  ];

  const handleSelect = (id) => {
    onChange(id);
    setTimeout(() => onNext(), 300);
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.fashion')}
      title={t('onboarding.dressing_style.title')}
      description={t('onboarding.dressing_style.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      showNext={false}
    >
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`py-6 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all border text-center ${
              value === option.id 
                ? 'bg-primary/20 border-primary shadow-[0_4px_20px_rgba(255,215,0,0.1)]' 
                : 'bg-background-warm border-divider hover:bg-ink/5'
            }`}
          >
            <span className={`text-base font-bold ${value === option.id ? 'text-primary' : 'text-slate-300'}`}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </StepLayout>
  );
};
