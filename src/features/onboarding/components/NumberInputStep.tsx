import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const NumberInputStep = ({ value, onChange, onNext, onBack, title, subtitle, label, placeholder }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StepLayout
      subtitle={subtitle}
      title={title}
      description={label}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      scrollable={false}
    >
      <div className="relative pt-10">
        <input
          ref={inputRef}
          type="number"
          autoFocus
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={placeholder || t('onboarding.number_input.placeholder')}
          value={value}
          onKeyDown={(e) => {
            if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            onChange(val);
          }}
          className="w-full h-20 bg-transparent border-b-2 border-primary/40 focus:border-primary px-0 text-ink text-6xl font-light placeholder:text-slate-800 focus:outline-none focus:ring-0 transition-colors"
        />
      </div>
    </StepLayout>
  );
};
