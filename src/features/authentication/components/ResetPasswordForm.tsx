import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useTranslation, Trans } from 'react-i18next';

export const ResetPasswordForm = ({ email, onReset, onBack, isLoading, error }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length === 6 && password.length >= 6 && onReset) {
      onReset({ token, password });
    }
  };

  // Auto focus the first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 500); 
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    if (value.length > 1) {
      const digits = value.split('').slice(0, 6);
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(index + digits.length, 5);
      inputRefs.current[focusIndex]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isFormValid = otp.every(d => d !== '') && password.length >= 6;

  return (
    <div className="flex flex-col flex-1 animate-in fade-in duration-500">
      <section className="mb-4 sm:mb-6 animate-in fade-in slide-in-from-top-6 duration-700 delay-100 fill-mode-both px-1">
        <h1 className="text-ink text-xl sm:text-3xl font-medium tracking-tight">
          {t('auth.reset_password.title', 'Set New Password')}
        </h1>
        <p className="text-ink/40 text-[10px] sm:text-xs mt-1 font-light leading-relaxed">
          <Trans i18nKey="auth.otp.sent_to" values={{ phoneNumber: email }}>
            Enter the 6-digit code sent to <span className="text-ink font-medium">{email}</span>
          </Trans>
        </p>
      </section>

      <form className="space-y-4" onSubmit={handleResetSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 animate-in fade-in zoom-in duration-300">
             <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
             <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest leading-none">
                {error}
             </p>
          </div>
        )}

        {/* OTP Grid */}
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-[0.2em] font-black text-ink/30 ml-1">
            Verification Code
          </label>
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d*"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="size-10 sm:size-14 text-center text-lg sm:text-2xl font-semibold rounded-2xl bg-background-warm border border-divider text-ink focus:border-primary/40 focus:bg-ink/5 transition-all outline-none disabled:opacity-50"
                placeholder=""
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        <Input
          label={t('auth.login.new_password_label', 'New Password')}
          type="password"
          placeholder={t('auth.login.password_placeholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon="lock"
          required
        />

        <div className="space-y-3 pt-2">

          <Button 
            variant="golden" 
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full h-13 sm:h-16 rounded-2xl text-[15px] sm:text-lg"
          >
            {isLoading ? t('auth.common.resetting', 'Resetting...') : t('auth.common.reset_password', 'Reset Password')}
          </Button>
          
          <button 
            type="button" 
            onClick={onBack}
            className="w-full py-2 text-ink/40 text-[10px] uppercase tracking-[0.2em] font-black hover:text-ink transition-colors"
          >
            {t('auth.common.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};
