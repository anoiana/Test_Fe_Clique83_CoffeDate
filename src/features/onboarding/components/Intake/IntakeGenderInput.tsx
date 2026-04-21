import React from 'react';
import { StepLayout } from '../StepLayout';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { Input } from '../../../../shared/components/Input';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';

export const IntakeGenderInput = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  const options = [
    { id: 'male', label: t('intake.gender.options.male') },
    { id: 'female', label: t('intake.gender.options.female') },
    { id: 'other', label: t('intake.gender.options.other') }
  ];
// hihi
  return (
    <Controller
      name="gender"
      control={control}
      render={({ field: { value, onChange } }) => {
        // Check if current value is one of our standard keys
        const isStandardOption = ['male', 'female', 'other'].includes(value);
        // If it's not a standard key and not empty, it's a custom 'other' value
        const isCustomValue = value && !isStandardOption;
        const showOtherInput = value === 'other' || isCustomValue;

        const handleSelect = (optionId) => {
          onChange(optionId);
        };

        return (
          <StepLayout
            title={t('intake.gender.title')}
            description={t('intake.gender.description')}
            onNext={onNext}
            onBack={onBack}
            nextDisabled={!value || value === 'other'}
            showNext={true}
            scrollable={true}
            selectionMode="single"
          >
            <div className="flex flex-wrap gap-3">
              {options.map((option) => (
                <OptionButton
                  key={option.id}
                  label={option.label}
                  selected={value === option.id || (option.id === 'other' && isCustomValue)}
                  onClick={() => handleSelect(option.id)}
                />
              ))}

              {showOtherInput && (
                <div className="pt-2 pb-6">
                  <Input
                    autoFocus
                    placeholder={t('intake.gender.other_placeholder')}
                    value={isCustomValue ? value : ''}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </div>
              )}

            </div>
          </StepLayout>
        );
      }}
    />
  );
};
