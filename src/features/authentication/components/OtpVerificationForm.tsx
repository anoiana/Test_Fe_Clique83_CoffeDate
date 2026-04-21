import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../../shared/components/Button';
import { FormError } from '../../../shared/components/FormError';
import { useTranslation, Trans } from 'react-i18next';

/**
 * OTP Verification Form.
 * Handles 6-digit code entry with auto-focus and resend timer.
 * @param {Object} props
 * @param {string} props.phoneNumber - The phone number/email code was sent to
 * @param {Function} props.onVerify - Handle verification code success
 * @param {Function} props.onResend - Handle resend code request
 * @param {boolean} props.isLoading - Loading state from parent
 * @param {string} props.error - Error message from parent
 */
export const OtpVerificationForm = ({ phoneNumber, onVerify, onResend, onBack, isLoading, error }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(55);
  const inputRefs = useRef([]);
  
  const handleVerifySubmit = () => {
    const code = otp.join('');
    if (code.length === 6 && onVerify) {
      onVerify(code);
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto focus the first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 500); // Wait for transition to finish
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    if (value.length > 1) {
      const digits = value.split('').slice(0, 6);
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(index + digits.length, 5);
      inputRefs.current[focusIndex].focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col flex-1 animate-in fade-in duration-500">
      {/* Title & Info */}
      <section className="space-y-2 mb-10 animate-in fade-in slide-in-from-top-6 duration-700 delay-100 fill-mode-both">
        <h2 className="text-primary text-xs font-bold tracking-[0.3em] uppercase">
          {t('auth.otp.verification')}
        </h2>
        <h1 className="text-ink text-3xl font-medium tracking-tight">
          {t('auth.otp.enter_code')}
        </h1>
        <p className="text-ink/40 text-sm font-light">
          <Trans i18nKey="auth.otp.sent_to" values={{ phoneNumber }}>
            Sent to <span className="text-ink font-medium">{phoneNumber}</span>
          </Trans>
        </p>
      </section>

      <div className="mb-6">
        <FormError error={error} fallback={t('auth.otp.verification_failed')} />
      </div>

      {/* OTP Grid */}
      <div className="flex justify-center gap-1.5 sm:gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-700 delay-300 fill-mode-both">
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
            className="size-10 sm:size-14 text-center text-xl sm:text-2xl font-mono rounded-2xl bg-background-warm border border-divider text-ink focus:border-primary/40 focus:bg-ink/5 transition-all outline-none disabled:opacity-50"
            placeholder=""
            disabled={isLoading}
          />
        ))}
      </div>


      {/* Resend Timer & Footer */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-2 duration-700 delay-500 fill-mode-both">
        {timer > 0 ? (
          <p className="text-ink/40 text-sm font-light">
            <Trans i18nKey="auth.otp.resend_in" values={{ time: formatTime(timer) }}>
              Resend in <span className="font-mono text-ink/40">{formatTime(timer)}</span>
            </Trans>
          </p>
        ) : (
          <button 
            onClick={() => {
              setTimer(55);
              onResend?.();
            }}
            className="text-primary font-bold text-sm hover:underline underline-offset-4"
          >
            {t('auth.otp.resend_now')}
          </button>
        )}
      </div>

      <div className="mt-auto space-y-6 animate-in fade-in slide-in-from-top-2 duration-700 delay-700 fill-mode-both">
        <Button 
          variant="golden" 
          onClick={handleVerifySubmit}
          disabled={otp.some(d => !d) || isLoading}
          className="w-full h-[50px] rounded-3xl text-lg font-bold tracking-widest"
        >
          {isLoading ? t('auth.otp.verifying') : t('auth.otp.verify')}
        </Button>

        <button 
          onClick={onBack}
          className="w-full text-ink/40 text-sm font-light hover:text-ink transition-colors py-2"
        >
          {t('auth.otp.change_number')}
        </button>
      </div>
    </div>
  );
};
