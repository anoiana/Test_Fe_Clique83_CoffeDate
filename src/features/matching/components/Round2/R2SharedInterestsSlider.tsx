import React from 'react';
import { R2Slider } from './R2Slider';
import { useTranslation } from 'react-i18next';

export const R2SharedInterestsSlider = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2Slider 
 
      title={t('matching.round2.shared_interests.title')}
      minLabel={t('matching.round2.shared_interests.min_label')} 
      maxLabel={t('matching.round2.shared_interests.max_label')}
      description={t('matching.round2.shared_interests.description')}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
