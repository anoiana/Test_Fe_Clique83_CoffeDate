import React from 'react';
import { useTranslation } from 'react-i18next';

interface MatchStorySectionProps {
  hook?: string;
  thesis?: string;
  compatibilityStory?: string;
  label?: string;
}

const MatchStorySection: React.FC<MatchStorySectionProps> = ({ hook, thesis, compatibilityStory, label }) => {
  const { t } = useTranslation();
  
  if (!hook && !thesis && !compatibilityStory) return null;
  
  return (
    <div className="flex flex-col w-full">
      {/* 2. Hook */}
      {hook && (
        <div
          className="max-w-5xl mx-auto w-full px-4 py-8 md:px-12 md:py-12 relative mb-4 text-center"
        >
          <div className="flex flex-col gap-5 md:gap-6 items-center">
            <span className="text-[11px] md:text-[13px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/80 font-bold block drop-shadow-sm">{label || t('match_profile.story_labels.connection_point', 'ĐIỂM KẾT NỐI')}</span>
            <h2 className="text-2xl md:text-4xl font-extralight text-ink leading-relaxed italic tracking-tight drop-shadow-xl max-w-4xl">
              {hook.replace(/^["']+|["']+$/g, '')}
            </h2>
          </div>
        </div>
      )}

      {/* 3. Match Thesis */}
      {thesis && (
        <div
          className="max-w-5xl mx-auto w-full px-4 py-8 md:px-12 md:py-12 relative mb-4 text-center"
        >
          <div className="flex flex-col gap-5 md:gap-6 items-center">
            <span className="text-[11px] md:text-[13px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/80 font-bold block drop-shadow-sm">{label || t('match_profile.story_labels.match_thesis', 'NHẬN ĐỊNH TỪ CLIQUE')}</span>
            <p className="text-2xl md:text-3xl text-ink/90 font-extralight leading-relaxed italic drop-shadow-xl max-w-4xl">
              {thesis.replace(/^["']+|["']+$/g, '')}
            </p>
          </div>
        </div>
      )}

      {/* 5. Compatibility Story */}
      {compatibilityStory && (
        <div
          className="max-w-5xl mx-auto w-full px-4 py-8 md:px-12 md:py-12 relative mb-4 text-center"
        >
          <div className="flex flex-col gap-5 md:gap-6 items-center">
             <span className="text-[11px] md:text-[13px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/80 font-bold drop-shadow-sm">{label || t('match_profile.story_labels.shared_narrative')}</span>
            <p className="text-lg md:text-2xl text-ink/80 font-extralight leading-relaxed tracking-wide drop-shadow-lg max-w-3xl">
              {compatibilityStory.replace(/^["']+|["']+$/g, '')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchStorySection;
