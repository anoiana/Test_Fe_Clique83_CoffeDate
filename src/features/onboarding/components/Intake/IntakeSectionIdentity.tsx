import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { GroupedStepLayout, useStepValidation } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { Calendar } from 'lucide-react';
import { FormError } from '../../../../shared/components/FormError';

interface IntakeSectionIdentityProps {
  onNext: () => void;
  onBack: () => void;
}

export const IntakeSectionIdentity: React.FC<IntakeSectionIdentityProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control, register, watch, formState: { errors } } = useFormContext();
  const { showErrors } = useStepValidation();

  const genderValue = useWatch({ control, name: 'gender' });
  const genderOtherValue = watch('gender_other');
  const targetGenders = useWatch({ control, name: 'targetGenders' }) || [];
  const targetGenderOtherValue = watch('target_gender_other');
  const educationValue = useWatch({ control, name: 'education' });
  const educationOtherValue = watch('education_other');
  const birthdateValue = useWatch({ control, name: 'birthdate' });

  const genderOptions = [
    { id: 'male', label: t('intake.gender.options.male') },
    { id: 'female', label: t('intake.gender.options.female') },
    { id: 'other', label: t('intake.gender.options.other') }
  ];

  const targetGenderOptions = [
    { id: 'men', label: t('intake.target_gender.options.men') },
    { id: 'women', label: t('intake.target_gender.options.women') },
    { id: 'other', label: t('intake.target_gender.options.other') }
  ];

  const educationOptions = [
    { key: 'secondary', label: t('intake.education.options.secondary') },
    { key: 'highschool', label: t('intake.education.options.highschool') },
    { key: 'associate', label: t('intake.education.options.associate') },
    { key: 'bachelor', label: t('intake.education.options.bachelor') },
    { key: 'master', label: t('intake.education.options.master') },
    { key: 'phd', label: t('intake.education.options.phd') },
    { key: 'other', label: t('intake.education.options.other') }
  ];

  const handleTargetGenderToggle = (id: string) => {
    setValue('targetGenders', [id], { shouldValidate: true });
  };

  const validateAge = (value: string) => {
    if (!value) return 'REQUIRED_FIELD';
    const parts = value.split('/');
    if (parts.length !== 3) return 'INVALID_BIRTHDATE';

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const birthDate = new Date(year, month, day);

    if (isNaN(birthDate.getTime())) return 'INVALID_BIRTHDATE';

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 21) return 'UNDERAGE';
    return true;
  };

  // Logic kiểm tra lỗi (Luôn chạy để tính toán errorsList)
  const isGenderError = !genderValue || (genderValue === 'other' && !genderOtherValue);
  const isTargetGenderError = !targetGenders || targetGenders.length === 0 || (targetGenders.includes('other') && !targetGenderOtherValue);
  const ageValidationResult = validateAge(birthdateValue);
  const isBirthdateError = ageValidationResult !== true;
  const isEducationError = !educationValue || (educationValue === 'other' && !educationOtherValue);

  const errorsList: string[] = [];
  if (isGenderError) errorsList.push('group-gender');
  if (isTargetGenderError) errorsList.push('group-target-gender');
  if (isBirthdateError) errorsList.push('group-birthdate');
  if (isEducationError) errorsList.push('group-education');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={2}
      totalSteps={3}
      title={<>{t('intake.sections.identity.title_prefix')} <span className="text-primary italic">{t('intake.sections.identity.title_highlight')}</span> {t('intake.sections.identity.title_suffix')}</>}
      description={t('intake.sections.identity.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        <SurveyFieldGroup
          id="group-gender"
          label={t('intake.gender.title')}
          selectionNote=""
          selectionMode="single"
          error={isGenderError}
        >
          <div className="w-full space-y-4 text-left">
            <input type="hidden" {...register('gender', { required: 'REQUIRED_FIELD' })} />
            <div className="flex flex-wrap gap-3">
              {genderOptions.map((opt) => (
                <OptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={genderValue === opt.id}
                  onClick={() => setValue('gender', opt.id, { shouldValidate: true })}
                  size="sm"
                />
              ))}
            </div>
            {genderValue === 'other' && (
              <input
                type="text"
                placeholder={t('intake.gender.other_placeholder')}
                value={genderOtherValue || ''}
                className={`w-full mt-4 min-h-[44px] px-6 rounded-3xl bg-background-warm/60 border text-ink text-sm focus:outline-none transition-all box-border ${showErrors && isGenderError && genderValue === 'other' && !genderOtherValue ? 'border-red-500 ring-1 ring-red-500/20' : 'border-divider/50 focus:border-primary/40'}`}
                onChange={(e) => setValue('gender_other', e.target.value, { shouldValidate: true })}
              />
            )}
            <FormError error={errors.gender?.message as string} />
          </div>
        </SurveyFieldGroup>

        <SurveyFieldGroup
          id="group-target-gender"
          label={t('intake.target_gender.title')}
          selectionNote=""
          selectionMode="single"
          error={isTargetGenderError}
        >
          <div className="w-full space-y-4 text-left">
            <input type="hidden" {...register('targetGenders', {
              validate: (v) => (v && v.length > 0) || 'REQUIRED_FIELD'
            })} />
            <div className="flex flex-wrap gap-3">
              {targetGenderOptions.map((opt) => (
                <OptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={targetGenders.includes(opt.id)}
                  onClick={() => handleTargetGenderToggle(opt.id)}
                  size="sm"
                />
              ))}
            </div>
            {targetGenders.includes('other') && (
              <input
                type="text"
                placeholder={t('intake.target_gender.other_placeholder')}
                value={targetGenderOtherValue || ''}
                className={`w-full mt-4 min-h-[44px] px-6 rounded-3xl bg-background-warm/60 border text-ink text-sm focus:outline-none transition-all box-border ${showErrors && isTargetGenderError && targetGenders.includes('other') && !targetGenderOtherValue ? 'border-red-500 ring-1 ring-red-500/20' : 'border-divider/50 focus:border-primary/40'}`}
                onChange={(e) => setValue('target_gender_other', e.target.value, { shouldValidate: true })}
              />
            )}
            <FormError error={errors.targetGenders?.message as string} />
          </div>
        </SurveyFieldGroup>

        <SurveyFieldGroup
          id="group-birthdate"
          label={t('intake.birthdate.title')}
          selectionNote={t('intake.birthdate.selection_note')}
          error={isBirthdateError}
        >
          <div className="w-full space-y-4 text-left">
            <div className="w-full">
              <Controller
                name="birthdate"
                control={control}
                rules={{ validate: validateAge }}
                render={({ field: { value, onChange } }) => (
                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute left-4 text-primary/40 pointer-events-none">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={value || ''}
                      placeholder="DD/MM/YYYY"
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 8) val = val.slice(0, 8);
                        if (val.length > 4) val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4);
                        else if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                        onChange(val);
                      }}
                      className={`w-full min-h-[44px] px-12 rounded-3xl bg-background-warm/40 border text-ink focus:outline-none transition-all tracking-[0.2em] font-mono box-border text-[13px] text-center ${showErrors && isBirthdateError ? 'border-red-500 ring-1 ring-red-500/20' : 'border-divider/50 focus:border-primary/40'}`}
                    />
                  </div>
                )}
              />
            </div>
            <FormError error={errors.birthdate?.message as string} />
          </div>
        </SurveyFieldGroup>

        <SurveyFieldGroup
          id="group-education"
          label={t('intake.education.title')}
          selectionNote=""
          selectionMode="single"
          error={isEducationError}
        >
          <div className="w-full space-y-4 text-left">
            <input type="hidden" {...register('education', { required: 'REQUIRED_FIELD' })} />
            <div className="flex flex-wrap gap-3">
              {educationOptions.map((opt) => (
                <OptionButton
                  key={opt.key}
                  label={opt.label}
                  selected={educationValue === opt.key}
                  onClick={() => setValue('education', opt.key, { shouldValidate: true })}
                  size="sm"
                />
              ))}
            </div>
            {educationValue === 'other' && (
              <input
                type="text"
                placeholder={t('intake.education.other_placeholder')}
                value={educationOtherValue || ''}
                className={`w-full mt-4 min-h-[44px] px-6 rounded-3xl bg-background-warm/60 border text-ink text-sm focus:outline-none transition-all box-border ${showErrors && isEducationError && educationValue === 'other' && !educationOtherValue ? 'border-red-500 ring-1 ring-red-500/20' : 'border-divider/50 focus:border-primary/40'}`}
                onChange={(e) => setValue('education_other', e.target.value, { shouldValidate: true })}
              />
            )}
            <FormError error={errors.education?.message as string} />
          </div>
        </SurveyFieldGroup>
      </div>
    </GroupedStepLayout>
  );
};
