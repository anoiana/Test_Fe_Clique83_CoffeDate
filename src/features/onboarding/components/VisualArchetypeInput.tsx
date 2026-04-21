import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const VisualArchetypeInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  const options = [
    { id: 'A', src: '/assets/archetypes/a.png' },
    { id: 'B', src: '/assets/archetypes/b.png' },
    { id: 'C', src: '/assets/archetypes/c.png' },
    { id: 'D', src: '/assets/archetypes/d.png' },
    { id: 'E', src: '/assets/archetypes/e.png' },
    { id: 'F', src: '/assets/archetypes/f.png' },
    { id: 'G', src: '/assets/archetypes/g.png' },
    { id: 'H', src: '/assets/archetypes/h.png' },
    { id: 'I', src: '/assets/archetypes/i.png' },
  ];

  const handleSelect = (id) => {
    onChange(id);
    setTimeout(() => onNext(), 300);
  };
  
  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.aesthetic')}
      title={t('onboarding.visual_archetype.title')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      showNext={false}
      scrollable={false}
    >
      <div className="flex flex-col items-center h-full pt-4">
        <div className="grid grid-cols-3 gap-2 w-full max-w-[320px]">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`aspect-square rounded-xl flex items-center justify-center transition-all border-2 relative overflow-hidden group ${
                value === opt.id 
                  ? 'border-primary ring-4 ring-primary/20 scale-[0.98]' 
                  : 'border-divider hover:border-ink/30'
              }`}
            >
              <img 
                src={opt.src} 
                alt={`Archetype ${opt.id}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity ${
                value === opt.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />
              
              <span className={`absolute bottom-1.5 left-2 text-xl font-black tracking-tighter ${
                value === opt.id ? 'text-primary' : 'text-ink/40'
              }`}>
                {opt.id}
              </span>

              {value === opt.id && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-background-dark text-[10px] font-bold">check</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </StepLayout>
  );
};
