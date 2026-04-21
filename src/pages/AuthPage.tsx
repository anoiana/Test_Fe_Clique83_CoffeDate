import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WelcomeScreen } from '../features/authentication/components/WelcomeScreen';
import { SplashScreen } from '../features/authentication/components/SplashScreen';
import { LanguageSelectionScreen } from '../features/authentication/components/LanguageSelectionScreen';
import { LoginForm } from '../features/authentication/components/LoginForm';
import { RegisterForm } from '../features/authentication/components/RegisterForm';
import { OtpVerificationForm } from '../features/authentication/components/OtpVerificationForm';
import { ForgotPasswordForm } from '../features/authentication/components/ForgotPasswordForm';
import { ResetPasswordForm } from '../features/authentication/components/ResetPasswordForm';
import { SocialLogins } from '../features/authentication/components/SocialLogins';
import { Divider } from '../shared/components/Divider';
import { Button } from '../shared/components/Button';
import { PageTransition } from '../shared/components/PageTransition';
import { AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../shared/context/AuthContext';
import { useNavigationFlow } from '../shared/hooks/useNavigationFlow';
import { useNotification } from '../shared/context/NotificationContext';
import { useLoading } from '../shared/context/LoadingContext';
import { meetingApi } from '../features/match/api/meetingApi';
import { User } from '../shared/types/models';

/**
 * AuthPage component handling the initial pre-auth sequence.
 * Flow: Splash → Language Selection (first visit) → Welcome → Auth forms.
 */
export const AuthPage = () => {
  const { t } = useTranslation();
  const hasChosenLanguage = !!localStorage.getItem('clique_lang_chosen');
  const [phase, setPhase] = useState<'splash' | 'language' | 'welcome'>('splash');
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState('login'); // 'login' | 'register' | 'otp' | 'forgot-password' | 'reset-password'
  const [userEmail, setUserEmail] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const [shouldAutoTriggerGoogle, setShouldAutoTriggerGoogle] = useState(false);

  const navigate = useNavigate();
  const { user, isInitialized, login, signup, verifyOtp, forgotPassword, resetPassword, isLoading, error } = useAuthContext();
  const { navigateToCorrectStep } = useNavigationFlow();
  const { showSuccess } = useNotification();
  const { showLoader, hideLoader } = useLoading();

  // AUTO-REDIRECT is handled by RouteGuard (isPublic flag).
  // No duplicate redirect needed here.

  // Blur layout video when forms are shown
  React.useEffect(() => {
    if (isStarted) {
      document.body.classList.add('layout-blur-active');
    } else {
      document.body.classList.remove('layout-blur-active');
    }
    return () => document.body.classList.remove('layout-blur-active');
  }, [isStarted]);

  // Sync auth loading with global clique loader
  React.useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
    // Clean up on unmount just in case
    return () => hideLoader();
  }, [isLoading, showLoader, hideLoader]);

  const handleLoginSubmit = async (credentials) => {
    try {
      const response = await login(credentials);
      navigateToCorrectStep(response.user);
    } catch (err: unknown) {
      console.error('Login error:', err);
      // Let the LoginForm handle the error display
    }
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    try {
      await forgotPassword(email);
      setUserEmail(email);
      setStep('reset-password');
    } catch (err) {
      console.error('Forgot password error:', err);
    }
  };

  const handleResetSubmit = async ({ token, password }) => {
    try {
      await resetPassword(userEmail, token, password);
      // After successfully resetting, go back to login
      showSuccess(t('auth.reset_password.success_message'));
      setStep('login');
    } catch (err) {
      console.error('Reset password error:', err);
    }
  };

  const handleRegisterSubmit = async (formData) => {
    try {
      const resp = await signup(formData);
      setUserEmail(formData.email);
      setTempUserId(resp.userId);
      setStep('otp');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  const handleGoogleSuccess = async (authResp) => {
    try {
      showSuccess(t('auth.page.login_success'));
      navigateToCorrectStep(authResp?.user);
    } catch (err) {
      console.error('Google post-login flow error:', err);
    }
  };

  const handleVerify = async (otpCode) => {
    try {
       const response = await verifyOtp(tempUserId, otpCode);
       showSuccess(t('auth.page.verification_success'));
       navigateToCorrectStep(response.user);
    } catch (err) {
       console.error('OTP error:', err);
    }
  };

  const handleBack = () => {
    if (isStarted && step === 'login') {
      setIsStarted(false);
    } else if (step === 'register' || step === 'otp' || step === 'forgot-password' || step === 'reset-password') {
      setStep('login');
    } else {
      setIsStarted(false);
    }
  };

  const handleSplashComplete = () => {
    if (hasChosenLanguage) {
      setPhase('welcome');
    } else {
      setPhase('language');
    }
  };

  const handleLanguageSelect = () => {
    setPhase('welcome');
  };

  return (
    <>
      {/* 0. SPLASH SCREEN (Logo animation) */}
      <AnimatePresence>
        {phase === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {/* 0.5. LANGUAGE SELECTION (First visit only) */}
      <AnimatePresence>
        {phase === 'language' && (
          <LanguageSelectionScreen onSelect={handleLanguageSelect} />
        )}
      </AnimatePresence>

      {/* 1. WELCOME SCREEN */}
      {phase === 'welcome' && (
        <>
          <WelcomeScreen
            isStarted={isStarted}
            onStart={(method) => {
              if (method === 'google') {
                // IMPORTANT: Stay on welcome screen but trigger Google
                setShouldAutoTriggerGoogle(true);
              } else {
                setIsStarted(true);
                setStep('register');
                setShouldAutoTriggerGoogle(false);
              }
            }}
          />

          {/* SocialLogins rendered globally for background trigger */}
          <SocialLogins 
            onGoogleSuccess={handleGoogleSuccess} 
            autoTrigger={shouldAutoTriggerGoogle} 
            silent={true}
          />

          {/* 2. AUTH SCREEN */}
          <AnimatePresence mode="wait">
            {isStarted && (
              <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full px-5 sm:px-0 animate-fade-in-down">
                <header className="mb-4 sm:mb-12 pt-4 sm:pt-6 animate-in fade-in duration-300">
                  <Button
                    variant="icon-only"
                    aria-label={t('auth.page.go_back')}
                    icon="arrow_back"
                    onClick={handleBack}
                  />
                </header>

                <main className="flex-1 flex flex-col relative pb-8">
                  <AnimatePresence mode="wait">
                    {step === 'login' && (
                      <PageTransition key="login">
                        <LoginForm
                          onSubmit={handleLoginSubmit}
                          onSwitchToRegister={() => setStep('register')}
                          onForgotPassword={() => setStep('forgot-password')}
                          isLoading={isLoading}
                          error={error}
                        />
                        <Divider>{t('auth.page.or_connect_with')}</Divider>
                        <SocialLogins onGoogleSuccess={handleGoogleSuccess} />
                      </PageTransition>
                    )}
                    {/* ... other steps ... */}

                    {step === 'forgot-password' && (
                      <PageTransition key="forgot">
                        <ForgotPasswordForm
                          onSubmit={handleForgotPasswordSubmit}
                          onBack={() => setStep('login')}
                          isLoading={isLoading}
                          error={error}
                        />
                      </PageTransition>
                    )}

                    {step === 'reset-password' && (
                      <PageTransition key="reset">
                        <ResetPasswordForm
                          email={userEmail}
                          onReset={handleResetSubmit}
                          onBack={() => setStep('login')}
                          isLoading={isLoading}
                          error={error}
                        />
                      </PageTransition>
                    )}

                    {step === 'register' && (
                      <PageTransition key="register">
                        <RegisterForm
                          onSubmit={handleRegisterSubmit}
                          onSwitchToLogin={() => setStep('login')}
                          isLoading={isLoading}
                          error={error}
                        />
                      </PageTransition>
                    )}

                    {step === 'otp' && (
                      <PageTransition key="otp">
                        <OtpVerificationForm
                          phoneNumber={userEmail}
                          onVerify={handleVerify}
                          onResend={() => {/* Handle resend */}}
                          onBack={() => setStep('register')}
                          isLoading={isLoading}
                          error={error}
                        />
                      </PageTransition>
                    )}
                  </AnimatePresence>
                </main>


              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

