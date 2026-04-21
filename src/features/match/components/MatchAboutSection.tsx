import React from 'react';
import { Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';

const MatchAboutSection = ({ name, introText }) => {
  const { t } = useTranslation();
  if (!introText) return null;

  return (
    <div className="my-0 p-8 relative overflow-hidden group">
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Quote className="w-5 h-5 text-primary opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {t('match.profile.about_label', { name: name })}
          </h4>
        </div>
        
        <p className="text-ink text-3xl font-extralight italic leading-relaxed tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          "{introText}"
        </p>
      </div>
    </div>
  );
};

export default MatchAboutSection;
