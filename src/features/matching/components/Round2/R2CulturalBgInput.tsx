import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2CulturalBgInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.cultural_bg.title')}
      showOther={true} 
      otherLabel={t('matching.round2.common.other')}
      options={[
        t('matching.round2.cultural_bg.options.vn_raised_vn'),
        t('matching.round2.cultural_bg.options.vn_raised_abroad'),
        t('matching.round2.cultural_bg.options.vn_mixed'),
        t('matching.round2.cultural_bg.options.asian_non_vn'),
        t('matching.round2.cultural_bg.options.western'),
        t('matching.round2.cultural_bg.options.mixed_intl')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

