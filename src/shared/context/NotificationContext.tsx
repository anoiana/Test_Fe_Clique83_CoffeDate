import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { SuccessToast } from '../components/SuccessToast';

export interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  clearNotification: () => void;
  notification: string | null;
  error: string | null;
}

/**
 * Shared Context for Global Success Notifications.
 */
const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Provider Component for the app.
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showSuccess = useCallback((message: string) => {
    setError(null);
    setNotification(message);
    setIsVisible(true);
  }, []);

  const showError = useCallback((message: string) => {
    setNotification(null);
    setError(message);
    setIsVisible(true);
  }, []);

  const clearNotification = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setNotification(null);
      setError(null);
    }, 500); // Clear after exit animation
  }, []);

  // Auto-hide after 4 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(clearNotification, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, clearNotification]);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, clearNotification, notification, error }}>
      {children}
      <SuccessToast 
        isVisible={isVisible && !!notification} 
        message={notification || ''} 
        onClear={clearNotification} 
      />
      {/* For now, using standard toast but could add ErrorToast component later */}
      <SuccessToast 
        isVisible={isVisible && !!error} 
        message={error || ''} 
        onClear={clearNotification}
        variant="error"
      />
    </NotificationContext.Provider>
  );
};
