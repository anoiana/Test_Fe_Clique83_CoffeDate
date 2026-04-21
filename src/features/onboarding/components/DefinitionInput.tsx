import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const DefinitionInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();

  const options = [
    { id: 'vn_long', label: t('onboarding.definition.options.vn_long') },
    { id: 'vn_returned', label: t('onboarding.definition.options.vn_returned') },
    { id: 'vn_abroad_returning', label: t('onboarding.definition.options.vn_abroad_returning') },
    { id: 'vn_overseas', label: t('onboarding.definition.options.vn_overseas') },
    { id: 'vn_overseas_vietnam', label: t('onboarding.definition.options.vn_overseas_vietnam') },
    { id: 'foreigner_settled', label: t('onboarding.definition.options.foreigner_settled') },
    { id: 'foreigner_short_term', label: t('onboarding.definition.options.foreigner_short_term') }
  ];

  const handleSelect = (id) => {
    onChange(id);
    setTimeout(() => onNext(), 300);
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.who_are_you')}
      title={t('onboarding.definition.title')}
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
            <span className={`text-sm ${value === option.id ? 'text-primary font-bold tracking-tight' : 'text-slate-300'}`}>
              {option.label}
            </span>
            {value === option.id && (
              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-background-dark text-[10px] font-bold">check</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </StepLayout>
  );
};
