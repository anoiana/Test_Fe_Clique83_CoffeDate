import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2DecisionStyleInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2SingleChoice

      title={t('matching.round2.decision_style.title')}
      options={[
        t('matching.round2.decision_style.options.logic'),
        t('matching.round2.decision_style.options.emotional'),
        t('matching.round2.decision_style.options.balance')
      ]}
      value={value}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
    />
  );
};

