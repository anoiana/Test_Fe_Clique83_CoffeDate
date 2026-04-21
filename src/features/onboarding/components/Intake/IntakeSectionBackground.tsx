import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { Input } from '../../../../shared/components/Input';
import { Search, Plus } from 'lucide-react';
import { FormError } from '../../../../shared/components/FormError';

interface IntakeSectionBackgroundProps {
  onNext: () => void;
  onBack: () => void;
}

export const IntakeSectionBackground: React.FC<IntakeSectionBackgroundProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control, watch, register, formState: { errors } } = useFormContext();
  const [workSearch, setWorkSearch] = useState('');

  const workFieldValue = useWatch({ control, name: 'workField' });
  const incomeValue = useWatch({ control, name: 'income' });
  const lookingForValue = useWatch({ control, name: 'lookingFor' }) || [];
  const sourceValue = useWatch({ control, name: 'source' }) || [];
  const sourceOtherValue = watch('source_other');

  const workFieldOptions = [
    { key: 'tech', label: t('intake.work_field.options.tech') },
    { key: 'finance', label: t('intake.work_field.options.finance') },
    { key: 'entrepreneurship', label: t('intake.work_field.options.entrepreneurship') },
    { key: 'construction', label: t('intake.work_field.options.construction') },
    { key: 'engineering', label: t('intake.work_field.options.engineering') },
    { key: 'sales', label: t('intake.work_field.options.sales') },
    { key: 'transport', label: t('intake.work_field.options.transport') },
    { key: 'logistics', label: t('intake.work_field.options.logistics') },
    { key: 'consulting', label: t('intake.work_field.options.consulting') },
    { key: 'real_estate', label: t('intake.work_field.options.real_estate') }, 
    { key: 'accounting', label: t('intake.work_field.options.accounting') },
    { key: 'architecture', label: t('intake.work_field.options.architecture') },
    { key: 'arts', label: t('intake.work_field.options.arts') },
    { key: 'beauty', label: t('intake.work_field.options.beauty') },
    { key: 'customer_service', label: t('intake.work_field.options.customer_service') },
    { key: 'education', label: t('intake.work_field.options.education') },
    { key: 'government', label: t('intake.work_field.options.government') },
    { key: 'healthcare', label: t('intake.work_field.options.healthcare') },
    { key: 'hospitality', label: t('intake.work_field.options.hospitality') },
    { key: 'hr', label: t('intake.work_field.options.hr') },
    { key: 'insurance', label: t('intake.work_field.options.insurance') },
    { key: 'legal', label: t('intake.work_field.options.legal') },
    { key: 'manufacturing', label: t('intake.work_field.options.manufacturing') },
    { key: 'marketing', label: t('intake.work_field.options.marketing') },
    { key: 'media', label: t('intake.work_field.options.media') },
    { key: 'ngo', label: t('intake.work_field.options.ngo') },
    { key: 'product', label: t('intake.work_field.options.product') },
    { key: 'research', label: t('intake.work_field.options.research') },
    { key: 'retail', label: t('intake.work_field.options.retail') },
    { key: 'telecom', label: t('intake.work_field.options.telecom') },
    { key: 'freelancer', label: t('intake.work_field.options.freelancer') },
    { key: 'student', label: t('intake.work_field.options.student') },
    { key: 'not_working', label: t('intake.work_field.options.not_working') }
  ];

  const incomeOptions = [
    { key: 'below_10', label: t('intake.income.options.below_10') },
    { key: '10_20', label: t('intake.income.options.10_20') },
    { key: '20_40', label: t('intake.income.options.20_40') },
    { key: '40_80', label: t('intake.income.options.40_80') },
    { key: '80_150', label: t('intake.income.options.80_150') },
    { key: 'above_150', label: t('intake.income.options.above_150') }
  ];

  const lookingForOptions = [
    { id: 'marriage', label: t('intake.looking_for.options.marriage') },
    { id: 'serious', label: t('intake.looking_for.options.serious') },
    { id: 'dating', label: t('intake.looking_for.options.dating') },
    { id: 'partner', label: t('intake.looking_for.options.partner') },
    { id: 'friends', label: t('intake.looking_for.options.friends') }
  ];

  const sourceOptions = [
    { id: 'tiktok', label: t('intake.source.options.tiktok') },
    { id: 'instagram', label: t('intake.source.options.instagram') },
    { id: 'facebook', label: t('intake.source.options.facebook') },
    { id: 'friends', label: t('intake.source.options.friends') },
    { id: 'press', label: t('intake.source.options.press') }
  ];

  const handleToggleLookingFor = (id: string) => {
    const current = [...lookingForValue];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setValue('lookingFor', current, { shouldValidate: true });
  };

  const handleToggleSource = (id: string) => {
    const current = Array.isArray(sourceValue) ? [...sourceValue] : [];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setValue('source', current, { shouldValidate: true });
  };

  // Validation logic for error highlighting and auto-scroll
  const isWorkFieldError = !workFieldValue;
  const isIncomeError = !incomeValue;
  const isLookingForError = !lookingForValue || lookingForValue.length < 3;
  const isSourceError = !sourceValue || sourceValue.length === 0 || (sourceValue.includes('other') && !sourceOtherValue);

  const errorsList: string[] = [];
  if (isWorkFieldError) errorsList.push('group-work-field');
  if (isIncomeError) errorsList.push('group-income');
  if (isLookingForError) errorsList.push('group-looking-for');
  if (isSourceError) errorsList.push('group-source');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={3}
      totalSteps={3}
      title={t('intake.sections.background.title_1') || t('intake.sections.background.title_2') ? (
        <><span className="text-primary italic">{t('intake.sections.background.title_1')}</span> {t('intake.sections.background.title_2')}</>
      ) : undefined}
      description={t('intake.sections.background.description') || undefined}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        {/* Work Field */}
        <SurveyFieldGroup
          id="group-work-field"
          label={t('intake.work_field.title')}
          selectionMode="single"
          error={isWorkFieldError}
        >
          <div className="w-full space-y-4 text-left">
            <input type="hidden" {...register('workField', { required: 'REQUIRED_FIELD' })} />
            <div className="space-y-6">
              {/* Suggested Quick Picks */}
              <div className="flex flex-wrap gap-2.5">
                {workFieldOptions.slice(0, 6).map((opt) => (
                  <OptionButton
                    key={opt.key}
                    label={opt.label}
                    selected={workFieldValue === opt.key}
                    onClick={() => {
                      setValue('workField', opt.key, { shouldValidate: true });
                      setWorkSearch('');
                    }}
                    size="sm"
                    className="!px-5 !py-2.5"
                  />
                ))}
              </div>

              {/* Smart Search Field */}
              <div className="relative">
                <Input
                  prefix={<Search className="w-4 h-4 text-primary/40" />}
                  type="text"
                  value={workSearch}
                  onChange={(e) => setWorkSearch(e.target.value)}
                  placeholder={t('intake.work_field.search_placeholder')}
                  className="[&_input]:italic [&_input]:font-serif [&_div.min-h-\[50px\]]:bg-background-warm/30"
                />

                {/* Search Results Dropdown */}
                {workSearch && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-background-paper border border-divider rounded-3xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {workFieldOptions
                        .filter(opt =>
                          opt.label.toLowerCase().includes(workSearch.toLowerCase())
                        )
                        .map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => {
                              setValue('workField', opt.key, { shouldValidate: true });
                              setWorkSearch('');
                            }}
                            className="w-full px-5 py-3.5 text-left hover:bg-primary/5 transition-colors border-b border-divider/40 last:border-0 flex items-center gap-3"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${workFieldValue === opt.key ? 'bg-primary' : 'bg-divider'}`} />
                            <span className={`text-sm ${workFieldValue === opt.key ? 'text-primary font-bold' : 'text-ink'}`}>
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      {/* Allow Custom 'Other' Input */}
                      <button
                        type="button"
                        onClick={() => {
                          setValue('workField', 'other', { shouldValidate: true });
                          setValue('work_field_other', workSearch);
                          setWorkSearch('');
                        }}
                        className="w-full px-5 py-3.5 text-left hover:bg-primary/5 transition-colors flex items-center gap-3 text-primary italic font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">{t('intake.work_field.use_search_term', { term: workSearch })}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Indicator (if not in suggested) */}
              {workFieldValue && !workFieldOptions.slice(0, 6).some(o => o.key === workFieldValue) && (
                <div className="flex animate-in fade-in zoom-in duration-300">
                  <OptionButton
                    label={workFieldOptions.find(o => o.key === workFieldValue)?.label || watch('work_field_other')}
                    selected={true}
                    onClick={() => setValue('workField', '', { shouldValidate: true })}
                    size="sm"
                    className="!border-primary/50 shadow-sm"
                  />
                </div>
              )}
            </div>
            <FormError error={errors.workField?.message as string} />
          </div>
        </SurveyFieldGroup>


        <SurveyFieldGroup
          id="group-income"
          label={t('intake.income.title')}
          selectionMode="single"
          error={isIncomeError}
        >
          <div className="flex flex-wrap gap-3">
            <input type="hidden" {...register('income', { required: 'REQUIRED_FIELD' })} />
            {incomeOptions.map((opt) => (
              <OptionButton
                key={opt.key}
                label={opt.label}
                selected={incomeValue === opt.key}
                onClick={() => setValue('income', opt.key, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
          <FormError error={errors.income?.message as string} />
        </SurveyFieldGroup>

        <SurveyFieldGroup
          id="group-looking-for"
          label={t('intake.looking_for.title')}
          selectionMode="multiple"
          selectionNote={t('intake.looking_for.selection_note')}
          error={isLookingForError}
        >
          <div className="w-full space-y-6 text-left">
            <div className="flex flex-wrap gap-3">
              <input type="hidden" {...register('lookingFor', {
                validate: (v) => (v && v.length >= 3) || 'MIN_3_REQUIRED'
              })} />
              {lookingForOptions.map((opt) => (
                <OptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={lookingForValue.includes(opt.id)}
                  onClick={() => handleToggleLookingFor(opt.id)}
                  size="sm"
                />
              ))}
            </div>

            {/* Conditional Sub-question for Partner/Friends */}
            {(lookingForValue.includes('partner') || lookingForValue.includes('friends')) && (
              <div className="mt-4 pt-6 border-t border-divider/20 animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="text-[14px] text-ink font-serif italic mb-4 leading-relaxed">
                  {t('intake.looking_for.sub_question')}
                </p>
                <div className="flex gap-3">
                  <OptionButton
                    label={t('intake.looking_for.yes')}
                    selected={watch('openToSameGender') === true}
                    onClick={() => setValue('openToSameGender', true)}
                    size="sm"
                    className="flex-1 sm:flex-none justify-center"
                  />
                  <OptionButton
                    label={t('intake.looking_for.no')}
                    selected={watch('openToSameGender') === false}
                    onClick={() => setValue('openToSameGender', false)}
                    size="sm"
                    className="flex-1 sm:flex-none justify-center"
                  />
                </div>
              </div>
            )}
          </div>
          <FormError error={errors.lookingFor?.message as string} />
        </SurveyFieldGroup>

        {/* Source */}
        <SurveyFieldGroup
          id="group-source"
          label={t('intake.source.title')}
          selectionMode="multiple"
          error={isSourceError}
        >
          <div className="w-full space-y-4 text-left">
            <input type="hidden" {...register('source', {
              validate: (v) => (v && v.length > 0) || 'REQUIRED_FIELD'
            })} />
            <div className="flex flex-wrap gap-3">
              {sourceOptions.map((opt) => (
                <OptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={sourceValue.includes(opt.id)}
                  onClick={() => handleToggleSource(opt.id)}
                  size="sm"
                />
              ))}
              <OptionButton
                label={t('intake.source.other_label')}
                selected={sourceValue.includes('other')}
                onClick={() => handleToggleSource('other')}
                size="sm"
              />
            </div>
            {sourceValue.includes('other') && (
              <div className="mt-4">
                <Input
                  placeholder={t('intake.source.other_placeholder')}
                  value={sourceOtherValue || ''}
                  onChange={(e) => setValue('source_other', e.target.value, { shouldValidate: true })}
                  className={`[&_div.min-h-\[50px\]]:bg-background-warm/60 ${isSourceError && sourceValue.includes('other') && !sourceOtherValue ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                />
              </div>
            )}
            <FormError error={errors.source?.message as string} />
          </div>
        </SurveyFieldGroup>
      </div>
    </GroupedStepLayout>
  );
};
