import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Heart, ArrowRight, UserCheck, Star } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { PageTransition } from '../../../../shared/components/PageTransition';
import { Button } from '../../../../shared/components/Button';

interface Round2IntroProps {
  onStart: () => void;
}

export const Round2Intro: React.FC<Round2IntroProps> = ({ onStart }) => {
  const { t } = useTranslation();

  const facts = [
    { icon: UserCheck, label: t('round2.intro.facts.personality'), color: 'text-primary' },
    { icon: Compass, label: t('round2.intro.facts.lifestyle'), color: 'text-blue-400' },
    { icon: Heart, label: t('round2.intro.facts.values'), color: 'text-rose-400' }
  ];

  return (
    <PageTransition className="fixed inset-0 bg-background-paper z-[200] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Cinematic Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center">


        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-ink text-4xl md:text-5xl font-black leading-[1.1] mb-4 uppercase tracking-tight"
        >
          <Trans i18nKey="round2.intro.title">
            WORLDVIEW & <span className="text-primary italic">LIFESTYLE</span>
          </Trans>
        </motion.h1>

        {/* Cinematic Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-ink/60 text-base font-light mb-6 leading-relaxed px-4"
        >
          {t('round2.intro.description')}
        </motion.p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-2.5 w-full mb-8">
          {facts.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="flex items-center gap-4 p-3.5 rounded-2xl bg-ink/[0.04] border border-divider backdrop-blur-sm group hover:bg-white/[0.08] transition-all"
            >
              <div className={`w-11 h-11 shrink-0 rounded-xl bg-background-warm flex items-center justify-center border border-divider group-hover:border-primary/30 transition-all`}>
                <fact.icon className={`w-5 h-5 ${fact.color}`} />
              </div>
              <span className="text-ink/80 font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">{fact.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full"
        >
          <Button
            variant="golden"
            onClick={onStart}
            icon="auto_awesome"
            className="w-full h-16 rounded-[2rem] text-sm group"
          >
            {t('round2.intro.cta')}
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
};
