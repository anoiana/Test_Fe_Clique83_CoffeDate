import React from 'react';
import { motion } from 'framer-motion';
import { Hourglass, Heart, Home, ArrowRight, Bell } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GoldenParticlesBackground } from '../../../shared/components/GoldenParticlesBackground';

interface MatchWaitResponseScreenProps {
  matchName: string;
}

const MatchWaitResponseScreen: React.FC<MatchWaitResponseScreenProps> = ({ matchName }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background-paper text-ink flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Shared atmospheric background */}
      <GoldenParticlesBackground particleCount={15} glowSize={400} glowIntensity="soft" />

      <div className="relative z-10 max-w-sm w-full flex flex-col items-center text-center gap-10 font-sans">
        {/* Pulsing Icon */}
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
          />
          
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-background-warm border border-divider flex items-center justify-center backdrop-blur-3xl relative">
            <motion.div
              animate={{ y: [0, -3, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="w-10 h-10 text-primary fill-primary/30" />
            </motion.div>
          </div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background-paper border border-primary/30 flex items-center justify-center"
          >
            <Hourglass className="w-4 h-4 text-primary" />
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <div className="space-y-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="block text-[10px] uppercase tracking-[0.6em] font-black text-primary/50"
            >
              {t('match_waiting_response.status')}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-light tracking-tight italic uppercase"
            >
              {t('match_waiting_response.title')}
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <p className="text-ink/80 text-base font-light">
              <Trans i18nKey="match_waiting_response.sent_to" values={{ name: matchName }}>
                Bạn đã gửi lời mời tới <span className="text-primary font-bold">{matchName}</span>
              </Trans>
            </p>

          </motion.div>
        </div>

        {/* Status Card - Visual focus for mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-ink/[0.04] border border-divider rounded-2xl p-4 backdrop-blur-md flex items-center gap-4 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-ink/90 uppercase tracking-wider">{t('match_waiting_response.notification_title')}</h4>
            <p className="text-[11px] text-ink/40 leading-normal mt-0.5">
              {t('match_waiting_response.notification_desc')}
            </p>
          </div>
        </motion.div>

        {/* Removed Simplified Action as requested */}
      </div>
    </div>
  );
};

export default MatchWaitResponseScreen;
