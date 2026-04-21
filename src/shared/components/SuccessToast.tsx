import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SuccessToastProps {
  isVisible: boolean;
  message: string;
  onClear: () => void;
  variant?: 'success' | 'error';
}

/**
 * Cinematic Notification for Clique 83.
 * Premium theme to match the brand's high-end identity.
 */
export const SuccessToast: React.FC<SuccessToastProps> = ({ isVisible, message, onClear, variant = 'success' }) => {
  const { t } = useTranslation();
  
  const isError = variant === 'error';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-10 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-sm px-4"
        >
          <div className={`relative overflow-hidden glass-effect-premium border p-5 shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-2xl ${isError ? 'border-red-500/30' : 'border-primary/20'}`}>
            {/* Top Glow */}
            <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-current to-transparent shadow-[0_0_15px_rgba(255,215,0,0.5)] ${isError ? 'text-red-500' : 'text-primary'}`} />
            
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl shadow-inner ${isError ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                {isError ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`typo-toast-title mb-1 ${isError ? 'text-red-400' : 'text-primary'}`}>
                  {isError ? t('shared.error.title', 'Error') : t('shared.success.title', 'Success')}
                </h3>
                <p className="typo-toast-body leading-snug">
                  {message || t('shared.success.default_message')}
                </p>
              </div>
            </div>
            
            {/* Branding Watermark */}
            <div className="absolute bottom-1.5 right-4 opacity-[0.05] pointer-events-none">
              <span className="typo-toast-brand text-ink italic">CLIQUE 83</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
