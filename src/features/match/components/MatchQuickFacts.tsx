import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, Heart, Baby, Ruler, Ban, GlassWater } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { MatchFacts } from '../../../shared/types/models';

interface MatchQuickFactsProps {
  quickFacts: MatchFacts;
}

export const MatchQuickFacts = ({ quickFacts }: MatchQuickFactsProps) => {

  const { t, i18n } = useTranslation();
  if (!quickFacts) return null;

  const translateValue = (category: string, val: string | number | null | undefined) => {
    if (val === null || val === undefined) return '';
    const strVal = String(val);
    if (!strVal) return strVal;
    const lowVal = strVal.toLowerCase().trim();
    
    // Mapping categories to translation keys
    const mappings: Record<string, string> = {
      intention: 'intake.looking_for.options',
      children: 'matching.round2.children_view.options',
      smoking: 'matching.round2.habits.smoking.options',
      drinking: 'matching.round2.habits.drinking.options',
      job: 'intake.work_field.options',
      city: 'common.cities',
      pets: 'matching.round2.pet.options',
      religion: 'matching.round2.religion.options',
      marital_status: 'matching.round2.marital_status.options'
    };

    const baseKey = mappings[category];
    if (!baseKey) return strVal;

    // Direct value-to-key mapping for backend human-readable strings
    const valueMap: Record<string, string> = {
      // Smoking
      'non-smoker': 'never',
      'not at all': 'never',
      'never': 'never',
      'socially': 'socially',
      'occasionally': 'occasionally',
      'regularly': 'regularly',

      // Children
      'i want children': 'want_children',
      'i already have children': 'already_have',
      'i don\'t want children': 'no_children',
      'open / undecided': 'open_undecided',

      // Pets (for Full Profile)
      'i love pets': 'love',
      'i\'m okay with pets': 'okay',
      'i prefer not to have pets': 'no_pets',
      'i\'m allergic': 'allergic',

      // Intention
      'long-term relationship': 'long_term',
      'short-term relationship': 'short_term',
      'not sure yet': 'not_sure',

      // Marital Status
      'single (never married)': 'single'
    };

    let key = valueMap[lowVal];

    if (!key) {
      // Handle key generation fallback (lowercase, replace spaces with underscores)
      key = lowVal
        .replace(' (not rushing)', '')
        .replace(' relationship', '')
        .replace(' partners', '')
        .replace(' / ', '_')
        .replace(' , ', '_')
        .replace(' ', '_');
    }
    
    // Special case for cities
    if (category === 'city') {
      if (lowVal.includes('hồ chí minh') || lowVal === 'hcm') key = 'hcm';
      if (lowVal.includes('hà nội')) key = 'hanoi';
      if (lowVal.includes('đà nẵng')) key = 'danang';
    }

    const translated = t(`${baseKey}.${key}`);
    
    return translated !== `${baseKey}.${key}` ? translated : strVal;
  };

  const QuickFactItem = ({ labelKey, value }: { labelKey: string; value: React.ReactNode }) => (
    <div className="flex flex-col items-center gap-1.5 md:gap-2 min-w-[120px] md:min-w-[140px]">
      <span className="text-[12px] md:text-[14px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-primary/80 text-center drop-shadow-sm">
        {t(`match_profile.labels.${labelKey}`)}
      </span>
      <span className="text-lg md:text-xl font-light text-ink/90 text-center">
        {value}
      </span>
    </div>
  );

  return (
    <div className="py-12 md:py-24 px-4 md:px-8 flex flex-col items-center gap-12 border-y border-divider bg-gradient-to-b from-primary/[0.01] via-transparent to-primary/[0.01]">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-[12px] md:text-[14px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary/80 font-bold drop-shadow-sm">{t('match_profile.quick_facts.snapshot')}</span>
        <h3 className="text-2xl md:text-3xl font-light text-ink tracking-wide leading-tight uppercase drop-shadow-lg px-4 text-balance">{t('match_profile.quick_facts.title')}</h3>
      </div>

      <div className="w-full max-w-4xl relative group">
        <div className="relative py-8 flex flex-col gap-10 md:gap-12 items-center text-center drop-shadow-lg">
          {/* Row 1: Identity */}
          <div className="flex flex-wrap justify-center items-start gap-8 md:gap-12">
            <QuickFactItem labelKey="age" value={quickFacts.age} />
            <QuickFactItem labelKey="city" value={translateValue('city', quickFacts.city)} />
            <QuickFactItem labelKey="job" value={translateValue('job', quickFacts.job)} />
          </div>

          <div className="h-px w-20 md:w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Row 2: Intent & Kids */}
          <div className="flex flex-wrap justify-center items-start gap-8 md:gap-12 italic">
            <QuickFactItem labelKey="intention" value={translateValue('intention', quickFacts.intention)} />
            <QuickFactItem labelKey="children" value={translateValue('children', quickFacts.children)} />
          </div>

          <div className="h-px w-20 md:w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Row 3: Measurement & Lifestyle */}
          <div className="flex flex-wrap justify-center items-start gap-8 md:gap-12 text-ink/70 tracking-wide uppercase">
            <QuickFactItem labelKey="height" value={`${quickFacts.height} cm`} />
            <QuickFactItem labelKey="smoking" value={translateValue('smoking', quickFacts.smoking)} />
            <QuickFactItem labelKey="drinking" value={translateValue('drinking', quickFacts.drinking)} />
          </div>

          {/* Row 4: Personality & Background */}
          {(quickFacts.mbti || quickFacts.religion || quickFacts.maritalStatus) && (
            <>
              <div className="h-px w-20 md:w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex flex-wrap justify-center items-start gap-8 md:gap-12">
                {quickFacts.mbti && (
                  <QuickFactItem labelKey="mbti" value={quickFacts.mbti} />
                )}
                {quickFacts.religion && (
                  <QuickFactItem labelKey="religion" value={quickFacts.religion} />
                )}
                {quickFacts.maritalStatus && (
                  <QuickFactItem labelKey="marital_status" value={quickFacts.maritalStatus} />
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};



export default MatchQuickFacts;
