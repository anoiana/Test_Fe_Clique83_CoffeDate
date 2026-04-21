import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export interface MultiSelectIndicatorProps {
  /**
   * The current number of items the user has selected.
   */
  currentCount: number;

  /**
   * The maximum number of items the user can select.
   * This determines the number of dashes rendered.
   */
  maxCount: number;

  /**
   * Optional custom ready text. Defaults to SẴN SÀNG or READY based on locale.
   */
  readyText?: string;
  
  /**
   * Minimum count required to show the READY text. Defaults to 1.
   */
  minRequired?: number;
}

/**
 * MultiSelectIndicator
 * Renders a segmented dashed progress bar matching the cinematic UI.
 * Displays a glowing 'SẴN SÀNG' text when user has selected enough items.
 */
export const MultiSelectIndicator: React.FC<MultiSelectIndicatorProps> = ({
  currentCount,
  maxCount,
  readyText,
  minRequired = 1
}) => {
  const { t } = useTranslation();
  
  const displayReadyText = readyText || t('shared.ready');
  
  const isReady = currentCount >= minRequired;

  return (
    <div className="flex items-center mt-4 mb-2 w-full max-w-[320px] min-h-[12px]">
      <div className="flex items-center gap-[8px]">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: currentCount }).map((_, idx) => (
            <motion.div 
              key={`dash-${idx}`}
              layout
              initial={{ opacity: 0, scale: 0, x: -10 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: 0,
                boxShadow: ["0px 0px 0px rgba(209,169,62,0)", "0px 0px 15px rgba(209,169,62,0.6)", "0px 0px 5px rgba(209,169,62,0.3)"]
              }}
              exit={{ opacity: 0, scale: 0.5, x: 5, transition: { duration: 0.2 } }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 25,
                boxShadow: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                }
              }}
              className="h-[5px] w-[32px] rounded-full bg-primary relative"
            >
                {/* Bloom effect layer */}
                <div className="absolute inset-0 rounded-full bg-primary blur-[4px] opacity-40 animate-pulse" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* SẴN SÀNG Text with floating animation */}
      <AnimatePresence>
        {isReady && (
            <motion.span 
              initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 10, filter: "blur(2px)" }}
              className="typo-label ml-6 text-primary whitespace-nowrap text-glow-gold"
            >
               {displayReadyText}
            </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
