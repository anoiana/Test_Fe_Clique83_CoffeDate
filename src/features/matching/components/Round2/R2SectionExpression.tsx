import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout, useStepValidation } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';

interface R2SectionExpressionProps {
  onNext: () => void;
  onBack: () => void;
}

export const R2SectionExpression: React.FC<R2SectionExpressionProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();
  const { showErrors } = useStepValidation();

  const openness = useWatch({ control, name: 'openness' });
  const bio = useWatch({ control, name: 'bio' }) || '';

  // Validation logic
  const errorsList: string[] = [];

  const isBioInvalid = !bio || bio.trim().length < 10;
  if (isBioInvalid) errorsList.push('group-bio');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={7}
      totalSteps={7}
      title={<><span className="text-primary italic">{t('matching.round2.sections.expression.title_highlight')}</span> {t('matching.round2.sections.expression.title_normal')}</>}
      description={t('matching.round2.sections.expression.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        {/* Q14: Openness (Optional Slider) */}
        <SurveyFieldGroup
          id="group-openness"
          label={t('matching.round2.openness.title', 'Mức độ cởi mở với sự khác biệt?')}
          selectionNote={t('matching.round2.common.selection_note_no_right_answer')}
        >
          <div className="w-full pt-8 pb-4">
            <div className="relative h-1.5 bg-background-warm rounded-full">
              <div
                className={`absolute h-full rounded-full transition-colors duration-300 ${openness ? 'bg-primary' : 'bg-ink/10'}`}
                style={{ width: openness ? `${(openness - 1) * 25}%` : '50%' }}
              />
              <input
                type="range" min="1" max="5" step="1"
                value={openness || 3}
                onChange={(e) => setValue('openness', parseInt(e.target.value), { shouldValidate: true })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-background-paper rounded-full shadow-lg pointer-events-none transition-colors duration-300 ${openness ? 'bg-primary' : 'bg-ink/20'}`}
                style={{ left: openness ? `${(openness - 1) * 25}%` : '50%', marginLeft: '-12px' }}
              />
            </div>
            <div className="flex justify-between mt-6 px-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('matching.round2.openness.min_label')}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('matching.round2.openness.max_label')}</span>
            </div>
          </div>
        </SurveyFieldGroup>

        {/* Q15: Bio */}
        <SurveyFieldGroup
          id="group-bio"
          label={t('matching.round2.bio.title', 'Giới thiệu bản thân')}
          selectionNote={t('matching.round2.bio.selection_note')}
          error={isBioInvalid}
        >
          <div className="w-full pt-2">
            <textarea
              value={bio}
              onChange={(e) => setValue('bio', e.target.value, { shouldValidate: true })}
              placeholder={t('matching.round2.bio.placeholder', 'Kể một chút về bạn...')}
              className={`w-full h-40 bg-background-warm/60 border rounded-[32px] p-6 text-[15px] leading-relaxed text-ink focus:outline-none transition-all resize-none ${showErrors && isBioInvalid ? 'border-red-500 ring-1 ring-red-500/20' : 'border-divider focus:border-primary/40'}`}
            />
            <div className="flex justify-end mt-2">
              <span className={`text-[11px] font-medium ${bio.length < 10 ? 'text-primary/40' : 'text-primary/70'}`}>
                {t('matching.round2.common.char_count', { count: bio.length })}
              </span>
            </div>
          </div>
        </SurveyFieldGroup>
      </div>
    </GroupedStepLayout>
  );
};
