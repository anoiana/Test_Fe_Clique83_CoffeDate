import React, { useRef, useEffect } from 'react';
import { StepLayout } from '../../../onboarding/components/StepLayout';
import { useTranslation } from 'react-i18next';

/**
 * Reusable Number Input component for Round 2.
 */
interface R2NumberInputProps {
  title: string;
  description?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  suffix?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export const R2NumberInput = ({ 
  title, description, value, onChange, onNext, onBack, 
  suffix = '', placeholder, min = 0, max = 999
}: R2NumberInputProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const effectivePlaceholder = placeholder || t('onboarding.number_input.placeholder');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val === '') { onChange(''); return; }
    const num = parseInt(val);
    if (num <= max) onChange(val);
  };

  return (
    <StepLayout
      title={title}
      description={description}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={false}
      showNext={true}
    >
      <div className="flex items-center gap-4 pt-12 border-b-2 border-divider focus-within:border-primary transition-all pb-3">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          placeholder={effectivePlaceholder}
          value={value}
          onChange={handleChange}
          className="flex-1 h-12 bg-transparent text-ink text-4xl font-light focus:outline-none focus:ring-0 transition-colors text-center placeholder:text-ink/15"
        />
        {suffix && (
          <span className="text-ink/30 text-xl font-light">{suffix}</span>
        )}
      </div>
    </StepLayout>
  );
};
