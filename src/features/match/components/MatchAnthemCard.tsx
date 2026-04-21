import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';

const MatchAnthemCard = ({ anthem, isPlaying = false, onTogglePlay }) => {
  const { t } = useTranslation();
  if (!anthem) return null;

  return (
    <div className="my-0 p-4 flex items-center gap-6 transition-all bg-ink/[0.04] border border-divider rounded-2xl backdrop-blur-sm">
      <div className="w-20 h-20 rounded-xl overflow-hidden shadow-2xl border border-divider shrink-0">
        <img 
          src={anthem.albumCoverUrl} 
          alt={anthem.song} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-bold mb-2 block drop-shadow-sm">
          {t('match.profile.anthem_label')}
        </span>
        <h3 className="text-ink text-xl font-bold truncate drop-shadow-md">{anthem.song}</h3>
        <p className="text-ink/60 text-sm truncate drop-shadow-sm">{anthem.artist}</p>
      </div>

      <button 
        onClick={onTogglePlay}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all border border-primary/20 active:scale-90 group"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 fill-current" />
        ) : (
          <Play className="w-6 h-6 fill-current ml-1" />
        )}
      </button>
    </div>
  );
};

export default MatchAnthemCard;
