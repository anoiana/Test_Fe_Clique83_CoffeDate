import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MatchIntroOverlayProps {
  isVisible: boolean;
  introStage: number;
  matchData: {
    name: string;
    city: string;
    job: string;
    age: number;
  };
}

const MatchIntroOverlay: React.FC<MatchIntroOverlayProps> = ({ isVisible, introStage, matchData }) => {
  const { t, i18n } = useTranslation();
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink/60 backdrop-blur-3xl overflow-hidden px-10 text-center"
    >
      <AnimatePresence mode="wait">
        {/* Stage 1: Finding Message */}
        {introStage === 1 && (
          <motion.div
            key="stage1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-xs md:text-sm uppercase tracking-[0.25em] font-black text-primary mb-6">
              {t('match.intro.found_someone')}
            </span>
          </motion.div>
        )}

        {/* Stage 2: Name Reveal */}
        {introStage === 2 && (
          <motion.div
            key="stage2"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h1 className="text-6xl md:text-8xl font-black text-primary italic tracking-tighter drop-shadow-[0_0_35px_rgba(255,215,0,0.5)]">
              {matchData.name}
            </h1>
          </motion.div>
        )}

        {/* Stage 3: Details & Anthem Teaser */}
        {introStage === 3 && (
          <motion.div
            key="stage3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="flex flex-col items-center justify-center gap-2 md:gap-4 text-ink/80 text-xl md:text-2xl font-light mb-12 text-center text-balance">
              {matchData.city && (
                <span className="drop-shadow-md">{matchData.city}</span>
              )}
              {matchData.job && (
                <span className="drop-shadow-md">{matchData.job}</span>
              )}
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-2 text-primary/80 font-black tracking-[0.2em] text-[10px] uppercase">
                <User className="w-3.5 h-3.5" />
                <span>{t('match.intro.age_label')}</span>
              </div>
              <div className="glass-effect-premium px-10 py-5 rounded-[2.5rem] border border-divider flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center relative z-10">
                  <User className="text-primary w-7 h-7" />
                </div>
                <div className="flex flex-col text-left relative z-10">
                  <span className="text-ink text-3xl font-black leading-tight tracking-tight">{matchData.age}</span>
                  <span className="text-ink/40 text-sm font-medium uppercase tracking-widest">
                    {t('match.intro.years_old')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Background / Particles would stay here if they were inside, but they are outside in Page level */}
      
    </motion.div>
  );
};

export default MatchIntroOverlay;
