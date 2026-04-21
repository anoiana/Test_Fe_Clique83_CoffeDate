import React from 'react';
import { StepLayout } from '../StepLayout';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { Input } from '../../../../shared/components/Input';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';

export const IntakeTargetGenderInput = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  const options = [
    { id: 'men', label: t('intake.target_gender.options.men') },
    { id: 'women', label: t('intake.target_gender.options.women') },
    { id: 'other', label: t('intake.target_gender.options.other') }
  ];

  return (
    <Controller
      name="targetGenders"
      control={control}
      render={({ field: { value = [], onChange } }) => {
        const currentValue = value[0] || '';
        // Check if currentValue is one of our stable keys
        const isKnownKey = options.some(opt => opt.id === currentValue);
        const isOther = currentValue !== '' && !isKnownKey;
        const showOtherInput = currentValue === 'other' || isOther;

        const handleSelect = (optionId: string) => {
          if (optionId === 'other') {
            onChange(['other']);
          } else {
            onChange([optionId]);
          }
        };

        return (
          <StepLayout
            subtitle={t('intake.steps.step_2')}
            title={t('intake.target_gender.title')}
            description={t('intake.target_gender.description')}
            onNext={onNext}
            onBack={onBack}
            nextDisabled={!currentValue || currentValue === 'other'}
            showNext={true}
            nextLabel={t('common.continue')}
            scrollable={true}
            selectionMode="single"
          >
            <div className="space-y-3">
              {options.map((option) => (
                <OptionButton
                  key={option.id}
                  label={option.label}
                  selected={currentValue === option.id || (option.id === 'other' && showOtherInput)}
                  onClick={() => handleSelect(option.id)}
                />
              ))}

              {showOtherInput && (
                <div className="pt-2 pb-6">
                  <Input
                    autoFocus
                    placeholder={t('intake.target_gender.other_placeholder')}
                    value={currentValue === 'other' ? '' : currentValue}
                    onChange={(e) => onChange([e.target.value])}
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
