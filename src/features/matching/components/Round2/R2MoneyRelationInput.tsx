import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2MoneyRelationInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2SingleChoice

      title={t('matching.round2.money_relation.title')}
      options={[
        t('matching.round2.money_relation.options.plan_save'),
        t('matching.round2.money_relation.options.spend_enjoy'),
        t('matching.round2.money_relation.options.invest_growth'),
        t('matching.round2.money_relation.options.balance'),
        t('matching.round2.money_relation.options.not_focus')
      ]}
      value={value}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
    />
  );
};
