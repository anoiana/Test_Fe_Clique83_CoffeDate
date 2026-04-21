import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2IntroExtroInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.personality_social.title')}
      options={[
        t('matching.round2.personality_social.options.strongly_introverted'),
        t('matching.round2.personality_social.options.slightly_introverted'),
        t('matching.round2.personality_social.options.balanced'),
        t('matching.round2.personality_social.options.slightly_extroverted'),
        t('matching.round2.personality_social.options.strongly_extroverted')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
