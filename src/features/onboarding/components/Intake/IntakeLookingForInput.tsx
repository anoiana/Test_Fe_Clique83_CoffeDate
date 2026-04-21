import React from 'react';
import { StepLayout } from '../StepLayout';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { useTranslation } from 'react-i18next';
import { MultiSelectIndicator } from '../../../../shared/components/MultiSelectIndicator';
import { useFormContext, useWatch } from 'react-hook-form';

interface IntakeLookingForInputProps {
  name: string;
  onNext: () => void;
  onBack: () => void;
}

export const IntakeLookingForInput = ({ name, onNext, onBack }: IntakeLookingForInputProps) => {
  const { t, i18n } = useTranslation();
  const { setValue, control } = useFormContext();
  const value = useWatch({
    control,
    name
  }) || [];

  const intentions = [
    { id: 'marriage', label: t('intake.looking_for.options.marriage'), icon: 'favorite' },
    { id: 'serious', label: t('intake.looking_for.options.serious'), icon: 'local_library' },
    { id: 'dating', label: t('intake.looking_for.options.dating'), icon: 'wine_bar' },
    { id: 'partner', label: t('intake.looking_for.options.partner'), icon: 'handshake' },
    { id: 'friends', label: t('intake.looking_for.options.friends'), icon: 'people' }
  ];

  const handleToggle = (id: string) => {
    let newValue;
    if (value.includes(id)) {
      newValue = value.filter((v: string) => v !== id);
    } else {
      newValue = [...value, id];
    }

    setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
  };

  const selectedCount = value.filter((v: string) => intentions.some(opt => opt.id === v)).length;
  const nextDisabled = selectedCount < 1;

  const maxOptions = intentions.length;

  return (
    <StepLayout
      subtitle={t('intake.steps.step_8')}
      title={t('intake.looking_for.title')}
      description={t('intake.looking_for.description')}
      extraHeader={<MultiSelectIndicator currentCount={selectedCount} maxCount={maxOptions} minRequired={1} />}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={nextDisabled}
      showNext={true}
      nextLabel={t('common.continue')}
      scrollable={true}
      selectionMode="multiple"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          {intentions.map((opt) => (
            <OptionButton
              key={opt.id}
              label={opt.label}
              icon={opt.icon}
              selected={value.includes(opt.id)}
              onClick={() => handleToggle(opt.id)}
            />
          ))}
        </div>

        {/* Conditional Sub-question for Partner/Friends */}
        {(value.includes('partner') || value.includes('friends')) && (
          <div className="mt-8 pt-8 border-t border-divider/20 animate-ritual-fade-up">
            <p className="typo-ritual-body italic mb-4">
              {t('intake.looking_for.sub_question')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <OptionButton
                label={t('intake.looking_for.yes')}
                selected={useWatch({ control, name: 'openToSameGender' }) === true}
                onClick={() => setValue('openToSameGender', true)}
                className="justify-center"
              />
              <OptionButton
                label={t('intake.looking_for.no')}
                selected={useWatch({ control, name: 'openToSameGender' }) === false}
                onClick={() => setValue('openToSameGender', false)}
                className="justify-center"
              />
            </div>
          </div>
        )}
      </div>
    </StepLayout>
  );
};

