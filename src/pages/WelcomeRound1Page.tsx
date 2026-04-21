import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../shared/components/Button';
import { ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';

export const WelcomeRound1Page: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // Trigger explosion effect shortly after mount
    const timer = setTimeout(() => setShowParticles(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    navigate('/onboarding');
  };

  // Generate random particles for the explosion
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    angle: (i / 40) * 360,
    distance: Math.random() * 200 + 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 1.5 + 1,
  }));

  return (
    <div className="relative w-full h-[100dvh] bg-background-paper overflow-hidden flex flex-col items-center justify-center px-8 text-center">
      {/* ── Background Mesh ── */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'var(--gradient-mesh)' }} />
      
      {/* ── Explosion Particles ── */}
      <AnimatePresence>
        {showParticles && particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
              y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
              opacity: 0,
              scale: 0.5,
            }}
            transition={{ duration: p.duration, ease: "easeOut" }}
            className="absolute z-50 rounded-full bg-primary/60 pointer-events-none"
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </AnimatePresence>

      <div className="relative z-[100] max-w-md w-full flex flex-col items-center">
        {/* ── Success Icon / Logo ── */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.1 
          }}
          className="flex items-center justify-center mb-10 overflow-hidden"
        >
          <img src={logo} alt="Clique83" className="w-40 h-40 object-contain" />
        </motion.div>

        {/* ── Content ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h2 className="typo-ritual-label-small text-primary tracking-[0.3em] font-bold">
              {t('onboarding.welcome_round1.congrats')}
            </h2>
            <h1 className="typo-ritual-h1 text-ink leading-tight text-4xl">
              {t('onboarding.welcome_round1.intro_title')}
            </h1>
          </div>
          
          <p className="typo-ritual-body text-ink/70 max-w-xs mx-auto leading-relaxed italic font-serif text-[15px]">
            {t('onboarding.welcome_round1.joined_clique')}
          </p>

          <div className="h-[1px] w-12 bg-divider/40 mx-auto" />

          <div className="space-y-4">
            <p className="typo-ritual-body text-ink/80 text-sm">
              {t('onboarding.welcome_round1.intro_desc')}
            </p>
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-14 w-full"
        >
          <Button
            variant="golden"
            onClick={handleStart}
            className="w-full h-[50px] rounded-3xl shadow-burgundy flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
          >
            <span className="uppercase tracking-[0.2em] font-bold text-background-paper text-sm">
              {t('onboarding.welcome_round1.cta')}
            </span>
            <ChevronRight className="size-5 text-background-paper" />
          </Button>
        </motion.div>
      </div>

      {/* ── Paper Texture Overlay ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('/assets/paper-texture.png')] z-50" />
    </div>
  );
};

export default WelcomeRound1Page;
