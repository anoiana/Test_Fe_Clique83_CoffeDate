import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

/**
 * RangeInputStep Component
 * Uses a slider for numeric input (e.g., age range).
 */
export const RangeInputStep = ({ 
  value, 
  onChange, 
  onNext, 
  onBack, 
  title, 
  subtitle, 
  description,
  min = 18, 
  max = 80, 
  step = 1,
  unit = '' 
}) => {
  const { t } = useTranslation();
  // Ensure value is a number and within bounds
  const numericValue = value ? parseInt(value, 10) : Math.floor((min + max) / 2);

  return (
    <StepLayout
      subtitle={subtitle}
      title={title}
      description={description}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      scrollable={false}
    >
      <div className="flex flex-col items-center space-y-12 py-10">
        <div className="relative flex flex-col items-center">
          <span className="text-8xl font-light text-primary animate-in zoom-in duration-500 italic">
            {numericValue}
            <span className="text-2xl ml-2 text-primary/40 not-italic uppercase font-bold tracking-tighter">{unit}</span>
          </span>
          <div className="absolute -bottom-4 w-12 h-1 bg-primary/20 rounded-full blur-sm" />
        </div>

        <div className="w-full space-y-6">
          <div className="relative h-12 flex items-center group">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={numericValue}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-1.5 bg-ink/5 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
            />
            
            {/* Custom Track Background (Optional - Standard range is fine but we can style it) */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-primary rounded-lg pointer-events-none" 
              style={{ width: `${((numericValue - min) / (max - min)) * 100}%` }}
            />
          </div>

          <div className="flex justify-between px-1">
            <span className="text-ink/30 text-xs font-bold tracking-widest">{min}{unit}</span>
            <span className="text-ink/30 text-xs font-bold tracking-widest">{max}{unit}</span>
          </div>
        </div>
      </div>
    </StepLayout>
  );
};
