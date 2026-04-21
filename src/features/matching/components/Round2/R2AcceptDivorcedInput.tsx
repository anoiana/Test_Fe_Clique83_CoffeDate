import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2AcceptDivorcedInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.accept_divorced.title')}
      options={[
        t('matching.round2.accept_divorced.options.yes'),
        t('matching.round2.accept_divorced.options.no'),
        t('matching.round2.accept_divorced.options.depends')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

