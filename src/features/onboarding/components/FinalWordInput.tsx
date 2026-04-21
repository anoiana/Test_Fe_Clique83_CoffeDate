import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const FinalWordInput = ({ value = [], onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  const options = [
    { id: 'sociable', label: t('onboarding.final_word.options.sociable') },
    { id: 'quiet', label: t('onboarding.final_word.options.quiet') },
    { id: 'funny', label: t('onboarding.final_word.options.funny') },
    { id: 'interesting', label: t('onboarding.final_word.options.interesting') },
    { id: 'curious', label: t('onboarding.final_word.options.curious') },
    { id: 'kind', label: t('onboarding.final_word.options.kind') },
    { id: 'sincere', label: t('onboarding.final_word.options.sincere') },
    { id: 'passionate', label: t('onboarding.final_word.options.passionate') },
    { id: 'hardworking', label: t('onboarding.final_word.options.hardworking') },
    { id: 'strong', label: t('onboarding.final_word.options.strong') },
    { id: 'confident', label: t('onboarding.final_word.options.confident') },
    { id: 'sensitive', label: t('onboarding.final_word.options.sensitive') },
    { id: 'creative', label: t('onboarding.final_word.options.creative') },
    { id: 'understanding', label: t('onboarding.final_word.options.understanding') },
    { id: 'optimistic', label: t('onboarding.final_word.options.optimistic') },
    { id: 'introvert', label: t('onboarding.final_word.options.introvert') }
  ];

  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      if (value.length < 3) {
        onChange([...value, id]);
      }
    }
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.identity')}
      title={t('onboarding.final_word.title')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={value.length < 3}
      scrollable={false}
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between shrink-0">
          <span className="text-ink/40 text-xs uppercase tracking-widest font-bold">
            {value.length === 3 
              ? t('onboarding.final_word.perfect') 
              : t('onboarding.final_word.choose_more', { count: 3 - value.length })}
          </span>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-4 h-1 rounded-full transition-all ${
                  i <= value.length ? 'bg-primary' : 'bg-ink/5'
                }`} 
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => toggle(opt.id)}
              disabled={!value.includes(opt.id) && value.length >= 3}
              className={`py-4 px-4 rounded-2xl border transition-all text-sm text-center ${
                value.includes(opt.id) 
                  ? 'bg-primary/20 border-primary text-primary font-bold shadow-[0_4px_15px_rgba(255,215,0,0.1)]' 
                  : 'bg-background-warm border-divider text-ink/40 hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-transparent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </StepLayout>
  );
};
