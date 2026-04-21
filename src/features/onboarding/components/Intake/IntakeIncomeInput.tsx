import React from 'react';
import { StepLayout } from '../StepLayout';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';

interface IntakeIncomeInputProps {
  name: string;
  onNext: () => void;
  onBack: () => void;
}

export const IntakeIncomeInput = ({ name, onNext, onBack }: IntakeIncomeInputProps) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();
  const value = useWatch({
    control,
    name
  });

  const incomes = [
    { key: 'below_10', label: t('intake.income.options.below_10') },
    { key: '10_20', label: t('intake.income.options.10_20') },
    { key: '20_40', label: t('intake.income.options.20_40') },
    { key: '40_80', label: t('intake.income.options.40_80') },
    { key: '80_150', label: t('intake.income.options.80_150') },
    { key: 'above_150', label: t('intake.income.options.above_150') }
  ];

  const handleSelect = (incomeKey: string) => {
    setValue(name, incomeKey, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <StepLayout
      subtitle={t('intake.steps.step_7')}
      title={t('intake.income.title')}
      description={t('intake.income.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      showNext={true}
      selectionMode="single"
      scrollable={false}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto overflow-x-visible px-2 custom-scrollbar pb-10 space-y-3">
          {incomes.map((income) => (
            <OptionButton
              key={income.key}
              label={income.label}
              selected={value === income.key}
              onClick={() => handleSelect(income.key)}
              icon="payments"
            />
          ))}
        </div>
      </div>
    </StepLayout>
  );
};
