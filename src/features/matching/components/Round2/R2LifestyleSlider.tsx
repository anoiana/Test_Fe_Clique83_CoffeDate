import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2Slider } from './R2Slider';

export const R2LifestyleSlider = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2Slider

      title={t('matching.round2.lifestyle.title')}
      minLabel={t('matching.round2.lifestyle.min_label')}
      maxLabel={t('matching.round2.lifestyle.max_label')}
      value={value}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
    />
  );
};
