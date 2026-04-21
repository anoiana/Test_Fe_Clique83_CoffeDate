import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Shared Component: BackButton
 * A unified, premium-styled back button used across cinematic pages.
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Function to run on click (usually navigate(-1) or navigate('/path'))
 * @param {string} [props.className] - Optional extra classes for positioning
 */
export const BackButton = ({ onClick, className = '' }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`p-2.5 sm:p-3 text-primary transition-all rounded-full bg-background-warm border border-divider shadow-lg active:scale-90 flex items-center justify-center hover:bg-background-paper ${className}`}
      aria-label={t('shared.back_aria')}
    >
      <ArrowLeft className="w-4 h-4 sm:w-5 h-5" />
    </button>
  );
};
