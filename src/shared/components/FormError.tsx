import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStepValidation } from './GroupedStepLayout';

interface FormErrorProps {
  error: string | null | undefined;
  fallback?: string;
  className?: string;
}

/**
 * Shared component to display localized error messages in forms.
 * It automatically looks up the error code in the 'error_codes' translation namespace.
 */
export const FormError: React.FC<FormErrorProps> = ({ error, fallback, className = "" }) => {
  const { t } = useTranslation();
  const context = useStepValidation();
  
  // Only use showErrors if we are inside a StepValidationContext
  // If outside (like auth), we always show the error if it exists
  const shouldShow = error && (context === undefined || context.showErrors !== false);

  if (!error || !shouldShow) return null;

  // Attempt to find translation in error_codes, fallback to provided string or generic common.error
  const translatedMessage = t(`error_codes.${error}`, fallback || error || t('common.error'));

  return (
    <div className={`bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${className}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
      <p className="text-primary text-xs font-bold uppercase tracking-widest leading-normal">
        {translatedMessage}
      </p>
    </div>
  );
};
