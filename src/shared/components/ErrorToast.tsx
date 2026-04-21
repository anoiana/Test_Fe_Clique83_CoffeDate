import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Cinematic Error Notification for Clique 83.
 * Matches the brand identity with a high-end dark feel and red accents.
 */
export const ErrorToast = ({ isVisible, message, onClear }) => {
  const { t } = useTranslation();
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-sm px-4"
        >
          <div className="relative overflow-hidden glass-effect-premium border border-red-500/20 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            {/* Background Accent Glow */}
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                <AlertCircle size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="typo-toast-title text-red-500 mb-0.5">
                  {t('shared.error.system_error')}
                </h3>
                <p className="typo-toast-body line-clamp-2 leading-relaxed">
                  {message || t('shared.error.unexpected')}
                </p>
              </div>
            </div>
            
            {/* Decorative Brand Text */}
            <div className="absolute bottom-1 right-3 opacity-10 pointer-events-none">
              <span className="typo-toast-brand text-ink">CLIQUE 83</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
