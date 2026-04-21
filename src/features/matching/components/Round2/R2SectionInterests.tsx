import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout, useStepValidation } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { OptionButton } from '../../../../shared/components/OptionButton';

interface R2SectionInterestsProps {
  onNext: () => void;
  onBack: () => void;
}

export const R2SectionInterests: React.FC<R2SectionInterestsProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();
  const { showErrors } = useStepValidation();

  const activities = useWatch({ control, name: 'activities' }) || [];

  const interestOptions = [
    { id: 'traveling', label: t('matching.round2.activities.options.traveling') },
    { id: 'fitness', label: t('matching.round2.activities.options.fitness_gym') },
    { id: 'outdoor', label: t('matching.round2.activities.options.outdoor_sports') },
    { id: 'yoga', label: t('matching.round2.activities.options.yoga_wellness') },
    { id: 'reading', label: t('matching.round2.activities.options.reading') },
    { id: 'movies', label: t('matching.round2.activities.options.movies_netflix') },
    { id: 'music', label: t('matching.round2.activities.options.music_concerts') },
    { id: 'cooking', label: t('matching.round2.activities.options.cooking_food') },
    { id: 'cafe', label: t('matching.round2.activities.options.cafe_hopping') },
    { id: 'art', label: t('matching.round2.activities.options.art_exhibitions') },
    { id: 'gaming', label: t('matching.round2.activities.options.gaming') },
    { id: 'business', label: t('matching.round2.activities.options.business_networking') }
  ];

  const handleToggleInterest = (id: string) => {
    let newValue;
    if (activities.includes(id)) {
      newValue = activities.filter((v: string) => v !== id);
    } else {
      newValue = [...activities, id];
    }
    setValue('activities', newValue, { shouldValidate: true });
  };

  // Validation logic
  const errorsList: string[] = [];

  const isActivitiesInvalid = !activities || activities.length === 0;
  if (isActivitiesInvalid) errorsList.push('group-interests');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={5}
      totalSteps={7}
      title={<><span className="text-primary italic">{t('matching.round2.sections.interests.title_highlight')}</span> {t('matching.round2.sections.interests.title_normal')}</>}
      description={t('matching.round2.sections.interests.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        {/* Q11: Interests */}
        <SurveyFieldGroup
          id="group-interests"
          label={t('matching.round2.activities.title')}
          selectionMode="multiple"
          error={isActivitiesInvalid}
        >
          <div className="flex flex-wrap gap-2.5">
            {interestOptions.map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={activities.includes(opt.id)}
                onClick={() => handleToggleInterest(opt.id)}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>
      </div>
    </GroupedStepLayout>
  );
};
