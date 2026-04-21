import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2MultiSelect } from './R2MultiSelect';

export const R2LanguagesInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  const languageResources = t('matching.round2.languages.options', { returnObjects: true }) as Record<string, string>;
  const options = Object.values(languageResources);

  return (
    <R2MultiSelect 
      title={t('matching.round2.languages.title')} 
      description={t('matching.round2.languages.description')}
      showOther={true} 
      otherLabel={t('matching.round2.common.other')}
      options={[...options, t('matching.round2.common.other')]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
