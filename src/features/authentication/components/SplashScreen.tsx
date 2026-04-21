import React from 'react';
import { motion } from 'framer-motion';
import logo from '../../../assets/logo.png';

/**
 * SplashScreen — The Ritual Style
 * Paper background with warm burgundy glow entrance animation.
 */
interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background-paper"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Ambient glow behind logo */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      {/* Logo */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 800);
        }}
      >
        <div className="w-56 h-56 sm:w-64 sm:h-64 logo-glow">
          <img
            src={logo}
            alt="Clique83 Logo"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </motion.div>

      {/* Subtle loading indicator */}
      <motion.div
        className="absolute bottom-20 flex gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/60"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
