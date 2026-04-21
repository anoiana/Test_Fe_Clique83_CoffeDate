import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * LanguageSwitcher — The Ritual Style
 * Paper-based toggle with burgundy accents.
 */
export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const isVI = currentLang.startsWith('vi');

  return (
    <div className="flex items-center gap-1 p-1 bg-background-warm rounded-full border border-divider shadow-inner">
      <button
        onClick={() => setLanguage('en')}
        className={`relative px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${!isVI ? 'text-primary' : 'text-ink/30 hover:text-ink/60'}`}
      >
        {!isVI && (
          <motion.div
            layoutId="lang-bg"
            className="absolute inset-0 bg-primary/10 rounded-full border border-primary/20"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>

      <div className="w-px h-3 bg-divider mx-0.5" />

      <button
        onClick={() => setLanguage('vi')}
        className={`relative px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${isVI ? 'text-primary' : 'text-ink/30 hover:text-ink/60'}`}
      >
        {isVI && (
          <motion.div
            layoutId="lang-bg"
            className="absolute inset-0 bg-primary/10 rounded-full border border-primary/20"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">VI</span>
      </button>
    </div>
  );
};
