import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout, useStepValidation } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { Input } from '../../../../shared/components/Input';
import { Search } from 'lucide-react';
import { flexibleSearch } from '../../../../shared/utils/stringUtils';

interface R2SectionBackgroundProps {
  onNext: () => void;
  onBack: () => void;
}

export const R2SectionBackground: React.FC<R2SectionBackgroundProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control, watch } = useFormContext();
  const { showErrors } = useStepValidation();
  const [langSearch, setLangSearch] = React.useState('');

  const religion = useWatch({ control, name: 'religion' });
  const religionOtherValue = watch('religion_other');
  const languages = useWatch({ control, name: 'languages' }) || [];

  const religionOptions = [
    { id: 'none', label: t('matching.round2.religion.options.none') },
    { id: 'buddhism', label: t('matching.round2.religion.options.buddhism') },
    { id: 'christianity', label: t('matching.round2.religion.options.christianity') },
    { id: 'catholic', label: t('matching.round2.religion.options.catholic') },
    { id: 'islam', label: t('matching.round2.religion.options.islam') },
    { id: 'spiritual', label: t('matching.round2.religion.options.spiritual') },
    { id: 'other', label: t('matching.round2.common.other') }
  ];

  const languageResources = t('matching.round2.languages.options', { returnObjects: true }) as Record<string, string>;
  const languageOptions = Object.entries(languageResources).map(([id, label]) => ({
    id,
    label
  }));

  const suggestedLangs = languageOptions.slice(0, 6);
  const filteredLangs = languageOptions.filter(opt => 
    flexibleSearch(langSearch, opt.label)
  );

  const handleToggleLanguage = (id: string) => {
    let newValue;
    if (languages.includes(id)) {
      newValue = languages.filter((v: string) => v !== id);
    } else {
      newValue = [...languages, id];
    }
    setValue('languages', newValue, { shouldValidate: true });
  };

  // Validation logic
  const errorsList: string[] = [];

  const isReligionError = !religion || (religion === 'other' && !religionOtherValue);
  if (isReligionError) errorsList.push('group-religion');

  const isLanguagesError = !languages || languages.length === 0;
  if (isLanguagesError) errorsList.push('group-languages');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={6}
      totalSteps={7}
      title={<><span className="text-primary italic">{t('matching.round2.sections.background.title_highlight')}</span> {t('matching.round2.sections.background.title_normal')}</>}
      description={t('matching.round2.sections.background.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        {/* Q12: Religion */}
        <SurveyFieldGroup
          id="group-religion"
          label={t('matching.round2.religion.title')}
          selectionMode="single"
          error={isReligionError}
        >
          <div className="w-full space-y-4">
            <div className="flex flex-wrap gap-2.5">
              {religionOptions.map((opt) => (
                <OptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={religion === opt.id}
                  onClick={() => setValue('religion', opt.id, { shouldValidate: true })}
                  size="sm"
                />
              ))}
            </div>
            {religion === 'other' && (
              <div className="mt-4">
                <Input
                  placeholder={t('matching.round2.religion.other_placeholder', 'Vui lòng ghi rõ tôn giáo của bạn...')}
                  value={religionOtherValue || ''}
                  onChange={(e) => setValue('religion_other', e.target.value, { shouldValidate: true })}
                  className={showErrors && isReligionError && religion === 'other' && !religionOtherValue ? 'border-red-500 ring-1 ring-red-500/20' : ''}
                />
              </div>
            )}
          </div>
        </SurveyFieldGroup>

        {/* Q13: Languages */}
        <SurveyFieldGroup
          id="group-languages"
          label={t('matching.round2.languages.title')}
          selectionMode="multiple"
          error={isLanguagesError}
        >
          <div className="w-full space-y-6">
            <div className="flex flex-wrap gap-2.5">
              {suggestedLangs.map((opt) => (
                <OptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={languages.includes(opt.id)}
                  onClick={() => handleToggleLanguage(opt.id)}
                  size="sm"
                />
              ))}
            </div>

            <div className="relative">
              <Input
                prefix={<Search className="w-4 h-4 text-primary/40" />}
                type="text"
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                placeholder={t('matching.round2.languages.search_placeholder', 'Tìm ngôn ngữ khác...')}
                className="[&_input]:italic [&_input]:font-serif [&_div.min-h-\[50px\]]:bg-background-warm/30"
              />

              {langSearch && (
                <div className="absolute top-full left-0 w-full mt-2 bg-background-paper border border-divider rounded-3xl shadow-xl z-50 overflow-hidden">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredLangs.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          if (!languages.includes(opt.id)) {
                            handleToggleLanguage(opt.id);
                          }
                          setLangSearch('');
                        }}
                        className="w-full px-5 py-3.5 text-left hover:bg-primary/5 transition-colors border-b border-divider/40 last:border-0 flex items-center gap-3"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${languages.includes(opt.id) ? 'bg-primary' : 'bg-divider'}`} />
                        <span className={`text-sm ${languages.includes(opt.id) ? 'text-primary font-bold' : 'text-ink'}`}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                    {filteredLangs.length === 0 && (
                      <div className="px-5 py-4 text-sm text-ink/40 italic">
                        {t('matching.round2.languages.no_results', 'Không tìm thấy ngôn ngữ này')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Selected items that are not in suggested */}
            {languages.filter((id: string) => !suggestedLangs.some(s => s.id === id)).length > 0 && (
              <div className="flex flex-wrap gap-2.5 pt-2 animate-in fade-in zoom-in duration-300">
                {languages
                  .filter((id: string) => !suggestedLangs.some(s => s.id === id))
                  .map((id: string) => {
                    const label = languageOptions.find(o => o.id === id)?.label || id;
                    return (
                      <OptionButton
                        key={id}
                        label={label}
                        selected={true}
                        onClick={() => handleToggleLanguage(id)}
                        size="sm"
                        className="!border-primary/50"
                      />
                    );
                  })}
              </div>
            )}
          </div>
        </SurveyFieldGroup>
      </div>
    </GroupedStepLayout>
  );
};
