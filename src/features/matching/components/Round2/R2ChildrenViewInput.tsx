import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2ChildrenViewInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.children_view.title')}
      options={[
        t('matching.round2.children_view.options.want_children'),
        t('matching.round2.children_view.options.no_children'),
        t('matching.round2.children_view.options.already_have'),
        t('matching.round2.children_view.options.open_undecided')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

