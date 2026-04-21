import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2Slider } from './R2Slider';
import { R2FreeText } from './R2FreeText';

export const R2OpennessSlider = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2Slider 
 
      title={t('matching.round2.openness.title')}
      minLabel={t('matching.round2.openness.min_label')} 
      maxLabel={t('matching.round2.openness.max_label')}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

export const R2DealbreakersInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2FreeText 
 
      title={t('matching.round2.dealbreakers.title')}
      description=""
      placeholder={t('matching.round2.dealbreakers.placeholder')} 
      maxLength={1000}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
      required
    />
  );
};

