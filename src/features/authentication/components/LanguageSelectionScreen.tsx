import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logo from '../../../assets/logo.png';

/**
 * LanguageSelectionScreen — The Ritual Style
 * Paper background with warm burgundy cards for language choice.
 */
interface LanguageSelectionScreenProps {
  onSelect: (lang: string) => void;
}

export const LanguageSelectionScreen = ({ onSelect }: LanguageSelectionScreenProps) => {
  const { i18n } = useTranslation();

  const handleSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('clique_lang_chosen', 'true');
    onSelect(lang);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const languages = [
    {
      code: 'en',
      name: 'English',
      native: 'English',
      flag: '🇬🇧',
      desc: 'Continue in English',
    },
    {
      code: 'vi',
      name: 'Tiếng Việt',
      native: 'Vietnamese',
      flag: '🇻🇳',
      desc: 'Tiếp tục bằng Tiếng Việt',
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background-paper px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Ambient background glows */}
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-kraft/10 rounded-full blur-[100px] pointer-events-none z-0 opacity-30" />
      <div className="fixed bottom-0 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none z-0 opacity-20" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center w-full max-w-sm mx-auto relative z-10"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="w-28 h-28 logo-glow">
            <img
              src={logo}
              alt="Clique83"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-2">
          <h1 className="text-2xl sm:text-3xl text-ink font-black uppercase tracking-tight font-serif">
            Choose Your Language
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-10">
          <p className="text-ink/40 text-sm">
            Chọn ngôn ngữ của bạn
          </p>
        </motion.div>

        {/* Language Cards */}
        <div className="w-full space-y-4">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              variants={itemVariants}
              onClick={() => handleSelect(lang.code)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full group relative overflow-hidden rounded-3xl border border-divider bg-background-warm p-5 sm:p-6 text-left transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.05] hover:shadow-[0_0_40px_rgba(122,46,46,0.08)] active:bg-primary/10"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex items-center gap-4">
                {/* Flag */}
                <div className="w-14 h-14 rounded-2xl bg-ink/[0.03] border border-divider flex items-center justify-center text-3xl group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300 shrink-0">
                  {lang.flag}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg font-black text-ink tracking-wide group-hover:text-primary transition-colors duration-300">
                    {lang.name}
                  </span>
                  <span className="text-[11px] font-bold text-ink/30 uppercase tracking-widest group-hover:text-ink/50 transition-colors duration-300">
                    {lang.desc}
                  </span>
                </div>

                {/* Arrow */}
                <div className="ml-auto shrink-0">
                  <span className="material-symbols-outlined text-ink/10 group-hover:text-primary/60 transition-all duration-300 group-hover:translate-x-1 inline-block text-xl">
                    arrow_forward
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
