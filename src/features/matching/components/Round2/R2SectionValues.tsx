import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { OptionButton } from '../../../../shared/components/OptionButton';

interface R2SectionValuesProps {
  onNext: () => void;
  onBack: () => void;
}

export const R2SectionValues: React.FC<R2SectionValuesProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();

  const coreValues = useWatch({ control, name: 'coreValues' }) || [];
  const lifestylePreference = useWatch({ control, name: 'lifestylePreference' });
  const decisionStyle = useWatch({ control, name: 'decisionStyle' });

  const coreValueOptions = [
    { id: 'family', label: t('matching.round2.core_values.options.family') },
    { id: 'career', label: t('matching.round2.core_values.options.career') },
    { id: 'financial', label: t('matching.round2.core_values.options.financial') },
    { id: 'freedom', label: t('matching.round2.core_values.options.freedom') },
    { id: 'adventure', label: t('matching.round2.core_values.options.adventure') },
    { id: 'creativity', label: t('matching.round2.core_values.options.creativity') },
    { id: 'health', label: t('matching.round2.core_values.options.health') },
    { id: 'growth', label: t('matching.round2.core_values.options.growth') },
    { id: 'stability', label: t('matching.round2.core_values.options.stability') }
  ];

  const decisionOptions = [
    { id: 'logic', label: t('matching.round2.decision_style.options.logic') },
    { id: 'emotional', label: t('matching.round2.decision_style.options.emotional') },
    { id: 'balance', label: t('matching.round2.decision_style.options.balance') }
  ];

  const handleToggleValue = (id: string) => {
    let newValue;
    if (coreValues.includes(id)) {
      newValue = coreValues.filter((v: string) => v !== id);
    } else if (coreValues.length < 5) {
      newValue = [...coreValues, id];
    } else {
      return;
    }
    setValue('coreValues', newValue, { shouldValidate: true });
  };

  // Validation logic
  const isCoreValuesInvalid = !coreValues || coreValues.length === 0;
  const isLifestyleInvalid = !lifestylePreference || lifestylePreference === '';
  const isDecisionStyleInvalid = !decisionStyle;

  const errorsList: string[] = [];
  if (isCoreValuesInvalid) errorsList.push('group-core-values');
  if (isLifestyleInvalid) errorsList.push('group-lifestyle');
  if (isDecisionStyleInvalid) errorsList.push('group-decision-style');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={1}
      totalSteps={7}
      title={<>{t('matching.round2.sections.values.title_normal')} <span className="text-primary italic">{t('matching.round2.sections.values.title_highlight')}</span></>}
      description={t('matching.round2.sections.values.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        <SurveyFieldGroup 
          id="group-core-values"
          label={t('matching.round2.core_values.title')}
          selectionMode="multiple"
          maxSelection={5}
          error={isCoreValuesInvalid}
        >
          <div className="flex flex-wrap gap-2.5">
            {coreValueOptions.map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={coreValues.includes(opt.id)}
                onClick={() => handleToggleValue(opt.id)}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        <SurveyFieldGroup 
          id="group-lifestyle"
          label={t('matching.round2.lifestyle.title', 'Bạn là người sống theo kế hoạch hay thích sự ngẫu hứng?')}
          selectionNote={t('matching.round2.common.selection_note_slider')}
          error={isLifestyleInvalid}
        >
          <div className="w-full pt-8 pb-4">
             <div className="relative h-1.5 bg-background-warm rounded-full">
                <div 
                  className={`absolute h-full rounded-full transition-colors duration-300 ${lifestylePreference ? 'bg-primary' : 'bg-ink/10'}`}
                  style={{ width: `${((lifestylePreference || 3) - 1) * 25}%` }}
                />
                <input 
                  type="range" min="1" max="5" step="1"
                  value={lifestylePreference || 3}
                  onChange={(e) => setValue('lifestylePreference', parseInt(e.target.value), { shouldValidate: true })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-background-paper rounded-full shadow-lg pointer-events-none transition-colors duration-300 ${lifestylePreference ? 'bg-primary' : 'bg-ink/20'}`}
                  style={{ left: `${((lifestylePreference || 3) - 1) * 25}%`, marginLeft: '-12px' }}
                />
             </div>
             <div className="flex justify-between mt-6 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{t('matching.round2.lifestyle.min_label')}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{t('matching.round2.lifestyle.max_label')}</span>
             </div>
          </div>
        </SurveyFieldGroup>

        <SurveyFieldGroup 
          id="group-decision-style"
          label={t('matching.round2.decision_style.title')}
          selectionMode="single"
          error={isDecisionStyleInvalid}
        >
          <div className="flex flex-wrap gap-2.5">
            {decisionOptions.map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={decisionStyle === opt.id}
                onClick={() => setValue('decisionStyle', opt.id, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>
      </div>
    </GroupedStepLayout>
  );
};
