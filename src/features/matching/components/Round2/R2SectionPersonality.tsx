import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout, useStepValidation } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { OptionButton } from '../../../../shared/components/OptionButton';

interface R2SectionPersonalityProps {
  onNext: () => void;
  onBack: () => void;
}

export const R2SectionPersonality: React.FC<R2SectionPersonalityProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();
  const { showErrors } = useStepValidation();

  const introExtro = useWatch({ control, name: 'introExtro' });
  const attachmentStyle = useWatch({ control, name: 'attachmentStyle' });
  const conflictStyle = useWatch({ control, name: 'conflictStyle' });
  const loveLanguage = useWatch({ control, name: 'loveLanguage' }) || [];

  const attachmentOptions = [
    { id: 'secure', label: t('matching.round2.attachment_style.options.secure') },
    { id: 'anxious', label: t('matching.round2.attachment_style.options.anxious') },
    { id: 'avoidant', label: t('matching.round2.attachment_style.options.avoidant') },
    { id: 'not_sure', label: t('matching.round2.attachment_style.options.not_sure') }
  ];

  const communicationOptions = [
    { id: 'direct', label: t('matching.round2.conflict_style.options.direct') },
    { id: 'time', label: t('matching.round2.conflict_style.options.time') },
    { id: 'gentle_indirect', label: t('matching.round2.conflict_style.options.gentle_indirect') },
    { id: 'avoid', label: t('matching.round2.conflict_style.options.avoid') }
  ];

  const loveLanguageOptions = [
    { id: 'affirmation', label: t('matching.round2.love_language.options.affirmation') },
    { id: 'quality_time', label: t('matching.round2.love_language.options.quality_time') },
    { id: 'acts_of_service', label: t('matching.round2.love_language.options.acts_of_service') },
    { id: 'physical_touch', label: t('matching.round2.love_language.options.physical_touch') },
    { id: 'gifts', label: t('matching.round2.love_language.options.gifts') }
  ];

  const handleToggleLoveLanguage = (id: string) => {
    let newValue;
    if (loveLanguage.includes(id)) {
      newValue = loveLanguage.filter((v: string) => v !== id);
    } else if (loveLanguage.length < 2) {
      newValue = [...loveLanguage, id];
    } else {
      return;
    }
    setValue('loveLanguage', newValue, { shouldValidate: true });
  };

  // Validation logic for error highlighting and auto-scroll
  const errorsList: string[] = [];

  const isIntroExtroInvalid = !introExtro;
  if (isIntroExtroInvalid) errorsList.push('group-personality-social');
 
  const isAttachmentInvalid = !attachmentStyle;
  if (isAttachmentInvalid) errorsList.push('group-attachment');
 
  const isConflictInvalid = !conflictStyle;
  if (isConflictInvalid) errorsList.push('group-conflict');
 
  const isLoveLanguageInvalid = !loveLanguage || loveLanguage.length < 1;
  if (isLoveLanguageInvalid) errorsList.push('group-love-language');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={3}
      totalSteps={7}
      title={<><span className="text-primary italic">{t('matching.round2.sections.personality.title_highlight')}</span> {t('matching.round2.sections.personality.title_normal')}</>}
      description={t('matching.round2.sections.personality.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        {/* Q5: Social Energy (Slider) */}
        <SurveyFieldGroup
          id="group-personality-social"
          label={t('matching.round2.personality_social.title', 'Mức độ năng lượng xã hội của bạn?')}
          selectionNote={t('matching.round2.common.selection_note_slider')}
          error={isIntroExtroInvalid}
        >
          <div className="w-full pt-8 pb-4">
            <div className="relative h-1.5 bg-background-warm rounded-full">
              <div
                className={`absolute h-full rounded-full transition-colors duration-300 ${introExtro ? 'bg-primary' : 'bg-ink/10'}`}
                style={{ width: `${((introExtro || 3) - 1) * 25}%` }}
              />
              <input
                type="range" min="1" max="5" step="1"
                value={introExtro || 3}
                onChange={(e) => setValue('introExtro', parseInt(e.target.value), { shouldValidate: true })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-background-paper rounded-full shadow-lg pointer-events-none transition-colors duration-300 ${introExtro ? 'bg-primary' : 'bg-ink/20'}`}
                style={{ left: `${((introExtro || 3) - 1) * 25}%`, marginLeft: '-12px' }}
              />
            </div>
            <div className="flex justify-between mt-6 px-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{t('matching.round2.personality_social.min_label')}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{t('matching.round2.personality_social.max_label')}</span>
            </div>
          </div>
        </SurveyFieldGroup>

        {/* Q6: Attachment Style */}
        <SurveyFieldGroup
          id="group-attachment"
          label={t('matching.round2.attachment_style.title')}
          selectionMode="single"
          error={isAttachmentInvalid}
        >
          <div className="flex flex-wrap gap-2.5">
            {attachmentOptions.map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={attachmentStyle === opt.id}
                onClick={() => setValue('attachmentStyle', opt.id, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        {/* Q7: Communication Style */}
        <SurveyFieldGroup
          id="group-conflict"
          label={t('matching.round2.conflict_style.title')}
          selectionMode="single"
          error={isConflictInvalid}
        >
          <div className="flex flex-wrap gap-2.5">
            {communicationOptions.map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={conflictStyle === opt.id}
                onClick={() => setValue('conflictStyle', opt.id, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        {/* Q8: Love Languages */}
        <SurveyFieldGroup
          id="group-love-language"
          label={t('matching.round2.love_language.title')}
          selectionMode="multiple"
          maxSelection={2}
          error={isLoveLanguageInvalid}
        >
          <div className="flex flex-wrap gap-2.5">
            {loveLanguageOptions.map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={loveLanguage.includes(opt.id)}
                onClick={() => handleToggleLoveLanguage(opt.id)}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>
      </div>
    </GroupedStepLayout>
  );
};
