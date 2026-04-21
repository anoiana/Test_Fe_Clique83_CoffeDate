import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { FormError } from '../../../shared/components/FormError';
import { useTranslation } from 'react-i18next';

/**
 * Cinematic Registration Form.
 * Includes Full Name, Email, and Password fields.
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Handle successful registration
 * @param {Function} props.onSwitchToLogin - Switch back to login view
 * @param {boolean} props.isLoading - Loading state from parent
 * @param {string} props.error - Error message from parent
 */
export const RegisterForm = ({ onSubmit, onSwitchToLogin, isLoading, error }) => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nameInputRef = useRef(null);

  // Auto focus on mount (remains)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fullName && email && password) {
      if (onSubmit) {
        onSubmit({ fullName, email, password });
      }
    }
  };

  const isFormValid = fullName.trim().length > 2 && email.includes('@') && password.length >= 6;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Info */}
      {/* Minimalist Header - Only main title kept for design consistency */}
      <section className="mb-8 animate-in fade-in slide-in-from-top-6 duration-700 delay-100 fill-mode-both">
        <h1 className="text-ink text-3xl font-medium tracking-tight font-serif">
          {t('auth.register.create_account')}
        </h1>
      </section>

      <form className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-700 delay-300 fill-mode-both" onSubmit={handleSubmit}>
        <FormError error={error} fallback={t('auth.register.failed')} />
        <div className="space-y-4">


          <Input
            ref={nameInputRef}
            label={t('auth.register.full_name_label')}
            type="text"
            placeholder={t('auth.register.full_name_placeholder')}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon="person"
            error={!!error && fullName.trim().length < 2}
            required
          />

          <Input
            label={t('auth.register.email_label')}
            type="email"
            placeholder={t('auth.register.email_placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="mail"
            error={!!error && !email.includes('@')}
            required
          />

          <Input
            label={t('auth.register.password_label')}
            type="password"
            placeholder={t('auth.register.password_placeholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="lock"
            error={!!error && password.length < 6}
            required
          />
        </div>

        
        <Button 
          variant="golden" 
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full h-[50px] rounded-3xl text-lg transition-opacity ${(!isFormValid || isLoading) ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
        >
          {isLoading ? t('auth.register.creating_account') : t('auth.register.sign_up')}
        </Button>

        <div className="text-center mt-4 sm:mt-5">
          <p className="text-ink/40 text-[13px] sm:text-sm font-light mb-1.5 sm:mb-2">{t('auth.register.already_have_account')}</p>
          <button 
            type="button" 
            onClick={onSwitchToLogin}
            className="text-primary/80 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold hover:text-primary transition-colors underline underline-offset-8 decoration-primary/30"
          >
            {t('auth.register.back_to_sign_in')}
          </button>
        </div>
      </form>
    </div>
  );
};
