import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepNavigation } from '../../../shared/components/StepNavigation';
import { ProgressBar } from '../../../shared/components/ProgressBar';

interface StepLayoutProps {
  progress?: number; // Added progress to show bar at top
  subtitle?: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  showNavigation?: boolean;
  scrollable?: boolean;
  extraHeader?: React.ReactNode;
  selectionMode?: 'single' | 'multiple' | 'none';
  maxSelection?: number;
}

/**
 * StepLayout — The Ritual Standard
 * Kraft Progress Bar at the very top.
 * Serif H1 Headline (Uppercase).
 * Footer with separate Back/Continue buttons.
 */
export const StepLayout: React.FC<StepLayoutProps> = ({
  progress,
  subtitle,
  title,
  description = '',
  children,
  onNext,
  onBack,
  nextDisabled = false,
  nextLabel,
  showBack = true,
  showNext = true,
  showNavigation = true,
  scrollable = true,
  extraHeader = null,
  selectionMode = 'none',
  maxSelection
}) => {
  const { t } = useTranslation();
  const [showErrors, setShowErrors] = React.useState(false);

  const handleNextAttempt = () => {
    if (nextDisabled) {
      setShowErrors(true);
      // Automatically clear shake after it plays so it can be re-triggered
      setTimeout(() => setShowErrors(false), 600);
    } else {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-h-full overflow-hidden relative">
      
      {/* ── 4. Content Structure: Kraft Progress Bar at TOP ── */}
      {progress !== undefined && (
        <div className="w-full px-6 pt-4 shrink-0">
          <ProgressBar progress={progress} className="h-[6px]" />
        </div>
      )}

      <div className={`flex flex-col flex-1 overflow-y-auto overflow-x-visible px-6 sm:px-10 transition-colors duration-500 ${showErrors ? 'bg-red-500/5' : ''}`}>
        {/* ── Question Header ── */}
        <section className="space-y-4 mb-8 shrink-0 relative pt-8">
          {subtitle && (
            <p className={`typo-ritual-label-small mb-2 animate-ritual-fade-up ${showErrors ? 'text-red-500' : 'text-primary'}`}>
              {subtitle}
            </p>
          )}
          <h1 className={`typo-ritual-h1 animate-ritual-fade-up flex items-center gap-2 ${showErrors ? 'text-red-500' : 'text-ink'}`}>
            {title}
            {showErrors && <span className="material-symbols-outlined text-[24px]">error</span>}
          </h1>
          
          {description && (
            <div className={`typo-ritual-body animate-ritual-fade-up [animation-delay:100ms] ${showErrors ? 'text-red-500/70' : 'text-ink/70'}`}>
              {description}
            </div>
          )}

          {/* Selection indicator - Subdued Monospace or Small Label */}
          {selectionMode !== 'none' && (
            <div className={`pt-2 typo-ritual-label-small animate-ritual-fade-up [animation-delay:200ms] ${showErrors ? 'text-red-500/80' : 'text-primary'}`}>
              {selectionMode === 'single' ? t('common.selection.single') : (
                maxSelection 
                  ? t('common.selection.up_to', { count: maxSelection })
                  : t('common.selection.multiple')
              )}
            </div>
          )}
          
          {extraHeader && (
            <div className="mt-4">
              {extraHeader}
            </div>
          )}
        </section>

        {/* ── Content Area: Single Source of Truth for Padding & Scrolling ── */}
        <div className={`flex-1 overflow-x-visible ${scrollable ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'} animate-ritual-fade-up [animation-delay:300ms] ${showErrors ? 'animate-shake' : ''}`}>
          <div className={`px-4 ${scrollable ? 'pb-20' : 'h-full flex flex-col'}`}>
            {children}
          </div>
        </div>

        {/* ── Footer Navigation (Bottom Left/Right) ── */}
        {showNavigation && (
          <div className="shrink-0 border-t border-divider/30 bg-background-paper/80 backdrop-blur-sm mx-[-24px] px-[24px]">
            <StepNavigation 
              onBack={onBack}
              onNext={handleNextAttempt}
              nextDisabled={nextDisabled} 
              nextLabel={nextLabel}
              showBack={showBack}
              showNext={showNext}
            />
          </div>
        )}
      </div>
    </div>
  );
};
