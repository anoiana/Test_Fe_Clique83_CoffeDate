import React from 'react';
import { Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MatchDateVisualization = ({ questions }: { questions?: Array<{ question: string }> }) => {
  const { t } = useTranslation();
  
  if (!questions || questions.length === 0) return null;

  return (
    <div
      className="max-w-5xl mx-auto w-full px-8 py-10 md:px-12 md:py-16 relative flex flex-col items-center gap-8 mb-8 text-center"
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-primary/0 flex items-center justify-center">
          <Coffee className="w-10 h-10 text-primary drop-shadow-md" />
        </div>
      </div>
      <div className="flex flex-col gap-6 md:gap-8 items-center max-w-3xl">
        <span className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary/80 font-bold drop-shadow-sm">{t('match_profile.visualize_moment', 'GỢI Ý MỞ LỜI CHO BUỔI HẸN ĐẦU')}</span>
        <div className="flex flex-col gap-8 w-full mt-4">
          {questions.map((q, idx) => (
            <p key={idx} className="text-2xl md:text-4xl font-extralight text-ink leading-relaxed italic drop-shadow-2xl">
              "{q.question}"
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};


export default MatchDateVisualization;
