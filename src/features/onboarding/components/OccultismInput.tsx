import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const OccultismInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  const options = [
    { id: 'tuvi', label: t('onboarding.occultism.options.tuvi') },
    { id: 'numerology', label: t('onboarding.occultism.options.numerology') },
    { id: 'sun_sign', label: t('onboarding.occultism.options.sun_sign') },
    { id: 'astrology', label: t('onboarding.occultism.options.astrology') },
    { id: 'none', label: t('onboarding.occultism.options.none') },
    { id: 'other', label: t('onboarding.occultism.options.other') }
  ];

  const inputRef = useRef(null);
  const isOtherSelected = value?.startsWith('OTHER:');
  const otherValue = isOtherSelected ? value.split('OTHER:')[1] : '';

  useEffect(() => {
    if (isOtherSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOtherSelected]);

  const handleOptionClick = (id) => {
    if (id === 'other') {
      onChange('OTHER:');
    } else {
      onChange(id);
      setTimeout(() => onNext(), 300);
    }
  };

  const isNextDisabled = !value || (isOtherSelected && !otherValue.trim());

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.beliefs')}
      title={t('onboarding.occultism.title')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      showNext={isOtherSelected}
    >
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <div key={option.id} className="flex flex-col gap-2">
            <button
              onClick={() => handleOptionClick(option.id)}
              className={`w-full py-5 px-6 rounded-2xl flex items-center justify-between transition-all border text-left ${
                (value === option.id || (option.id === 'other' && isOtherSelected))
                  ? 'bg-primary/20 border-primary shadow-[0_4px_20px_rgba(255,215,0,0.1)]' 
                  : 'bg-background-warm border-divider hover:bg-ink/5'
              }`}
            >
              <span className={`text-lg ${(value === option.id || (option.id === 'other' && isOtherSelected)) ? 'text-primary font-bold' : 'text-slate-300'}`}>
                {option.label}
              </span>
              {(value === option.id || (option.id === 'other' && isOtherSelected)) && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-background-dark text-sm font-bold">star</span>
                </div>
              )}
            </button>
            
            {option.id === 'other' && isOtherSelected && (
              <div className="px-2 animate-in slide-in-from-top-2 fade-in duration-300">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('onboarding.multi_selection.specify_placeholder')}
                  value={otherValue}
                  onChange={(e) => onChange(`OTHER:${e.target.value}`)}
                  className="w-full bg-background-warm border-b border-primary/40 focus:border-primary p-3 text-ink text-base font-light placeholder:text-slate-800 focus:outline-none transition-all rounded-t-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </StepLayout>
  );
};
