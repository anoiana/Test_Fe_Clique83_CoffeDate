import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2AttachmentStyleInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.attachment_style.title')}
      options={[
        t('matching.round2.attachment_style.options.secure'),
        t('matching.round2.attachment_style.options.anxious'),
        t('matching.round2.attachment_style.options.avoidant'),
        t('matching.round2.attachment_style.options.not_sure')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

