import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2MultiSelect } from './R2MultiSelect';

export const R2CoreValuesInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2MultiSelect

      title={t('matching.round2.core_values.title')}
      description={t('matching.round2.core_values.description')}
      maxSelect={5}
      options={[
        t('matching.round2.core_values.options.family'),
        t('matching.round2.core_values.options.career'),
        t('matching.round2.core_values.options.financial'),
        t('matching.round2.core_values.options.freedom'),
        t('matching.round2.core_values.options.adventure'),
        t('matching.round2.core_values.options.creativity'),
        t('matching.round2.core_values.options.spirituality'),
        t('matching.round2.core_values.options.health'),
        t('matching.round2.core_values.options.growth'),
        t('matching.round2.core_values.options.contribution'),
        t('matching.round2.core_values.options.stability'),
        t('matching.round2.core_values.options.community'),
        t('matching.round2.core_values.options.romantic_relationship')
      ]}
      value={value}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
    />
  );
};

