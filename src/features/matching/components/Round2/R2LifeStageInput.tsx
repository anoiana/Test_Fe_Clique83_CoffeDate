import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2LifeStageInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.life_stage.title')}
      options={[
        t('matching.round2.life_stage.options.exploring'),
        t('matching.round2.life_stage.options.building_career'),
        t('matching.round2.life_stage.options.established'),
        t('matching.round2.life_stage.options.starting_family'),
        t('matching.round2.life_stage.options.in_transition')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
