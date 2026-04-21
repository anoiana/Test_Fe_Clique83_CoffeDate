import React from 'react';
import { R2SingleChoice } from './R2SingleChoice';
import { useTranslation } from 'react-i18next';

export const R2ReligionInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  const options = [
    t('matching.round2.religion.options.none'),
    t('matching.round2.religion.options.buddhism'),
    t('matching.round2.religion.options.christianity'),
    t('matching.round2.religion.options.catholic'),
    t('matching.round2.religion.options.islam'),
    t('matching.round2.religion.options.hinduism'),
    t('matching.round2.religion.options.spiritual')
  ];

  return (
    <R2SingleChoice 
 
      title={t('matching.round2.religion.title')}
      showOther={true} 
      otherLabel={t('matching.round2.common.other')}
      options={options}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
