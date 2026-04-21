import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const MultiSelectionInput = ({ value = [], onChange, onNext, onBack, title, subtitle, options }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const otherItem = value.find(v => typeof v === 'string' && v.startsWith('OTHER:'));
  const isOtherSelected = !!otherItem;
  const otherValue = isOtherSelected ? otherItem.split('OTHER:')[1] : '';

  useEffect(() => {
    if (isOtherSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOtherSelected]);

  const toggle = (id) => {
    let newVal;
    if (id === 'other') {
      if (isOtherSelected) {
        newVal = value.filter(v => typeof v === 'string' && !v.startsWith('OTHER:'));
      } else {
        newVal = [...value, 'OTHER:'];
      }
    } else {
      newVal = value.includes(id) ? value.filter(v => v !== id) : [...value, id];
    }
    onChange(newVal);
  };

  const handleOtherChange = (text) => {
    const newVal = value.map(v => (typeof v === 'string' && v.startsWith('OTHER:')) ? `OTHER:${text}` : v);
    onChange(newVal);
  };

  const isContinueDisabled = value.length === 0 || (isOtherSelected && otherValue.trim() === '' && value.length === 1);

  return (
    <StepLayout
      subtitle={subtitle}
      title={title}
      description={t('onboarding.multi_selection.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isContinueDisabled}
    >
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <div key={opt.id} className="flex flex-col gap-2">
            <button
              onClick={() => toggle(opt.id)}
              className={`w-full py-5 px-6 rounded-2xl flex items-center justify-between transition-all border text-left ${
                (value.includes(opt.id) || (opt.id === 'other' && isOtherSelected)) ? 'bg-primary/20 border-primary shadow-[0_4px_15px_rgba(255,215,0,0.1)]' : 'bg-background-warm border-divider hover:bg-ink/5'
              }`}
            >
              <span className={`text-lg ${(value.includes(opt.id) || (opt.id === 'other' && isOtherSelected)) ? 'text-primary font-bold' : 'text-slate-300'}`}>{opt.label}</span>
              {(value.includes(opt.id) || (opt.id === 'other' && isOtherSelected)) && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-background-dark text-xs font-bold">check</span></div>}
            </button>
            
            {opt.id === 'other' && isOtherSelected && (
              <div className="px-2 animate-in slide-in-from-top-2 fade-in duration-300">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('onboarding.multi_selection.specify_placeholder')}
                  value={otherValue}
                  onChange={(e) => handleOtherChange(e.target.value)}
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
