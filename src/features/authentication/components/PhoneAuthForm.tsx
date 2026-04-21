import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../../shared/components/Button';
import { Divider } from '../../../shared/components/Divider';
import { SocialLogins } from './SocialLogins';
import { CountrySelector } from './CountrySelector';
import { useTranslation } from 'react-i18next';

/**
 * Enhanced Phone Number authentication form.
 * Implements the new UI with circular country picker, border-bottom input,
 * and integrated social logins.
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Handle form submission
 */
export const PhoneAuthForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({ 
    name: 'Vietnam', 
    code: '+84', 
    flag: '🇻🇳' 
  });
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const inputRef = useRef(null);

  // Auto focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500); // Wait for page transition
    return () => clearTimeout(timer);
  }, []);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) { // Standard VN phone length is 10
      setPhoneNumber(value);
    }
  };

  const isPhoneValid = phoneNumber.length >= 9 && phoneNumber.length <= 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && isPhoneValid) {
      onSubmit(`${selectedCountry.code} ${phoneNumber}`);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Info - Slide down first */}
      <section className="space-y-2 mb-10 animate-in fade-in slide-in-from-top-6 duration-700 delay-100 fill-mode-both">
        <h2 className="text-primary text-xs font-bold tracking-[0.3em] uppercase">
          {t('auth.phone.lets_start')}
        </h2>
        <h1 className="text-ink text-3xl font-medium tracking-tight">
          {t('auth.phone.whats_your_phone')}
        </h1>
        <p className="text-ink/40 text-sm font-light">
          {t('auth.phone.send_code_verify')}
        </p>
      </section>

      <form className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700 delay-300 fill-mode-both" onSubmit={handleSubmit}>
        <div className="flex items-end gap-4 min-h-[64px]">
          {/* Country Prefix Button */}
          <button 
            type="button"
            onClick={() => setIsSelectorOpen(true)}
            className="flex items-center gap-2 h-12 px-4 bg-background-warm border border-divider rounded-full hover:bg-ink/5 transition-all active:scale-95 mb-1"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-ink font-medium">{selectedCountry.code}</span>
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="tel"
              placeholder={t('auth.phone.phone_placeholder')}
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="w-full h-14 bg-transparent border-b-2 border-primary/60 focus:border-primary px-0 text-ink text-2xl font-light tracking-widest placeholder:text-slate-800 focus:outline-none focus:ring-0 transition-colors"
              required
            />
          </div>
        </div>
        
        <Button 
          variant="golden" 
          type="submit"
          disabled={!isPhoneValid}
          className={`w-full h-16 rounded-2xl text-lg font-bold uppercase tracking-widest transition-opacity ${!isPhoneValid ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
        >
          {t('auth.phone.continue')}
        </Button>
      </form>

      {/* Country Selector Modal */}
      <CountrySelector 
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={(country) => setSelectedCountry(country)}
        selectedCountry={selectedCountry}
      />
    </div>
  );
};
