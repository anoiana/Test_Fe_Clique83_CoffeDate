import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useTranslation } from 'react-i18next';

export const ForgotPasswordForm = ({ onSubmit, onBack, isLoading, error }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      onSubmit(email);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <section className="mb-8 sm:mb-10 animate-in fade-in slide-in-from-top-6 duration-700 delay-100 fill-mode-both px-1">
        <h1 className="text-ink text-xl sm:text-3xl font-medium tracking-tight">
          {t('auth.forgot_password.title', 'Reset Password')}
        </h1>
        <p className="text-ink/40 text-xs sm:text-sm mt-3 font-light leading-relaxed">
          {t('auth.forgot_password.description', 'Enter your email address and we will send you a 6-digit code to reset your password.')}
        </p>
      </section>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
             <p className="text-red-500 text-xs font-bold uppercase tracking-widest leading-none">
                {error}
             </p>
          </div>
        )}

        <Input
          label={t('auth.login.email_label')}
          type="email"
          placeholder={t('auth.login.email_placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon="mail"
          autoFocus
          required
        />

        <div className="space-y-3 pt-2">
          <Button 
            variant="golden" 
            type="submit"
            disabled={!email.includes('@') || isLoading}
            className="w-full h-13 sm:h-16 rounded-2xl text-[15px] sm:text-lg"
          >
            {isLoading ? t('auth.common.sending', 'Sending...') : t('auth.common.send_code', 'Send Code')}
          </Button>
          
          <button 
            type="button" 
            onClick={onBack}
            className="w-full py-3 text-ink/40 text-[10px] uppercase tracking-[0.2em] font-black hover:text-ink transition-colors"
          >
            {t('auth.common.back_to_login', 'Back to Login')}
          </button>
        </div>
      </form>
    </div>
  );
};
