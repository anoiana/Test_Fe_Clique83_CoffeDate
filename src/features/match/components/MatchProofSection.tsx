import React from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MatchProofSection = ({ fastProof }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-[12px] md:text-[14px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary/80 font-bold drop-shadow-sm">{t('match_profile.proof.label')}</span>
        <h3 className="text-2xl md:text-3xl font-light text-ink tracking-wide leading-tight uppercase drop-shadow-lg px-4 text-balance">{t('match_profile.proof.title')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {Array.isArray(fastProof) && fastProof.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-6 p-6 group transition-all text-center"
          >
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Check className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
            </div>
            <p className="text-xl text-ink font-light leading-snug drop-shadow-md">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchProofSection;
