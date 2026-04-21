import React, { useEffect, useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '../../../shared/components/LoadingOverlay';
import { AuthResponse } from '../api/authApi';
import { GoogleCredentialResponse, GSIWindow, GSINotify } from '../../../shared/types/index';

interface SocialLoginsProps {
  onGoogleSuccess?: (response: AuthResponse) => void;
  autoTrigger?: boolean;
  silent?: boolean;
}

export const SocialLogins = ({ onGoogleSuccess, autoTrigger, silent }: SocialLoginsProps = {}) => {
  const { t } = useTranslation();
  const { loginWithGoogle } = useAuthContext();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
      // Hide loader once we get the credential (dialog finished)
      setIsGoogleLoading(false);
      try {
        console.log('Google credential received');
        const authResp = await loginWithGoogle(response.credential, true);
        
        if (onGoogleSuccess) {
          onGoogleSuccess(authResp);
        } else {
          console.warn('Google login success but no handler provided.');
        }
      } catch (err) {
        console.error('Google login failed:', err);
      }
    };

    const initializeGSI = () => {
      if ((window as GSIWindow).google?.accounts?.id) {
        (window as GSIWindow).google.accounts!.id!.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '123859852167-d5srjahrncif2pebgdkbanqm3mtq81gl.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: false,
          itp_support: true,
          use_fedcm_for_prompt: true, // Enable FedCM for better browser compatibility
        });
      }
    };

    // Try to initialize if already loaded
    if ((window as GSIWindow).google?.accounts?.id) {
      initializeGSI();
    } else {
      // Otherwise, wait for script to load
      const script = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (script) {
        script.addEventListener('load', initializeGSI);
      }
    }

    return () => {
      const script = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (script) {
        script.removeEventListener('load', initializeGSI);
      }
    };
  }, [loginWithGoogle, navigate]);

  // Handle Auto-Trigger logic
  useEffect(() => {
    if (autoTrigger) {
      // Small delay to ensure Google SDK is ready and transition is smooth
      const timer = setTimeout(() => {
        handleGoogleClick();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [autoTrigger]);

  const handleGoogleClick = () => {
    if ((window as GSIWindow).google?.accounts?.id) {
      setIsGoogleLoading(true);
      // Trigger the Google selection prompt
      (window as GSIWindow).google!.accounts!.id!.prompt((notification: GSINotify) => {
        // Hide loader if prompt is not displayed or skipped
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setIsGoogleLoading(false);
        }
        
        // Note: For 'displayed' moment, we might keep the loader 
        // until the callback is called, or hide it immediately.
        // If it's a popup, the loader stays behind it.
        if (notification.isDisplayed()) {
          // Keep loader a bit to feel cinematic or hide it?
          // Let's hide it after a small delay once displayed so user can see Google One Tap
          setTimeout(() => setIsGoogleLoading(false), 1500);
        }
      });
    } else {
      console.warn('Google accounts SDK not loaded. Please wait and try again or allow popups/scripts.');
    }
  };

  return (
    <div className={`${silent ? '' : 'flex flex-col items-center w-full gap-4'}`}>
      {/* Cinematic Loader for Google Dialog transition */}
      <LoadingOverlay 
        isVisible={isGoogleLoading} 
        message={t('shared.loading.connecting_google') || 'Connecting with Google...'} 
      />

      {!silent && (
        <Button 
          variant="glass" 
          aria-label={t('auth.social.google_aria')}
          onClick={handleGoogleClick}
          className="w-full h-[50px] text-lg"
        >
          <div className="flex items-center justify-center gap-4">
            <svg className="size-6" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-8.01 2.47-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-ink uppercase tracking-[0.3em] font-bold ml-2">GOOGLE</span>
          </div>
        </Button>
      )}

    </div>
  );
};
