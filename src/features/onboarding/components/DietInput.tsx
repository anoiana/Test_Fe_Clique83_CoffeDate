import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const DietInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();

  const options = [
    { id: 'omnivore', label: t('onboarding.diet.options.omnivore'), sub: t('onboarding.diet.options.omnivore_sub') },
    { id: 'vegan', label: t('onboarding.diet.options.vegan'), sub: t('onboarding.diet.options.vegan_sub') }
  ];

  const handleSelect = (id) => {
    onChange(id);
    setTimeout(() => onNext(), 300);
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.nutrition')}
      title={t('onboarding.diet.title')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      showNext={false}
    >
      <div className="flex flex-col gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`w-full py-6 px-8 rounded-3xl transition-all border text-left flex flex-col ${
              value === opt.id 
                ? 'bg-primary/20 border-primary shadow-[0_4px_20px_rgba(255,215,0,0.1)]' 
                : 'bg-background-warm border-divider hover:bg-ink/5'
            }`}
          >
            <span className={`text-xl font-bold ${value === opt.id ? 'text-primary' : 'text-ink'}`}>{opt.label}</span>
            <span className="text-sm text-ink/40 mt-1">{opt.sub}</span>
          </button>
        ))}
      </div>
    </StepLayout>
  );
};
