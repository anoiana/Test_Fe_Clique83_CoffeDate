import React from 'react';
import { Layers } from 'lucide-react';

const MatchComplementaritySection = ({ complementarity }) => {
  return (
    <div
      className="max-w-5xl mx-auto w-full px-8 py-10 md:px-12 md:py-16 relative flex flex-col items-center gap-8 mb-8 text-center"
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-primary/0 flex items-center justify-center">
          <Layers className="w-10 h-10 text-primary drop-shadow-md" />
        </div>
      </div>
      <div className="flex flex-col gap-6 md:gap-8 items-center max-w-3xl">
        <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary/80 font-bold">{complementarity.title}</span>
        <p className="text-3xl md:text-5xl font-extralight text-ink leading-relaxed italic drop-shadow-2xl">
          {complementarity.description}
        </p>
      </div>
    </div>
  );
};

export default MatchComplementaritySection;
