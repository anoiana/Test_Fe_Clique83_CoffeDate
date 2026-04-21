import React from 'react';
import { Button } from '../../../shared/components/Button';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import logo from '../../../assets/logo.png';
import { CubicBezier } from '../../../shared/types/index';

export const WelcomeScreen = ({ isStarted, onStart }) => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as CubicBezier
      }
    }
  };

  return (
    <motion.div
      initial="visible"
      animate={isStarted ? { opacity: 0, scale: 0.98, y: -20, pointerEvents: 'none' } : "visible"}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-0 flex flex-col items-center px-6 pt-12 pb-10 text-center bg-background-paper"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center w-full max-w-md mx-auto h-full"
      >
        {/* TOP SECTION: LOGO */}
        <div className="flex-1 flex flex-col items-center justify-center mb-4">
          <motion.div variants={itemVariants} className="relative mb-10 flex items-center justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 transition-transform duration-700 hover:scale-105 active:scale-95 logo-glow">
              <img
                src={logo}
                alt="Clique Official Logo"
                className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(122,46,46,0.15)]"
              />
            </div>
          </motion.div>

          {/* MIDDLE SECTION: VALUE PROPOSITION */}
          <div className="space-y-4 px-4">
            <motion.p variants={itemVariants} className="text-ink/50 text-[13px] sm:text-[14px] font-normal tracking-[0.1em] drop-shadow-md whitespace-pre-line">
              <Trans i18nKey="auth.welcome.no_endless_swiping" components={[<span className="italic" />]} />
            </motion.p>
            <motion.h1 variants={itemVariants} className="text-ink text-2xl sm:text-3xl font-normal tracking-tight leading-[1.1] drop-shadow-2xl whitespace-pre-line font-serif">
              <Trans i18nKey="auth.welcome.believe_in_the_one" components={[<span className="text-primary italic drop-shadow-none" />, <span className="text-primary italic drop-shadow-none" />]} />
            </motion.h1>
          </div>
        </div>

        {/* BOTTOM SECTION: CTA BUTTONS */}
        <motion.div variants={itemVariants} className="w-full px-6 mt-auto pb-6 sm:pb-10 space-y-3">
          {/* Primary Option: Google */}
          <Button
            variant="golden"
            onClick={() => onStart('google')}
            className="w-full relative shadow-golden-btn"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="size-5 fill-background-paper" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-8.01 2.47-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-[13px] font-black uppercase tracking-[0.2em]">{t('auth.welcome.google_login', 'Tiếp tục bằng Google')}</span>
            </div>
          </Button>

          {/* Secondary Option: Other methods */}
          <Button
            variant="glass"
            onClick={() => onStart('email')}
            className="w-full bg-background-warm/30 border-divider/40"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70">{t('auth.welcome.other_method', 'Đăng nhập cách khác')}</span>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
