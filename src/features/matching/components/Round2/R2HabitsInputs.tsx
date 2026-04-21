import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2SingleChoice } from './R2SingleChoice';

export const R2SmokingInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.habits.smoking.title')}
      options={[
        t('matching.round2.habits.smoking.options.never'),
        t('matching.round2.habits.smoking.options.occasionally'),
        t('matching.round2.habits.smoking.options.regularly')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

export const R2AcceptSmokerInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.habits.accept_smoker.title')}
      options={[
        t('matching.round2.habits.accept_smoker.options.yes'),
        t('matching.round2.habits.accept_smoker.options.no'),
        t('matching.round2.habits.accept_smoker.options.depends')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

export const R2DrinkingInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.habits.drinking.title')}
      options={[
        t('matching.round2.habits.drinking.options.never'),
        t('matching.round2.habits.drinking.options.occasionally'),
        t('matching.round2.habits.drinking.options.socially'),
        t('matching.round2.habits.drinking.options.regularly')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

export const R2AcceptDrinkingInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <R2SingleChoice 
 
      title={t('matching.round2.habits.accept_drinking.title')}
      options={[
        t('matching.round2.habits.accept_drinking.options.yes'),
        t('matching.round2.habits.accept_drinking.options.no'),
        t('matching.round2.habits.accept_drinking.options.depends')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};
