import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2PhysicalActivityInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.physical_activity.title')}
      options={[
        t('matching.round2.physical_activity.options.very_low'),
        t('matching.round2.physical_activity.options.low'),
        t('matching.round2.physical_activity.options.moderate'),
        t('matching.round2.physical_activity.options.high'),
        t('matching.round2.physical_activity.options.very_active')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
