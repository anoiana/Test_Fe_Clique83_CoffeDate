import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-background-paper rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border border-divider"
          >
            <div className="flex items-center justify-between p-6 pb-2 min-h-14">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {title && (
                    <motion.h3
                      key={title}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 0.7, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="typo-modal-title"
                    >
                      {title}
                    </motion.h3>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={onClose}
                className="size-10 rounded-full bg-background-warm flex items-center justify-center hover:bg-ink/5 transition-colors active:scale-90 border border-divider"
              >
                <span className="material-symbols-outlined text-ink/70 text-xl">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
