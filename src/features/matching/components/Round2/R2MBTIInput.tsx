import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

interface R2MBTIInputProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const R2MBTIInput = ({ value, onChange, onNext, onBack }: R2MBTIInputProps) => {
  const { t } = useTranslation();
  
  const options = [
    ...MBTI_TYPES,
    t('matching.round2.mbti.options.dont_know')
  ];

  return (
    <R2SingleChoice 
 
      title={t('matching.round2.mbti.title')}
      description={
        <Trans i18nKey="matching.round2.mbti.description">
          Don't know your type? <a href={t('matching.round2.mbti.test_url', 'https://www.16personalities.com/free-personality-test')} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">Take the free test here →</a>
        </Trans>
      }
      options={options}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
