import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2Slider } from './R2Slider';

export const R2HeightInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2Slider 
 
      title={t('matching.round2.height.title')} 
      min={140} 
      max={210} 
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
      minLabel={t('matching.round2.height.min_label')} 
      maxLabel={t('matching.round2.height.max_label')}
      suffix={t('matching.round2.height.suffix')}
    />
  );
};
