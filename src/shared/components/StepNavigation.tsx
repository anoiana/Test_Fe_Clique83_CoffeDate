import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  className?: string;
}

/**
 * StepNavigation — The Ritual Standard
 * Back button at bottom-left.
 * Continue (Capsule Burgundy) at bottom-right.
 */
export const StepNavigation: React.FC<StepNavigationProps> = ({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel,
  showBack = true,
  showNext = true,
  className = ""
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-between w-full pt-6 pb-4 ${className}`}>
      {/* Bottom Left: Back Button */}
      <div className="flex-1 flex justify-start">
        {showBack && (
          <button 
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-ink/40 hover:text-ink transition-colors font-sans font-bold uppercase tracking-widest text-xs group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('common.back')}
          </button>
        )}
      </div>

      {/* Bottom Right: Continue Button (Capsule) */}
      <div className="flex-1 flex justify-end">
        {showNext && (
          <Button
            variant="golden" // Stylized as Burgundy in Button.tsx
            onClick={onNext}
            disabled={nextDisabled}
            className="!w-auto px-10 rounded-full h-14 shadow-burgundy"
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span>{nextLabel || t('common.continue')}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};
