import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';
import { useError } from '../context/ErrorContext';

interface SurveyFooterProps {
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  onNextAttempt?: () => void;
}

export const SurveyFooter: React.FC<SurveyFooterProps> = ({
  onNext,
  nextDisabled = false,
  nextLabel,
  onNextAttempt
}) => {
  const { t } = useTranslation();
  const { showError } = useError();

  const handleNextClick = () => {
    if (nextDisabled) {
      if (onNextAttempt) onNextAttempt();
      showError(t('common.incomplete_form_toast'));
      return;
    }
    onNext();
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-background-paper via-background-paper to-transparent z-[100] pointer-events-none">
      <div className="max-w-md mx-auto flex items-center justify-center pointer-events-auto">
        {/* Centered Primary CTA Button */}
        <Button
          variant="golden"
          onClick={handleNextClick}
          className={`min-h-[50px] px-14 rounded-full shadow-burgundy flex items-center justify-center gap-3 transition-all active:scale-[0.98] bg-primary box-border ${
            nextDisabled ? 'opacity-40 grayscale-[0.5] cursor-not-allowed' : 'hover:bg-primary-dark shadow-lg'
          }`}
        >
          <span className="uppercase tracking-[0.15em] text-[13px] font-bold text-background-paper">
            {nextLabel || t('common.continue')}
          </span>
          <ChevronRight className="w-4 h-4 text-background-paper" />
        </Button>
      </div>
    </footer>
  );
};
