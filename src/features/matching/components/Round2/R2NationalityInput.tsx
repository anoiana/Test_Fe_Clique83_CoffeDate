import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from '../../../onboarding/components/StepLayout';
import { Input } from '../../../../shared/components/Input';

export const R2NationalityInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus after animation completes
    const timer = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value?.trim()) {
      onNext();
    }
  };

  return (
    <StepLayout 

      title={t('matching.round2.nationality.title')}
      onNext={onNext} 
      onBack={onBack} 
      nextDisabled={!value?.trim()}
      showNext={!!value?.trim()}
    >
      <div className="pt-8 animate-in slide-in-from-bottom-4 duration-500">
        <Input
          ref={inputRef}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('matching.round2.common.type_here_placeholder')}
          className="w-full"
        />
        <p className="mt-4 text-[10px] text-ink/20 uppercase tracking-[0.2em] font-bold ml-2">
          {t('matching.round2.common.specify_placeholder')}
        </p>
      </div>
    </StepLayout>
  );
};
