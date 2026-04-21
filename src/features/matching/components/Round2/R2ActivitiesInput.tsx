import React from 'react';
import { useTranslation } from 'react-i18next';
import { R2MultiSelect } from './R2MultiSelect';

export const R2ActivitiesInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  return (
    <R2MultiSelect 
 
      title={t('matching.round2.activities.title')} 
      description={t('matching.round2.activities.description')}
      showOther={true} 
      showSelectAll={true}
      otherLabel={t('matching.round2.common.other')}
      options={[
        t('matching.round2.activities.options.traveling'),
        t('matching.round2.activities.options.fitness_gym'),
        t('matching.round2.activities.options.outdoor_sports'),
        t('matching.round2.activities.options.yoga_wellness'),
        t('matching.round2.activities.options.reading'),
        t('matching.round2.activities.options.movies_netflix'),
        t('matching.round2.activities.options.music_concerts'),
        t('matching.round2.activities.options.cooking_food'),
        t('matching.round2.activities.options.cafe_hopping'),
        t('matching.round2.activities.options.nightlife_bars'),
        t('matching.round2.activities.options.art_exhibitions'),
        t('matching.round2.activities.options.photography'),
        t('matching.round2.activities.options.gaming'),
        t('matching.round2.activities.options.business_networking'),
        t('matching.round2.activities.options.volunteering'),
        t('matching.round2.activities.options.spiritual_meditation')
      ]}
      value={value} 
      onChange={onChange} 
      onNext={onNext} 
      onBack={onBack} 
    />
  );
};

