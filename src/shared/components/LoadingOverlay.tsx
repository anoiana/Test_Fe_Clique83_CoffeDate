import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

/**
 * Loading Overlay — The Ritual Style
 * Paper background with Burgundy accents and warm organic animations.
 */
export const LoadingOverlay = ({ isVisible, message }) => {
  const { t } = useTranslation();
  const displayMessage = message || t('shared.loading.preparing');
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'circOut' }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background-paper/98 backdrop-blur-2xl"
        >
          {/* Central Logo Container */}
          <div className="relative flex items-center justify-center mb-16">
            {/* Animated Concentric Rings */}
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.05, 0.2, 0.05]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-64 h-64 border-[0.5px] border-primary/40 rounded-full"
            />
            
            <motion.div
              animate={{ 
                scale: [1, 1.25, 1],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute w-48 h-48 border-[1px] border-primary/60 rounded-full"
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              className="absolute w-32 h-32 border-t-[3px] border-primary rounded-full glow-gold-md"
            />

            {/* Inner Brand Logo */}
            <div className="w-24 h-24 border-[2.5px] border-primary rounded-full flex items-center justify-center bg-background-paper/80 backdrop-blur-md shadow-[inset_0_0_15px_rgba(122,46,46,0.08)] overflow-hidden">
               <img src={logo} alt="Clique83" className="w-18 h-18 object-contain" />
            </div>
          </div>

          {/* Brand Text */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: "backOut" }}
            className="text-center space-y-4"
          >
             <div className="flex flex-col gap-1 items-center">
                <h2 className="text-primary text-3xl font-black tracking-[0.45em] uppercase leading-none font-serif">
                CLIQUE 83
                </h2>
                <div className="h-[2px] w-12 bg-primary/20 rounded-full mt-1" />
             </div>

            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.2, 1, 0.2],
                    scale: [0.7, 1.2, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                  className="w-2 h-2 bg-primary rounded-full glow-gold-sm"
                />
              ))}
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-ink/40 typo-ritual-label-small mt-8 pl-[0.5em] transition-all"
            >
              {displayMessage}
            </motion.p>
          </motion.div>
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none opacity-40 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
