import React from 'react';
import { X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface MatchActionButtonsProps {
  profilePicUrl: string;
  onPass: () => void;
  onLike: () => void;
  isVisible: boolean;
}

const MatchActionButtons: React.FC<MatchActionButtonsProps> = ({ profilePicUrl, onPass, onLike, isVisible }) => {
  const { t } = useTranslation();

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 p-8 flex justify-center items-end z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] pb-12 ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-12 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-6 md:gap-12 bg-zinc-950/40 backdrop-blur-2xl px-8 py-5 rounded-[3rem] border border-divider shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
        {/* Pass Button */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPass}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-background-paper border border-divider text-ink/40 hover:text-ink hover:bg-background-warm transition-all shadow-xl"
          >
            <X className="w-8 h-8" />
          </motion.button>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/30">
            {t('match.actions.pass')}
          </span>
        </div>

        {/* Center Profile Marker - Only show if pic exists */}
        {profilePicUrl && (
          <div className="relative group shrink-0 hidden md:block">
            <div className="absolute -inset-2 rounded-full bg-primary/20 blur-[15px] animate-pulse" />
            <div className="relative w-20 h-20 rounded-full border-[2px] border-primary/50 overflow-hidden bg-zinc-950">
              <img 
                src={profilePicUrl} 
                alt="Match Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}


        {/* Interested Button */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLike}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-primary shadow-[0_0_30px_rgba(255,184,0,0.3)] text-black hover:bg-primary/90 transition-all"
          >
            <Heart className="w-8 h-8 fill-current" />
          </motion.button>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/80">
            {t('match.actions.meet')}
          </span>
        </div>
      </div>
    </div>
  );
};


export default MatchActionButtons;
