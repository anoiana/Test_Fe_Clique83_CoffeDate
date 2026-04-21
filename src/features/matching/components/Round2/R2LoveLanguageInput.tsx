import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2MultiSelect } from './R2MultiSelect';

export const R2LoveLanguageInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2MultiSelect 
 
      title={t('matching.round2.love_language.title')} 
      description={t('matching.round2.love_language.description')}
      maxSelect={2}
      options={[
        t('matching.round2.love_language.options.affirmation'),
        t('matching.round2.love_language.options.quality_time'),
        t('matching.round2.love_language.options.acts_of_service'),
        t('matching.round2.love_language.options.physical_touch'),
        t('matching.round2.love_language.options.gifts')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
