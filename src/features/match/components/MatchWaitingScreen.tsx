import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoldenParticlesBackground } from '../../../shared/components/GoldenParticlesBackground';
import { SettingsDrawer } from '../../../shared/components/SettingsDrawer';

const MatchWaitingScreen = () => {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <div className="min-h-screen w-full bg-background-paper text-ink flex items-center justify-center px-6 relative overflow-hidden">
      {/* Shared golden atmosphere */}
      <GoldenParticlesBackground particleCount={15} glowSize={400} glowIntensity="soft" />

      {/* Standardized Header Controls */}
      <div className="fixed top-0 left-0 w-full z-[120] pointer-events-none">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="size-8 sm:size-10 rounded-full bg-background-warm flex items-center justify-center border border-divider shadow-lg text-primary transition-all active:scale-95"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <SettingsDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <div className="relative z-10 max-w-sm w-full flex flex-col items-center text-center gap-10">
        {/* Scanning Icon */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-6 border border-divider rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-12 border border-primary/10 rounded-full border-dashed"
          />

          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-background-warm border border-divider flex items-center justify-center backdrop-blur-xl relative overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-primary/10"
            />
            <Search className="w-10 h-10 text-primary/80 relative z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background-paper border border-primary/30 flex items-center justify-center"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="block text-[10px] uppercase tracking-[0.6em] font-bold text-primary/50"
          >
            {t('match_waiting.status')}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-light tracking-tight italic"
          >
            {t('match_waiting.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-ink/50 text-sm font-light leading-relaxed"
          >
            {t('match_waiting.subtitle')}
          </motion.p>
        </div>

      </div>
    </div>
  );
};

export default MatchWaitingScreen;
