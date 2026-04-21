import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const MBTIInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();

  const options = [
    'ISTJ', 'ISTP', 'ISFJ', 'ISFP',
    'INTJ', 'INTP', 'INFJ', 'INFP',
    'ESTJ', 'ESTP', 'ESFJ', 'ESFP',
    'ENTJ', 'ENTP', 'ENFJ', 'ENFP'
  ];

  const handleSelect = (opt) => {
    onChange(opt);
    setTimeout(() => onNext(), 300);
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.personality')}
      title={t('onboarding.mbti.title')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      showNext={false}
    >
      <div className="flex flex-col gap-8">
        <div className="bg-background-warm p-4 rounded-2xl border border-divider">
          <p className="text-ink/40 text-sm mb-2">{t('onboarding.mbti.dont_know')}</p>
          <a 
            href="https://www.16personalities.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary text-sm font-medium flex items-center gap-2 hover:underline"
          >
            {t('onboarding.mbti.take_test')} <span className="material-symbols-outlined text-xs">open_in_new</span>
          </a>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`py-4 rounded-xl transition-all border text-sm font-bold ${
                value === opt 
                  ? 'bg-primary border-primary text-background-dark' 
                  : 'bg-background-warm border-divider text-ink hover:bg-ink/5'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <button 
          onClick={() => { onChange('Skip'); setTimeout(() => onNext(), 300); }}
          className="w-full py-4 text-ink/40 hover:text-ink transition-colors text-sm uppercase tracking-widest font-bold"
        >
          {t('onboarding.mbti.skip')}
        </button>
      </div>
    </StepLayout>
  );
};

