import React from 'react';
import { StepLayout } from '../StepLayout';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { Input } from '../../../../shared/components/Input';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';

interface IntakeEducationInputProps {
  name: string;
  onNext: () => void;
  onBack: () => void;
}

export const IntakeEducationInput = ({ name, onNext, onBack }: IntakeEducationInputProps) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();
  const value = useWatch({
    control,
    name
  });
  
  const options = [
    { key: 'secondary', label: t('intake.education.options.secondary') },
    { key: 'highschool', label: t('intake.education.options.highschool') },
    { key: 'associate', label: t('intake.education.options.associate') },
    { key: 'bachelor', label: t('intake.education.options.bachelor') },
    { key: 'master', label: t('intake.education.options.master') },
    { key: 'phd', label: t('intake.education.options.phd') },
    { key: 'other', label: t('intake.education.options.other') }
  ];

  const isKnownKey = options.some(opt => opt.key === value);
  const isOther = value !== '' && value !== undefined && !isKnownKey;
  const showOtherInput = value === 'other' || isOther;

  const handleSelect = (optionKey: string) => {
    if (optionKey === 'other') {
        setValue(name, 'other', { shouldValidate: true, shouldDirty: true });
    } else {
        setValue(name, optionKey, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <StepLayout
      subtitle={t('intake.steps.step_5')}
      title={t('intake.education.title')}
      description={t('intake.education.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value || value === 'other'}
      showNext={true}
      scrollable={false}
      selectionMode="single"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto overflow-x-visible px-2 custom-scrollbar pb-10 flex flex-wrap gap-3">
          {options.map((option) => (
            <OptionButton
              key={option.key}
              label={option.label}
              selected={value === option.key || (option.key === 'other' && showOtherInput)}
              onClick={() => handleSelect(option.key)}
              icon="school"
            />
          ))}

          {showOtherInput && (
            <div className="pt-2">
              <Input
                autoFocus
                placeholder={t('intake.education.other_placeholder')}
                value={value === 'other' ? '' : value}
                onChange={(e) => setValue(name, e.target.value, { shouldValidate: true, shouldDirty: true })}
                className={isOther ? '[&_div.rounded-3xl]:border-primary [&_div.rounded-3xl]:ring-1 [&_div.rounded-3xl]:ring-primary/20' : ''}
              />
            </div>
          )}

        </div>
      </div>
    </StepLayout>
  );
};
