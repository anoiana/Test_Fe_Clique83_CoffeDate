import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MatchRealismSection = ({ watchout }: { watchout?: Array<{ point: string; detail: string }> }) => {
  const { t } = useTranslation();
  
  if (!watchout || watchout.length === 0) return null;

  return (
    <div
      className="max-w-5xl mx-auto w-full px-4 py-8 md:px-12 md:py-16 relative flex flex-col items-center gap-8 mb-4 text-center"
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-primary/0 flex items-center justify-center">
          <ShieldCheck className="w-10 h-10 text-primary drop-shadow-md" />
        </div>
      </div>
      <div className="flex flex-col gap-6 md:gap-8 items-center max-w-4xl w-full">
        <span className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary/80 font-bold drop-shadow-sm">{t('match_profile.realism.label', 'LỜI KHUYÊN TỪ CLIQUE')}</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
          {watchout.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-3 items-center md:items-start text-center md:text-left bg-background-warm p-6 md:p-8 rounded-2xl border border-divider">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-ink/90">{item.point}</span>
              <p className="text-lg md:text-xl font-light text-ink/70 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MatchRealismSection;
