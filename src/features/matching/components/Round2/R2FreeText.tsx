import React, { useRef, useEffect } from 'react';
import { StepLayout } from '../../../onboarding/components/StepLayout';
import { useTranslation } from 'react-i18next';

/**
 * Reusable Free Text input component for Round 2.
 */
interface R2FreeTextProps {
  title: string;
  description?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}

export const R2FreeText = ({ 
  title, description, value, onChange, onNext, onBack, 
  placeholder, maxLength = 2000, required = false
}: R2FreeTextProps) => {
  const { t } = useTranslation();
  const textareaRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textareaRef.current) textareaRef.current.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StepLayout
      title={title}
      description={description}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={false}
      showNext={true}
    >
      <div className="flex flex-col gap-3 pt-4 pb-10">
        <textarea
          ref={textareaRef}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t('matching.round2.common.type_here_placeholder')}
          maxLength={maxLength}
          rows={6}
          className="w-full p-6 rounded-2xl bg-background-warm border border-divider focus:border-primary/50 transition-all text-base text-ink placeholder:text-ink/20 focus:outline-none resize-none leading-relaxed"
        />
        <div className="flex justify-end">
          <span className={`text-[10px] font-bold tracking-widest uppercase ${
            (value?.length || 0) > maxLength * 0.9 ? 'text-red-400' : 'text-ink/20'
          }`}>
            {value?.length || 0} / {maxLength}
          </span>
        </div>
      </div>
    </StepLayout>
  );
};
