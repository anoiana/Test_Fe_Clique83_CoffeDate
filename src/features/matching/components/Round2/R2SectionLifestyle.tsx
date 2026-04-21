import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout, useStepValidation } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';

interface R2SectionLifestyleProps {
  onNext: () => void;
  onBack: () => void;
}

export const R2SectionLifestyle: React.FC<R2SectionLifestyleProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();
  const { showErrors } = useStepValidation();

  const physicalActivity = useWatch({ control, name: 'physicalActivity' });
  const rawHeight = useWatch({ control, name: 'height' });
  const height = rawHeight || '';

  // Validation logic
  const errorsList: string[] = [];

  const isPhysicalActivityInvalid = !physicalActivity;
  if (isPhysicalActivityInvalid) errorsList.push('group-physical-activity');
 
  const isHeightInvalid = !rawHeight || rawHeight < 130 || rawHeight > 220;
  if (isHeightInvalid) errorsList.push('group-height');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={4}
      totalSteps={7}
      title={<><span className="text-primary italic">{t('matching.round2.sections.lifestyle.title_highlight')}</span> {t('matching.round2.sections.lifestyle.title_normal')}</>}
      description={t('matching.round2.sections.lifestyle.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        {/* Q9: Fitness Level (Slider) */}
        <SurveyFieldGroup
          id="group-physical-activity"
          label={t('matching.round2.physical_activity.title', 'Mức độ vận động của bạn?')}
          selectionNote={t('matching.round2.common.selection_note_slider')}
          error={isPhysicalActivityInvalid}
        >
          <div className="w-full pt-8 pb-4">
            <div className="relative h-1.5 bg-background-warm rounded-full">
              <div
                className={`absolute h-full rounded-full transition-colors duration-300 ${physicalActivity ? 'bg-primary' : 'bg-ink/10'}`}
                style={{ width: `${((physicalActivity || 3) - 1) * 25}%` }}
              />
              <input
                type="range" min="1" max="5" step="1"
                value={physicalActivity || 3}
                onChange={(e) => setValue('physicalActivity', parseInt(e.target.value), { shouldValidate: true })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-background-paper rounded-full shadow-lg pointer-events-none transition-colors duration-300 ${physicalActivity ? 'bg-primary' : 'bg-ink/20'}`}
                style={{ left: `${((physicalActivity || 3) - 1) * 25}%`, marginLeft: '-12px' }}
              />
            </div>
            <div className="flex justify-between mt-6 px-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{t('matching.round2.physical_activity.min_label')}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{t('matching.round2.physical_activity.max_label')}</span>
            </div>
          </div>
        </SurveyFieldGroup>

        {/* Q10: Height (Number Input) */}
        <SurveyFieldGroup
          id="group-height"
          label={t('matching.round2.height.title', 'Chiều cao của bạn (cm)')}
          selectionNote={t('matching.round2.sections.lifestyle.height_note')}
          error={isHeightInvalid}
        >
          <div className="w-full pt-4">
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={height}
                onChange={(e) => setValue('height', parseInt(e.target.value), { shouldValidate: true })}
                placeholder="165"
                className="w-full h-14 bg-background-warm border border-divider rounded-3xl px-6 text-2xl font-serif italic text-primary focus:outline-none focus:border-primary/50 transition-colors"
                min="130"
                max="220"
              />
              <span className="text-xl font-serif italic text-ink/30">{t('matching.round2.height.suffix')}</span>
            </div>
            <p className="mt-4 text-[12px] text-ink/40 italic leading-relaxed">
              {t('matching.round2.sections.lifestyle.height_warning')}
            </p>
          </div>
        </SurveyFieldGroup>
      </div>
    </GroupedStepLayout>
  );
};
