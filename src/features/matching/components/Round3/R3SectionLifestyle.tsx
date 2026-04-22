import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { OptionButton } from '../../../../shared/components/OptionButton';

interface R3SectionLifestyleProps {
  onNext: () => void;
  onBack: () => void;
}

export const R3SectionLifestyle: React.FC<R3SectionLifestyleProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();

  const diet = useWatch({ control, name: 'diet' });
  const petPreference = useWatch({ control, name: 'petPreference' });
  const smoking = useWatch({ control, name: 'smoking' });
  const acceptSmoker = useWatch({ control, name: 'acceptSmoker' });
  const drinking = useWatch({ control, name: 'drinking' });
  const acceptDrinking = useWatch({ control, name: 'acceptDrinking' });

  // Validation logic
  const errorsList: string[] = [];

  const isDietError = !diet;
  if (isDietError) errorsList.push('group-diet');

  const isPetError = !petPreference;
  if (isPetError) errorsList.push('group-pet');

  const isSmokingError = !smoking;
  if (isSmokingError) errorsList.push('group-smoking');

  const isAcceptSmokerError = !acceptSmoker;
  if (isAcceptSmokerError) errorsList.push('group-accept-smoker');

  const isDrinkingError = !drinking;
  if (isDrinkingError) errorsList.push('group-drinking');

  const isAcceptDrinkingError = !acceptDrinking;
  if (isAcceptDrinkingError) errorsList.push('group-accept-drinking');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={3}
      totalSteps={4}
      title={<><span className="text-primary italic">LỐI SỐNG</span> & THÓI QUEN</>}
      description="Sự hòa hợp trong các thói quen hàng ngày là chìa khóa cho một mối quan hệ bền vững."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">

        {/* Diet */}
        <SurveyFieldGroup
          id="group-diet"
          label={t('matching.round2.diet.title', 'Chế độ ăn uống của bạn?')}
          selectionMode="single"
          error={isDietError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'no_restriction', label: t('matching.round2.diet.options.no_restriction', 'No restriction') },
              { id: 'vegetarian', label: t('matching.round2.diet.options.vegetarian', 'Vegetarian') },
              { id: 'vegan', label: t('matching.round2.diet.options.vegan', 'Vegan') },
              { id: 'halal', label: t('matching.round2.diet.options.halal', 'Halal') },
              { id: 'other', label: 'Other' }
            ].map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={diet === opt.label}
                onClick={() => setValue('diet', opt.label, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        {/* Pet Attitude */}
        <SurveyFieldGroup
          id="group-pet"
          label={t('matching.round2.pet_preference.title', 'Quan điểm của bạn về thú cưng?')}
          selectionMode="single"
          error={isPetError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'love', label: t('matching.round2.pet_preference.options.love', 'I love pets') },
              { id: 'okay', label: t('matching.round2.pet_preference.options.okay', "I'm okay with pets") },
              { id: 'no_pets', label: t('matching.round2.pet_preference.options.no_pets', 'I prefer no pets') },
              { id: 'allergic', label: t('matching.round2.pet_preference.options.allergic', "I'm allergic / cannot live with pets") }
            ].map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={petPreference === opt.label}
                onClick={() => setValue('petPreference', opt.label, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        {/* Smoking */}
        <SurveyFieldGroup
          id="group-smoking"
          label={t('matching.round2.habits.smoking.title', 'Mức độ hút thuốc của bạn?')}
          selectionMode="single"
          error={isSmokingError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'never', label: t('matching.round2.habits.smoking.options.never', 'Never') },
              { id: 'socially', label: t('matching.round2.habits.smoking.options.socially', 'Socially') },
              { id: 'occasionally', label: t('matching.round2.habits.smoking.options.occasionally', 'Occasionally') },
              { id: 'regularly', label: t('matching.round2.habits.smoking.options.regularly', 'Regularly') }
            ].map((opt) => (
              <OptionButton key={opt.id} label={opt.label} selected={smoking === opt.label} onClick={() => setValue('smoking', opt.label, { shouldValidate: true })} size="sm" />
            ))}
          </div>
        </SurveyFieldGroup>
        <SurveyFieldGroup
          id="group-accept-smoker"
          label={t('matching.round2.habits.accept_smoker.title', 'Bạn có chấp nhận đối tác hút thuốc không?')}
          selectionMode="single"
          error={isAcceptSmokerError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'yes', label: t('matching.round2.habits.accept_smoker.options.yes', 'Yes') },
              { id: 'no', label: t('matching.round2.habits.accept_smoker.options.no', 'No') },
              { id: 'depends', label: t('matching.round2.habits.accept_smoker.options.depends', 'Depends') }
            ].map((opt) => (
              <OptionButton key={opt.id} label={opt.label} selected={acceptSmoker === opt.label} onClick={() => setValue('acceptSmoker', opt.label, { shouldValidate: true })} size="sm" />
            ))}
          </div>
        </SurveyFieldGroup>


        {/* Drinking */}
        <SurveyFieldGroup
          id="group-drinking"
          label={t('matching.round2.habits.drinking.title', 'Mức độ uống rượu bia của bạn?')}
          selectionMode="single"
          error={isDrinkingError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'never', label: t('matching.round2.habits.drinking.options.never', 'Never') },
              { id: 'occasionally', label: t('matching.round2.habits.drinking.options.occasionally', 'Occasionally') },
              { id: 'socially', label: t('matching.round2.habits.drinking.options.socially', 'Socially') },
              { id: 'regularly', label: t('matching.round2.habits.drinking.options.regularly', 'Regularly') }
            ].map((opt) => (
              <OptionButton key={opt.id} label={opt.label} selected={drinking === opt.label} onClick={() => setValue('drinking', opt.label, { shouldValidate: true })} size="sm" />
            ))}
          </div>
        </SurveyFieldGroup>
        <SurveyFieldGroup
          id="group-accept-drinking"
          label={t('matching.round2.habits.accept_drinking.title', 'Bạn có chấp nhận đối tác thường xuyên nhậu không?')}
          selectionMode="single"
          error={isAcceptDrinkingError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'yes', label: t('matching.round2.habits.accept_drinking.options.yes', 'Yes') },
              { id: 'no', label: t('matching.round2.habits.accept_drinking.options.no', 'No') },
              { id: 'depends', label: t('matching.round2.habits.accept_drinking.options.depends', 'Depends') }
            ].map((opt) => (
              <OptionButton key={opt.id} label={opt.label} selected={acceptDrinking === opt.label} onClick={() => setValue('acceptDrinking', opt.label, { shouldValidate: true })} size="sm" />
            ))}
          </div>
        </SurveyFieldGroup>

      </div>
    </GroupedStepLayout>
  );
};
