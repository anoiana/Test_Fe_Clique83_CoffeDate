import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const ChildrenInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();

  const options = [
    { id: 'yes', label: t('onboarding.children.options.yes') },
    { id: 'no', label: t('onboarding.children.options.no') },
    { id: 'none_and_no_plans', label: t('onboarding.children.options.none_and_no_plans') }
  ];

  const handleSelect = (id) => {
    onChange(id);
    setTimeout(() => onNext(), 300);
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.family')}
      title={t('onboarding.children.title')}
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
            className={`w-full py-5 px-6 rounded-2xl transition-all border text-left ${
              value === option.id 
                ? 'bg-primary/20 border-primary shadow-[0_4px_15px_rgba(255,215,0,0.1)]' 
                : 'bg-background-warm border-divider hover:bg-ink/5'
            }`}
          >
            <span className={`text-lg ${value === option.id ? 'text-primary font-bold' : 'text-slate-300'}`}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </StepLayout>
  );
};
