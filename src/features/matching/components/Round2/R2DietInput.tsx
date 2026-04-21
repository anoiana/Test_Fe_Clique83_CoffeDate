import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2DietInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.diet.title')}
      options={[
        t('matching.round2.diet.options.no_restriction'),
        t('matching.round2.diet.options.vegetarian'),
        t('matching.round2.diet.options.vegan'),
        t('matching.round2.diet.options.halal')
      ]}
      showOther={true} 
      otherLabel={t('matching.round2.common.other')}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

