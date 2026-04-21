import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorToast } from '../components/ErrorToast';

export interface ErrorContextType {
  showError: (message: string) => void;
  clearError: () => void;
  error: string | null;
}

/**
 * Shared Context for Global Error State.
 * Allows components to show/hide the global error toaster.
 */
const ErrorContext = createContext<ErrorContextType | null>(null);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

/**
 * Provider Component to be wrapped around the app.
 */
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showError = useCallback((message: string) => {
    // Attempt to translate the error code if it exists in the dictionary
    // If t(key) returns the key itself, it means no translation was found
    const translationKey = `error_codes.${message}`;
    const translatedMessage = t(translationKey);
    
    // If translation fails (returns the key), use the original message
    const finalMessage = translatedMessage !== translationKey ? translatedMessage : message;

    setError(finalMessage);
    setIsVisible(true);
  }, [t]);

  const clearError = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setError(null), 500); // Clear after exit animation
  }, []);

  // Auto-hide after 3 seconds (slightly longer for readability)
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, clearError]);

  return (
    <ErrorContext.Provider value={{ showError, clearError, error }}>
      {children}
      <ErrorToast isVisible={isVisible} message={error || ''} onClear={clearError} />
    </ErrorContext.Provider>
  );
};

