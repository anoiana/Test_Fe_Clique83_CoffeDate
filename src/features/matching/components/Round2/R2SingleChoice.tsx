import React from 'react';
import { StepLayout } from '../../../onboarding/components/StepLayout';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { useTranslation } from 'react-i18next';

/**
 * Reusable Single Choice component for Round 2.
 * User must press Continue to advance.
 * Supports optional "Other" input.
 */
interface R2SingleChoiceProps {
  title: string;
  description?: React.ReactNode;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  showOther?: boolean;
  otherLabel?: string;
}

export const R2SingleChoice = ({ 
  title, description = '', options, value, onChange, onNext, onBack, 
  showOther = false, otherLabel
}: R2SingleChoiceProps) => {
  const { t } = useTranslation();
  const effectiveOtherLabel = otherLabel || t('matching.round2.common.other');
  
  const isOther = value && !options.includes(value) && value !== effectiveOtherLabel;
  const showOtherInput = showOther && (value === effectiveOtherLabel || isOther);

  const handleSelect = (option: string) => {
    if (showOther && option === effectiveOtherLabel) {
      onChange(effectiveOtherLabel);
    } else {
      onChange(option);
    }
  };

  return (
    <StepLayout
      title={title}
      description={description}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={false}
      showNext={true}
      scrollable={true}
      selectionMode="single"
    >
      <div className="space-y-3">
        {options.map((option) => (
          <OptionButton
            key={option}
            label={option}
            selected={value === option}
            onClick={() => handleSelect(option)}
          />
        ))}

        {showOther && (
          <OptionButton
            label={effectiveOtherLabel}
            selected={value === effectiveOtherLabel || isOther}
            onClick={() => handleSelect(effectiveOtherLabel)}
          />
        )}

        {showOtherInput && (
          <div className="pt-2 pb-4">
            <input
              autoFocus
              type="text"
              placeholder={t('matching.round2.common.specify_placeholder')}
              value={value === effectiveOtherLabel ? '' : value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-12 px-5 rounded-2xl bg-background-warm/60 border border-primary/40 focus:border-primary transition-all text-sm text-ink placeholder:text-ink/20 focus:outline-none"
            />
          </div>
        )}
      </div>
    </StepLayout>
  );
};
