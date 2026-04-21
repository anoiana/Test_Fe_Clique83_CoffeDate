import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { FormError } from '../../../shared/components/FormError';
import { useTranslation } from 'react-i18next';

/**
 * Cinematic Email/Password Login Form.
 * Replaces the PhoneAuthForm with Email and Password inputs.
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Handle successful login
 * @param {Function} props.onSwitchToRegister - Switch to registration view
 * @param {boolean} props.isLoading - Loading state from parent
 * @param {string} props.error - Error message from parent
 */
export const LoginForm = ({ onSubmit, onSwitchToRegister, onForgotPassword, isLoading, error }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const emailInputRef = useRef(null);

  // Focus on first render
  useEffect(() => {
    const timer = setTimeout(() => {
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 500); 
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
        onSubmit({ email, password, rememberMe });
    }
  };

  const isFormValid = email.includes('@') && password.length >= 6;

  // New: Check for specific Google Auth error
  const isGoogleError = error === 'PASSWORD_NOT_SET_USE_GOOGLE';

  return (
    <div className="animate-in fade-in duration-500">
      {/* Minimalist Header */}
      <section className="mb-6 sm:mb-10 animate-in fade-in slide-in-from-top-6 duration-700 delay-100 fill-mode-both px-1">
        <h1 className="text-ink text-xl sm:text-3xl font-medium tracking-tight font-serif">
          {t('auth.login.sign_in_to_clique')}
        </h1>
      </section>

      <form 
        className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-top-4 duration-700 delay-300 fill-mode-both" 
        onSubmit={handleSubmit}
      >
        <FormError error={error} fallback={t('auth.login.failed')} />
        <div className="space-y-4">

          <Input
            ref={emailInputRef}
            label={t('auth.login.email_label')}
            type="email"
            placeholder={t('auth.login.email_placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="mail"
            autoComplete="off"
            error={!!error}
            required
          />

          <Input
            label={t('auth.login.password_label')}
            type="password"
            placeholder={t('auth.login.password_placeholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="lock"
            autoComplete="new-password"
            error={!!error}
            required
          />
          
          <div className="flex items-center justify-between px-1 pt-1">
            <button 
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="group flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="relative flex items-center justify-center">
                <div className={`w-5 h-5 rounded-md border-2 transition-all duration-300 ${
                  rememberMe 
                    ? 'bg-primary border-primary shadow-sm shadow-primary/20' 
                    : 'bg-background-warm border-divider group-hover:border-ink/20'
                }`} />
                <span className={`material-symbols-outlined absolute text-[16px] text-background-paper transition-all duration-300 ${
                  rememberMe ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}>
                  check
                </span>
              </div>
              <span className={`text-[11px] sm:text-xs uppercase tracking-widest font-black transition-colors ${
                rememberMe ? 'text-primary' : 'text-ink/40 group-hover:text-ink/70'
              }`}>
                {t('auth.login.remember_me') || 'Remember Me'}
              </span>
            </button>

            <button 
              type="button" 
              onClick={onForgotPassword}
              className="text-primary/90 text-[11px] sm:text-xs uppercase tracking-widest font-black hover:text-primary transition-colors hover:translate-x-0.5 transform duration-300"
            >
              {t('auth.login.forgot_password')}
            </button>
          </div>
        </div>

        
        <Button 
          variant="golden" 
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full h-[50px] rounded-3xl text-[15px] sm:text-lg transition-opacity ${(!isFormValid || isLoading) ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
        >
          {isLoading ? t('auth.login.verifying') : t('auth.login.sign_in')}
        </Button>
        <div className="text-center mt-4 sm:mt-5">
          <button 
            type="button" 
            onClick={onSwitchToRegister}
            className="text-primary/80 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold hover:text-primary transition-colors underline underline-offset-8 decoration-primary/30"
          >
            {t('auth.login.no_account')}
          </button>
        </div>
      </form>
    </div>
  );
};
