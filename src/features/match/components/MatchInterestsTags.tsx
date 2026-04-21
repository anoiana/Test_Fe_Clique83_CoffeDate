import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';

const MatchInterestsTags = ({ interests }) => {
  const { t } = useTranslation();
  if (!interests || interests.length === 0) return null;

  return (
    <div className="my-0 p-8 overflow-hidden group">
      <div className="relative z-10 flex flex-col gap-6">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80 drop-shadow-sm">
          {t('match.profile.interests_label')}
        </h4>
        
        <div className="flex flex-wrap gap-2.5">
          {interests.map((interest, index) => (
            <motion.span
              key={interest}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="px-5 py-2 rounded-full text-[13px] font-medium text-primary border border-primary/40 bg-transparent transition-all cursor-default select-none shadow-sm"
            >
              {interest}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchInterestsTags;
