import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from '../../../onboarding/components/StepLayout';
import { R2FreeText } from './R2FreeText';

export const R2BioInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2FreeText 
 
      title={t('matching.round2.bio.title')}
      description=""
      placeholder={t('matching.round2.bio.placeholder')} 
      maxLength={3000}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
      required
    />
  );
};

export const R2ThreeWordsInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  const data = value || ['', '', ''];
  const refs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const timer = setTimeout(() => { if (refs[0].current) refs[0].current.focus(); }, 500);
    return () => clearTimeout(timer);
  }, []);

  const update = (idx, val) => {
    const newData = [...data];
    newData[idx] = val;
    onChange(newData);
    // Auto-focus next input
    if (val && idx < 2 && val.includes(' ') === false) {
      // stay in current
    }
  };

  return (
    <StepLayout

      title={t('matching.round2.three_words.title')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!data[0] || !data[1] || !data[2]}
    >
      <div className="grid grid-cols-3 gap-2 pt-8 pb-10">
        {[0, 1, 2].map(i => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            placeholder={`W${i + 1}`}
            value={data[i]}
            onChange={(e) => update(i, e.target.value)}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Tab') { e.preventDefault(); if (i < 2) refs[i + 1].current?.focus(); }}}
            className={`min-w-0 w-full h-11 rounded-2xl bg-background-warm border text-center text-base font-bold transition-all focus:outline-none px-1 ${
              data[i] ? 'border-primary text-primary bg-primary/10' : 'border-divider text-ink placeholder:text-ink/20'
            }`}
          />
        ))}
      </div>
    </StepLayout>
  );
};

export const R2AnythingElseInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2FreeText 
 
      title={t('matching.round2.anything_else.title')}
      description=""
      placeholder={t('matching.round2.anything_else.placeholder')} 
      maxLength={2000}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
