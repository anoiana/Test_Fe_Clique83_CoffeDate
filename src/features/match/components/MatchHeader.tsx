import React from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MatchHeader = ({ scrollProgress, isMuted, onToggleSound, onBack }) => {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 px-6 py-5 md:py-8 flex w-full z-50 pointer-events-none">
      <div className="flex items-center justify-between pointer-events-auto w-full max-w-5xl mx-auto gap-6 bg-black/20 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-3 md:p-0 rounded-full border border-divider md:border-none shadow-xl md:shadow-none">
        
        {/* Progress Bar centered harmoniously */}
        <div className="flex-1 h-1 md:h-1.5 bg-ink/5 rounded-full overflow-hidden backdrop-blur-xl border border-divider ml-2 md:ml-0">
          <motion.div
            style={{ width: scrollProgress }}
            className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/80 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.6)] transform-gpu"
          />
        </div>

        <button
          onClick={onToggleSound}
          aria-label={t('match.aria.toggle_sound')}
          className="p-2 hover:bg-ink/5 rounded-full transition-colors bg-black/20 backdrop-blur-md border border-divider"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-ink" />
          ) : (
            <Volume2 className="w-6 h-6 text-ink" />
          )}
        </button>
      </div>
    </header>
  );
};

export default MatchHeader;
