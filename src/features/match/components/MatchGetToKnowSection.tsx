import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';

const MatchGetToKnowSection = ({ prompts }) => {
  const { t } = useTranslation();
  if (!prompts) return null;

  const promptEntries = Object.entries(prompts);
  if (promptEntries.length === 0) return null;

  const formatTitle = (key) => {
    const titles = {
      perfectDay: t('match.profile.prompts.perfectDay'),
      lookingFor: t('match.profile.prompts.lookingFor'),
      friendsDescription: t('match.profile.prompts.friendsDescription'),
    };
    return titles[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <>
      {promptEntries.map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="my-0 p-8 flex flex-col gap-6 overflow-hidden relative group">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {formatTitle(key)}
                </h5>
                {index === 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {t('match.profile.get_to_know_label')}
                  </span>
                )}
              </div>
              <p className="text-ink text-2xl font-light leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default MatchGetToKnowSection;
