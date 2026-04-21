import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout, useStepValidation } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { Checkbox } from '../../../../shared/components/Checkbox';

interface R2SectionMatchProps {
  onNext: () => void;
  onBack: () => void;
}

export const R2SectionMatch: React.FC<R2SectionMatchProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();
  const { showErrors } = useStepValidation();

  const rawAgeRange = useWatch({ control, name: 'ageRange' });
  const ageRange = rawAgeRange && typeof rawAgeRange === 'object' 
    ? { 
        from: rawAgeRange.from ?? '', 
        to: rawAgeRange.to ?? '', 
        flexible: !!rawAgeRange.flexible 
      } 
    : { from: '', to: '', flexible: false };

  const handleMinChange = (val: string) => {
    const numVal = val === '' ? undefined : parseInt(val);
    setValue('ageRange', { ...ageRange, from: numVal }, { shouldValidate: true });
  };

  const handleMaxChange = (val: string) => {
    const numVal = val === '' ? undefined : parseInt(val);
    setValue('ageRange', { ...ageRange, to: numVal }, { shouldValidate: true });
  };

  const handleFlexToggle = () => {
    setValue('ageRange', { ...ageRange, flexible: !ageRange.flexible }, { shouldValidate: true });
  };

  // Validation logic
  const errorsList: string[] = [];
  
  const isAgeRangeError = !rawAgeRange || 
                          !ageRange.from ||
                          !ageRange.to ||
                          ageRange.from < 21 || 
                          ageRange.to > 65 || 
                          ageRange.from > ageRange.to;
                          
  if (isAgeRangeError) errorsList.push('group-age-range');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={2}
      totalSteps={7}
      title={<><span className="text-primary italic">{t('matching.round2.sections.match.title_highlight')}</span> {t('matching.round2.sections.match.title_normal')}</>}
      description={t('matching.round2.sections.match.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        {/* Q4: Age Range */}
        <SurveyFieldGroup 
          id="group-age-range"
          label={t('matching.round2.age_range.title', 'Độ tuổi bạn mong muốn?')}
          error={isAgeRangeError}
        >
          <div className="w-full space-y-8 pt-4">
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="text-[11px] font-bold text-ink/30 tracking-widest uppercase ml-2">{t('matching.round2.age_range.from')}</label>
                   <input 
                      type="number"
                      value={ageRange.from}
                      placeholder="24"
                      onChange={(e) => handleMinChange(e.target.value)}
                      className={`w-full h-14 bg-background-warm border rounded-3xl px-6 text-2xl font-serif italic text-primary focus:outline-none transition-colors ${showErrors && isAgeRangeError ? 'border-red-500 ring-1 ring-red-500/20' : 'border-divider focus:border-primary/50'}`}
                      min="21"
                      max="65"
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[11px] font-bold text-ink/30 tracking-widest uppercase ml-2">{t('matching.round2.age_range.to')}</label>
                   <input 
                      type="number"
                      value={ageRange.to}
                      placeholder="35"
                      onChange={(e) => handleMaxChange(e.target.value)}
                      className={`w-full h-14 bg-background-warm border rounded-3xl px-6 text-2xl font-serif italic text-primary focus:outline-none transition-colors ${showErrors && isAgeRangeError ? 'border-red-500 ring-1 ring-red-500/20' : 'border-divider focus:border-primary/50'}`}
                      min="21"
                      max="65"
                   />
                </div>
             </div>

             <div 
                className="flex items-center gap-4 p-5 rounded-[24px] bg-background-warm/40 border border-divider/40 cursor-pointer"
                onClick={handleFlexToggle}
             >
                <Checkbox checked={ageRange.flexible} onChange={handleFlexToggle} />
                <span className="text-[13px] text-ink/60 leading-tight">
                  {t('matching.round2.age_range.flexible_label', 'Tôi vẫn cởi mở nếu chúng tôi thực sự hợp nhau')}
                </span>
             </div>
          </div>
        </SurveyFieldGroup>
      </div>
    </GroupedStepLayout>
  );
};
