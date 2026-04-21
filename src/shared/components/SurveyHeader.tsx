import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { SettingsDrawer } from './SettingsDrawer';

interface SurveyHeaderProps {
  progress: number;
  onBack: () => void;
  showBack?: boolean;
}

export const SurveyHeader: React.FC<SurveyHeaderProps> = ({ 
  progress, 
  onBack, 
  showBack = true 
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-[120] pointer-events-none">
      {/* Universal Progress Bar */}
      <ProgressBar progress={progress} className="h-[4px] rounded-none shadow-sm" />
      
      {/* Standardized "Mirror" Back Button */}
      <button
        onClick={onBack}
        className={`absolute top-4 left-4 sm:top-6 sm:left-6 size-8 sm:size-10 rounded-full bg-background-warm flex items-center justify-center border border-divider shadow-lg text-primary transition-all active:scale-95 pointer-events-auto ${
          !showBack ? 'invisible' : 'visible'
        }`}
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Universal Settings Icon */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 size-8 sm:size-10 rounded-full bg-background-warm flex items-center justify-center border border-divider shadow-lg text-primary transition-all active:scale-95 pointer-events-auto"
      >
        <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <SettingsDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};
