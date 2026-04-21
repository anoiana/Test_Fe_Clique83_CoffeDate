import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2PetInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.pet.title')}
      options={[
        t('matching.round2.pet.options.love'),
        t('matching.round2.pet.options.okay'),
        t('matching.round2.pet.options.no_pets'),
        t('matching.round2.pet.options.allergic')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
