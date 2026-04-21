import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { SurveyHeader } from './SurveyHeader';
import { SurveyFooter } from './SurveyFooter';

// Context to share validation state with child SurveyFieldGroups
export const StepValidationContext = React.createContext({ showErrors: false });
export const useStepValidation = () => React.useContext(StepValidationContext);

interface GroupedStepLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  errorFields?: string[]; // IDs of fields that are currently in error state
}

export const GroupedStepLayout: React.FC<GroupedStepLayoutProps> = ({
  currentStep,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onBack,
  nextDisabled = false,
  nextLabel,
  errorFields = []
}) => {
  const progress = (currentStep / totalSteps) * 100;
  
  const [showErrors, setShowErrors] = React.useState(false);

  // Reset errors when step changes
  React.useEffect(() => {
    setShowErrors(false);
  }, [currentStep]);

  const handleNextAttempt = () => {
    setShowErrors(true);
    
    // Auto-scroll to the first error field if any exist
    if (errorFields.length > 0) {
      const firstErrorId = errorFields[0];
      const element = document.getElementById(firstErrorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <StepValidationContext.Provider value={{ showErrors }}>

      <div className="flex flex-col h-full w-full bg-background-paper relative overflow-hidden font-sans">
      {/* ── Background Mesh Gradient ── */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{ background: 'var(--gradient-mesh)' }}
      />

      {/* ── Fixed Header Component ── */}
      <SurveyHeader 
        progress={progress} 
        onBack={onBack} 
        showBack={currentStep > 1} 
      />

        {/* ── Main Scroll Area ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-16 pb-32 px-6 sm:px-10 relative z-10">
        {title && (
          <header className="mb-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="typo-ritual-h1 text-ink mb-2 md:text-5xl tracking-tight normal-case"
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="typo-ritual-body text-ink/60 max-w-sm leading-relaxed"
              >
                {description}
              </motion.p>
            )}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="h-[1px] bg-divider/40 w-full mt-4 origin-left"
            />
          </header>
        )}

        {/* ── Content Area ── */}
        <main className="space-y-12 pb-20">
          {children}
        </main>
      </div>

      {/* ── Fixed Footer Component ── */}
      <SurveyFooter 
        onNext={onNext} 
        nextDisabled={nextDisabled} 
        nextLabel={nextLabel} 
        onNextAttempt={handleNextAttempt}
      />
    </div>
    </StepValidationContext.Provider>
  );
};
