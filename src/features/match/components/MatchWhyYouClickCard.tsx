import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';

const MatchWhyYouClickCard = ({ reason }) => {
  const { t } = useTranslation();
  if (!reason) return null;

  return (
    <div className="my-8 p-1 relative overflow-hidden group border-l-2 border-primary/30 pl-8 bg-white/[0.02] rounded-r-2xl backdrop-blur-[2px]">
      <div className="flex flex-col gap-5 relative z-10">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-primary fill-primary drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/90 drop-shadow-sm">
            {t('match.profile.why_click_label')}
          </span>
        </div>
        
        <p className="text-ink text-2xl font-extralight leading-relaxed drop-shadow-md">
          {reason}
        </p>
      </div>
    </div>
  );
};

export default MatchWhyYouClickCard;
