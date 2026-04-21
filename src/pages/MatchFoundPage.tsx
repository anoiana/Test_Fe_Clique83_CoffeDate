import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { PageTransition } from '../shared/components/PageTransition';

/**
 * ConfettiParticle Component: Celebratory explosion logic.
 */
const ConfettiParticle = ({ color, index }: { color: string; index: number }) => {
  const angle = (index / 60) * Math.PI * 2;
  const velocity = Math.random() * 400 + 200;
  const xEnd = Math.cos(angle) * velocity;
  const yEnd = Math.sin(angle) * velocity;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{ 
        x: xEnd, 
        y: yEnd, 
        opacity: 0,
        scale: [0, 1.5, 0.5],
        rotate: Math.random() * 360
      }}
      transition={{ 
        duration: Math.random() * 2 + 1, 
        ease: [0.1, 0.9, 0.2, 1],
        delay: Math.random() * 0.2
      }}
      className="absolute w-2 h-2 rounded-sm"
      style={{ backgroundColor: color }}
    />
  );
};

/**
 * MatchFoundPage
 * Intermediate celebratory screen that appears right when a match is detected.
 * Features a logo and a "BOOM" explosion effect.
 */
export const MatchFoundPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [showExplosion, setShowExplosion] = useState(false);
    const state = location.state || {};

    useEffect(() => {
        // Trigger explosion almost immediately
        const timer = setTimeout(() => setShowExplosion(true), 300);
        
        // Auto-navigate to mutual congrats after 4 seconds
        const navTimer = setTimeout(() => {
            if (state.meetingId) {
                navigate('/match/mutual-congrats', { state, replace: true });
            } else {
                // Fallback to match profile if no meeting data
                navigate('/match', { replace: true });
            }
        }, 4000);

        return () => {
            clearTimeout(timer);
            clearTimeout(navTimer);
        };
    }, [navigate, state]);

    return (
        <PageTransition className="fixed inset-0 bg-background-paper z-[200] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            {/* Explosion Particles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
                <AnimatePresence>
                    {showExplosion && (
                        <>
                            {[...Array(60)].map((_, i) => <ConfettiParticle key={`gold-${i}`} index={i} color="var(--c-primary)" />)}
                            {[...Array(30)].map((_, i) => <ConfettiParticle key={`white-${i}`} index={i} color="#FFFFFF" />)}
                        </>
                    )}
                </AnimatePresence>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Clique Logo */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="mb-12"
                >
                    <img src="./logo.png" alt="Clique Logo" className="w-32 md:w-40 h-auto" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        <span className="typo-caption-supreme text-primary/60 tracking-[0.3em] uppercase">
                            {t('match_mutual.status') || 'ĐÃ KẾT NỐI'}
                        </span>
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-ink tracking-tighter uppercase italic leading-tight px-4">
                        <Trans i18nKey="match_mutual.title_short">
                            IT'S A <span className="text-primary">MATCH!</span>
                        </Trans>
                    </h1>
                    
                    <p className="typo-desc text-ink/60 max-w-[280px] mx-auto mt-4">
                        {t('match.intro.found_someone') || 'Chúng tôi đã tìm thấy một người cho bạn'}
                    </p>
                </motion.div>
            </div>
            
            {/* Subtle Overlay Decoration */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-divider m-4 rounded-[40px] z-0" />
        </PageTransition>
    );
};
