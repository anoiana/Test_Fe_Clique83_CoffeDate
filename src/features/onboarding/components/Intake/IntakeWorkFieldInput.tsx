import React, { useState } from 'react';
import { StepLayout } from '../StepLayout';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { Input } from '../../../../shared/components/Input';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';

interface IntakeWorkFieldInputProps {
  name: string;
  onNext: () => void;
  onBack: () => void;
}

export const IntakeWorkFieldInput = ({ name, onNext, onBack }: IntakeWorkFieldInputProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { setValue, control } = useFormContext();
  const value = useWatch({
    control,
    name
  });

  const options = [
    { key: 'accounting', label: t('intake.work_field.options.accounting') },
    { key: 'architecture', label: t('intake.work_field.options.architecture') },
    { key: 'arts', label: t('intake.work_field.options.arts') },
    { key: 'beauty', label: t('intake.work_field.options.beauty') },
    { key: 'sales', label: t('intake.work_field.options.sales') },
    { key: 'construction', label: t('intake.work_field.options.construction') },
    { key: 'consulting', label: t('intake.work_field.options.consulting') },
    { key: 'customer_service', label: t('intake.work_field.options.customer_service') },
    { key: 'education', label: t('intake.work_field.options.education') },
    { key: 'engineering', label: t('intake.work_field.options.engineering') },
    { key: 'entrepreneurship', label: t('intake.work_field.options.entrepreneurship') },
    { key: 'finance', label: t('intake.work_field.options.finance') },
    { key: 'government', label: t('intake.work_field.options.government') },
    { key: 'healthcare', label: t('intake.work_field.options.healthcare') },
    { key: 'hospitality', label: t('intake.work_field.options.hospitality') },
    { key: 'hr', label: t('intake.work_field.options.hr') },
    { key: 'insurance', label: t('intake.work_field.options.insurance') },
    { key: 'legal', label: t('intake.work_field.options.legal') },
    { key: 'logistics', label: t('intake.work_field.options.logistics') },
    { key: 'manufacturing', label: t('intake.work_field.options.manufacturing') },
    { key: 'marketing', label: t('intake.work_field.options.marketing') },
    { key: 'media', label: t('intake.work_field.options.media') },
    { key: 'ngo', label: t('intake.work_field.options.ngo') },
    { key: 'product', label: t('intake.work_field.options.product') },
    { key: 'research', label: t('intake.work_field.options.research') },
    { key: 'retail', label: t('intake.work_field.options.retail') },
    { key: 'tech', label: t('intake.work_field.options.tech') },
    { key: 'telecom', label: t('intake.work_field.options.telecom') },
    { key: 'transport', label: t('intake.work_field.options.transport') },
    { key: 'freelancer', label: t('intake.work_field.options.freelancer') },
    { key: 'student', label: t('intake.work_field.options.student') },
    { key: 'not_working', label: t('intake.work_field.options.not_working') },
    { key: 'other', label: t('intake.work_field.other_label') }
  ];

  const optionLabels = options.map(o => o.label);
  const isOther = value && !optionLabels.includes(value);
  const showOtherInput = value === t('intake.work_field.other_label') || isOther;

  const handleSelect = (fieldLabel: string) => {
    if (fieldLabel === t('intake.work_field.other_label')) {
      setValue(name, t('intake.work_field.other_label'), { shouldValidate: true, shouldDirty: true });
    } else {
      setValue(name, fieldLabel, { shouldValidate: true, shouldDirty: true });
    }
  };

  const filtered = options.filter(f => f.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <StepLayout
      subtitle={t('intake.steps.step_6')}
      title={t('intake.work_field.title')}
      description={t('intake.work_field.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value || value.trim().length === 0}
      showNext={true}
      scrollable={false}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="relative shrink-0">
          <Input
            prefix={<Search className="w-4 h-4 text-primary/40" />}
            type="text"
            placeholder={t('intake.work_field.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="[&_div.min-h-\[50px\]]:bg-background-warm/60"
          />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-visible px-4 pr-1 pb-4 custom-scrollbar space-y-2">
          {filtered.map((field) => (
            <OptionButton
              key={field.key}
              label={field.label}
              selected={value === field.label || (field.key === 'other' && showOtherInput)}
              onClick={() => handleSelect(field.label)}
            />
          ))}

          <div className="pt-2">
            <h4 className="text-[10px] font-black tracking-widest text-ink/30 uppercase mb-2 ml-4">{t('intake.work_field.other_label')}</h4>
            <Input
              autoFocus={value === t('intake.work_field.other_label')}
              placeholder={t('intake.work_field.other_placeholder')}
              value={value === t('intake.work_field.other_label') ? '' : value}
              onChange={(e) => setValue(name, e.target.value, { shouldValidate: true, shouldDirty: true })}
              className={isOther ? '[&_div.rounded-3xl]:border-primary [&_div.rounded-3xl]:ring-1 [&_div.rounded-3xl]:ring-primary/20' : ''}
            />
          </div>
        </div>
      </div>
    </StepLayout>
  );
};
