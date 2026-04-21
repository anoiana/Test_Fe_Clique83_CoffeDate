import React from 'react';
import { StepLayout } from '../StepLayout';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';

interface IntakeSourceInputProps {
  name: string;
  onNext: () => void;
  onBack: () => void;
}

export const IntakeSourceInput = ({ name, onNext, onBack }: IntakeSourceInputProps) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();
  const value = useWatch({
    control,
    name
  }) || [];
  
  const sources = [
    { key: 'tiktok', label: t('intake.source.options.tiktok') },
    { key: 'instagram', label: t('intake.source.options.instagram') },
    { key: 'facebook', label: t('intake.source.options.facebook') },
    { key: 'friends', label: t('intake.source.options.friends') },
    { key: 'press', label: t('intake.source.options.press') }
  ];

  // We consider "other" if there are any values that don't match the known keys
  const knownKeys = sources.map(s => s.key);
  const otherValues = Array.isArray(value) ? value.filter(v => !knownKeys.includes(v)) : [];
  const otherText = otherValues.length > 0 ? otherValues[0] : '';

  const handleToggle = (sourceKey: string) => {
    const current = Array.isArray(value) ? [...value] : [];
    const index = current.indexOf(sourceKey);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(sourceKey);
    }
    setValue(name, current, { shouldValidate: true, shouldDirty: true });
  };

  const handleOtherChange = (text: string) => {
    const current = Array.isArray(value) ? [...value] : [];
    const knownValues = current.filter(v => knownKeys.includes(v));
    
    if (text.trim()) {
      setValue(name, [...knownValues, text], { shouldValidate: true, shouldDirty: true });
    } else {
      setValue(name, knownValues, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <StepLayout
      subtitle={t('intake.steps.step_9')}
      title={t('intake.source.title')}
      description={t('intake.source.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value || value.length === 0}
      showNext={true}
      selectionMode="multiple"
      nextLabel={t('intake.source.finish_label')}
      scrollable={false}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto overflow-x-visible px-2 custom-scrollbar pb-10 space-y-3">
          {sources.map((source) => (
            <OptionButton
              key={source.key}
              label={source.label}
              selected={Array.isArray(value) && value.includes(source.key)}
              onClick={() => handleToggle(source.key)}
            />
          ))}
          
          <div className="pt-2">
            <h4 className="text-[10px] font-black tracking-widest text-ink/30 uppercase mb-2 ml-4">{t('intake.source.other_label')}</h4>
            <input
              type="text"
              placeholder={t('intake.source.other_placeholder')}
              value={otherText}
              onChange={(e) => handleOtherChange(e.target.value)}
              className={`w-full h-11 px-5 rounded-2xl bg-background-warm/60 border transition-all text-sm text-ink placeholder:text-ink/20 focus:outline-none ${
                otherText ? 'border-primary outline-none ring-1 ring-primary/20' : 'border-divider focus:border-ink/30'
              }`}
            />
          </div>
        </div>
      </div>
    </StepLayout>
  );
};
