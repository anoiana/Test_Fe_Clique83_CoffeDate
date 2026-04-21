import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LoadingOverlay } from '../components/LoadingOverlay';

export interface LoadingContextType {
  showLoader: (msg?: string) => void;
  hideLoader: () => void;
  isLoading: boolean;
}

/**
 * Shared Context for Global Loading State.
 * Allows components to start/stop the global loader.
 */
const LoadingContext = createContext<LoadingContextType | null>(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

/**
 * Provider Component to be wrapped around the app.
 */
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showLoader = useCallback((msg = 'PREPARING YOUR EXPERIENCE') => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}
      <LoadingOverlay isVisible={isLoading} message={message} />
    </LoadingContext.Provider>
  );
};
