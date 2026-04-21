import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2MaritalStatusInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.marital_status.title')}
      options={[
        t('matching.round2.marital_status.options.single'),
        t('matching.round2.marital_status.options.divorced'),
        t('matching.round2.marital_status.options.widowed'),
        t('matching.round2.marital_status.options.separated')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
