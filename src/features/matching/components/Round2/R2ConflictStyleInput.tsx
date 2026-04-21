import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2ConflictStyleInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.conflict_style.title')}
      options={[
        t('matching.round2.conflict_style.options.direct'),
        t('matching.round2.conflict_style.options.time'),
        t('matching.round2.conflict_style.options.gentle_indirect'),
        t('matching.round2.conflict_style.options.avoid')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

