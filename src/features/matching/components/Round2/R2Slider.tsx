import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { StepLayout } from '../../../onboarding/components/StepLayout';
import { OptionButton } from '../../../../shared/components/OptionButton';

/**
 * Reusable Slider component for Round 2.
 * Renders a styled range slider with labels on both ends.
 */
interface R2SliderProps {
  title: string;
  description?: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  step?: number;
  suffix?: string;
}

export const R2Slider = ({ 
  title, description = '', value, onChange, onNext, onBack, 
  min = 1, max = 5, minLabel = '', maxLabel = '', step = 1, suffix = ''
}: R2SliderProps) => {
  const { t, i18n } = useTranslation();
  const currentValue = value || 3; // Default to neutral if no value
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const isLikertScale = (max - min) === 4 && minLabel && maxLabel && !suffix;

  const getLikertLabel = (index: number) => {
    switch(index) {
      case 1: return t('matching.round2.slider.likert.completely_min', { label: minLabel });
      case 2: return t('matching.round2.slider.likert.leaning_min', { label: minLabel });
      case 3: return t('matching.round2.slider.likert.neutral');
      case 4: return t('matching.round2.slider.likert.leaning_max', { label: maxLabel });
      case 5: return t('matching.round2.slider.likert.completely_max', { label: maxLabel });
      default: return '';
    }
  };

  if (isLikertScale) {
    const likertOptions = [1, 2, 3, 4, 5];
    return (
      <StepLayout
        title={title}
        description={description}
        onNext={onNext}
        onBack={onBack}
        nextDisabled={value === undefined || value === null}
        showNext={true}
        scrollable={true}
        selectionMode="single"
      >
        <div className="space-y-3">
          {likertOptions.map(num => (
            <OptionButton
              key={num}
              label={getLikertLabel(num)}
              selected={value === num}
              onClick={() => onChange(num)}
            />
          ))}
        </div>
      </StepLayout>
    );
  }

  return (
    <StepLayout
      title={title}
      description={description}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={false}
      showNext={true}
    >
      <div className="flex flex-col gap-4 pt-1 pb-4 px-1">
        {/* Current Value Display */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-baseline gap-1">
            <div className="w-16 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-2xl font-black text-primary">{currentValue}</span>
            </div>
            {suffix && <span className="text-lg font-light text-ink/30">{suffix}</span>}
          </div>
          <span className="text-[12px] uppercase font-bold tracking-[0.2em] text-ink/20 animate-pulse transition-opacity">
            {t('common.slide_to_select')}
          </span>
        </div>

        {/* Clean Ruler Container (No Border) */}
        <div className="relative px-2 py-4">
          <div className="relative flex flex-col gap-5 mx-2">
            {/* Slider Track Row */}
            <div className="relative h-6 flex items-center">
                {/* Main Track */}
                <div className="absolute left-0 w-full h-1.5 bg-background-warm rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-primary/30 to-primary/80 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Ruler Ticks - Only show if range is small (e.g. 1-15) */}
                {(max - min) <= 15 && (
                    <div className="absolute inset-0 flex justify-between items-center pointer-events-none px-0">
                        {Array.from({ length: (max - min) * 2 + 1 }, (_, i) => i / 2 + min).map(n => {
                            const isFullStep = n % 1 === 0;
                            const isActive = n <= currentValue;
                            return (
                                <motion.div 
                                    key={n}
                                    animate={{ 
                                        height: isFullStep ? 16 : 8,
                                        backgroundColor: isActive ? 'rgba(209,169,62,0.8)' : 'rgba(255,255,255,0.05)',
                                    }}
                                    className="w-[2px] rounded-full"
                                />
                            );
                        })}
                    </div>
                )}

                {/* Minimalist Thumb */}
                <motion.div 
                    className="absolute w-10 h-10 z-20 flex items-center justify-center pointer-events-none"
                    style={{ left: `${percentage}%`, marginLeft: '-20px' }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 rounded-full shadow-[0_0_20px_rgba(122,46,46,0.5)] border-2 border-background-paper/30" />
                </motion.div>

                {/* Interaction Layer */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step || 0.01}
                    value={currentValue}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    onPointerUp={() => {
                        const rounded = Math.round(currentValue);
                        onChange(rounded);
                    }}
                    className="absolute inset-x-[-15px] inset-y-[-20px] w-[calc(100%+30px)] h-[calc(100%+40px)] opacity-0 cursor-pointer z-30"
                />
            </div>

            {/* Numbers Row - Only show all if range is small, otherwise show min/max if no labels are provided */}
            <div className="flex justify-between px-0 min-h-[1.5rem] mt-2">
                {(max - min) <= 15 ? (
                    Array.from({ length: max - min + 1 }, (_, i) => i + min).map(n => {
                        const isSelected = Math.round(currentValue) === n;
                        return (
                            <motion.span 
                                key={n}
                                animate={{ 
                                    color: isSelected ? 'rgba(209,169,62,1)' : 'rgba(255,255,255,0.1)',
                                    scale: isSelected ? 1.6 : 1,
                                }}
                                className="text-[15px] font-black tracking-tighter w-6 text-center"
                            >
                                {n}
                            </motion.span>
                        );
                    })
                ) : (
                  // For large ranges, only show raw numbers if no custom labels (minLabel/maxLabel) are provided
                  (!minLabel && !maxLabel) && (
                    <>
                      <span className="text-[12px] font-black text-ink/20">{min}</span>
                      <span className="text-[12px] font-black text-ink/20">{max}</span>
                    </>
                  )
                )}
            </div>

            {/* Labels Row - Only show if labels are provided */}
            {(minLabel || maxLabel) && (
              <div className="flex justify-between items-start gap-4">
                  {/* Min Label with auto-split */}
                  {minLabel && (
                    <motion.div 
                        className="w-[120px] text-left opacity-100"
                    >
                        <div className="flex flex-col">
                            {minLabel.split(',').map((part, i) => (
                                <span key={i} className="text-[12px] sm:text-[13px] font-black uppercase tracking-[0.1em] text-primary/90 leading-[1.3] block">
                                    {part.trim()}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                  )}
                  
                  {/* Max Label with auto-split */}
                  {maxLabel && (
                    <motion.div 
                        className="w-[120px] text-right opacity-100"
                    >
                        <div className="flex flex-col">
                            {maxLabel.split(',').map((part, i) => (
                                <span key={i} className="text-[12px] sm:text-[13px] font-black uppercase tracking-[0.1em] text-primary/90 leading-[1.3] block">
                                    {part.trim()}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </StepLayout>
  );
};
