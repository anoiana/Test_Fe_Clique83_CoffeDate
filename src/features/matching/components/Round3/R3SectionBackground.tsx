import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { Input } from '../../../../shared/components/Input';

interface R3SectionBackgroundProps {
  onNext: () => void;
  onBack: () => void;
}

export const R3SectionBackground: React.FC<R3SectionBackgroundProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();

  const culturalBg = useWatch({ control, name: 'culturalBg' });
  const nationality = useWatch({ control, name: 'nationality' });
  const maritalStatus = useWatch({ control, name: 'maritalStatus' });
  const acceptDivorced = useWatch({ control, name: 'acceptDivorced' });

  // Validation logic
  const errorsList: string[] = [];
  
  const isCulturalBgError = !culturalBg;
  if (isCulturalBgError) errorsList.push('group-cultural-bg');
  
  const isNationalityError = !nationality;
  if (isNationalityError) errorsList.push('group-nationality');
  
  const isMaritalStatusError = !maritalStatus;
  if (isMaritalStatusError) errorsList.push('group-marital-status');

  const isAcceptDivorcedError = !acceptDivorced;
  if (isAcceptDivorcedError) errorsList.push('group-accept-divorced');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={2}
      totalSteps={4}
      title={<><span className="text-primary italic">NỀN TẢNG</span> & XUẤT THÂN</>}
      description="Bối cảnh văn hóa và xuất thân ảnh hưởng nhiều đến cách chúng ta kết nối."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        
        {/* Cultural Background */}
        <SurveyFieldGroup 
          id="group-cultural-bg"
          label={t('matching.round2.cultural_bg.title', 'Bối cảnh văn hóa bạn lớn lên?')} 
          selectionMode="single" 
          error={isCulturalBgError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'vn_raised_vn', label: t('matching.round2.cultural_bg.options.vn_raised_vn', 'Vietnamese, raised in Vietnam') },
              { id: 'vn_raised_abroad', label: t('matching.round2.cultural_bg.options.vn_raised_abroad', 'Vietnamese, raised abroad') },
              { id: 'vn_mixed', label: t('matching.round2.cultural_bg.options.vn_mixed', 'Vietnamese mixed background') },
              { id: 'asian_non_vn', label: t('matching.round2.cultural_bg.options.asian_non_vn', 'Asian (non-Vietnamese)') },
              { id: 'western', label: t('matching.round2.cultural_bg.options.western', 'Western') },
              { id: 'mixed_intl', label: t('matching.round2.cultural_bg.options.mixed_intl', 'Mixed international background') }
            ].map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={culturalBg === opt.label}
                onClick={() => setValue('culturalBg', opt.label, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        {/* Nationality */}
        <SurveyFieldGroup 
          id="group-nationality"
          label={t('matching.round2.nationality.title', 'Quốc tịch của bạn?')} 
          selectionMode="single" 
          error={isNationalityError}
        >
          <div className="w-full">
            <Input
              placeholder={t('matching.round2.nationality.placeholder', 'VD: Việt Nam')}
              value={nationality || ''}
              onChange={(e) => setValue('nationality', e.target.value, { shouldValidate: true })}
              className={isNationalityError ? 'border-red-500 ring-1 ring-red-500/20' : ''}
            />
          </div>
        </SurveyFieldGroup>

        {/* Marital Status */}
        <SurveyFieldGroup 
          id="group-marital-status"
          label={t('matching.round2.marital_status.title', 'Tình trạng hôn nhân của bạn?')} 
          selectionMode="single" 
          error={isMaritalStatusError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'single', label: t('matching.round2.marital_status.options.single', 'Single (never married)') },
              { id: 'divorced', label: t('matching.round2.marital_status.options.divorced', 'Divorced') },
              { id: 'separated', label: t('matching.round2.marital_status.options.separated', 'Separated') },
              { id: 'widowed', label: t('matching.round2.marital_status.options.widowed', 'Widowed') },
              { id: 'married_separated', label: t('matching.round2.marital_status.options.married_separated', 'Married but separated') }
            ].map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={maritalStatus === opt.label}
                onClick={() => setValue('maritalStatus', opt.label, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        {/* Accept Divorced */}
        <SurveyFieldGroup 
          id="group-accept-divorced"
          label={t('matching.round2.accept_divorced.title', 'Bạn có chấp nhận người từng kết hôn/ly hôn?')} 
          selectionMode="single" 
          error={isAcceptDivorcedError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'yes', label: t('matching.round2.accept_divorced.options.yes', 'Yes') },
              { id: 'no', label: t('matching.round2.accept_divorced.options.no', 'No') },
              { id: 'depends', label: t('matching.round2.accept_divorced.options.depends', 'Depends') }
            ].map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={acceptDivorced === opt.label}
                onClick={() => setValue('acceptDivorced', opt.label, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

      </div>
    </GroupedStepLayout>
  );
};
