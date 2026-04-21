import React, { useEffect, useRef, useMemo, useState } from 'react';
import { StepLayout } from '../StepLayout';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';

export const IntakeBirthdateInput = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Auto-focus day field on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (dayRef.current) dayRef.current.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const inputBaseClass = "bg-transparent text-center text-lg sm:text-2xl font-mono text-ink focus:outline-none focus:ring-0 transition-colors placeholder:text-ink/15 caret-primary tracking-tighter";

  return (
    <Controller
      name="birthdate"
      control={control}
      render={({ field: { value, onChange } }) => {
        // Parse existing value into day/month/year for internal state
        const [day, setDay] = useState('');
        const [month, setMonth] = useState('');
        const [year, setYear] = useState('');

        useEffect(() => {
          if (value) {
            const [y, m, d] = value.split('-');
            setDay(d || '');
            setMonth(m || '');
            setYear(y || '');
          }
        }, []);

        const isValidAge = useMemo(() => {
          if (!value) return false;
          const selected = new Date(value);
          if (isNaN(selected.getTime())) return false;

          const today = new Date();
          const maxDateLimit = new Date();
          maxDateLimit.setFullYear(today.getFullYear() - 21);
          const minDateLimit = new Date();
          minDateLimit.setFullYear(today.getFullYear() - 64);

          return selected <= maxDateLimit && selected >= minDateLimit;
        }, [value]);

        const datePickerLimits = useMemo(() => {
          const today = new Date();
          const max = new Date();
          max.setFullYear(today.getFullYear() - 21);
          const min = new Date();
          min.setFullYear(today.getFullYear() - 64);

          return {
            max: max.toISOString().split('T')[0],
            min: min.toISOString().split('T')[0]
          };
        }, []);

        const showError = value && !isValidAge;

        const syncValue = (d: string, m: string, y: string) => {
          if (d && m && y && y.length === 4) {
            const padded = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            onChange(padded);
          }
        };

        const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 2);
          setDay(val);
          syncValue(val, month, year);
          if (val.length === 2) monthRef.current?.focus();
        };

        const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 2);
          setMonth(val);
          syncValue(day, val, year);
          if (val.length === 2) yearRef.current?.focus();
        };

        const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 4);
          setYear(val);
          syncValue(day, month, val);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'day' | 'month' | 'year') => {
          if (e.key === 'Backspace') {
            if (field === 'month' && month === '') {
              dayRef.current?.focus();
            } else if (field === 'year' && year === '') {
              monthRef.current?.focus();
            }
          }
        };

        const handleCalendarClick = () => {
          if (hiddenInputRef.current) {
            // showPicker is a browser API for date inputs
            const inputEl = hiddenInputRef.current as HTMLInputElement & { showPicker?: () => void };
            if (typeof inputEl.showPicker === 'function') {
              try { inputEl.showPicker(); }
              catch { hiddenInputRef.current.focus(); }
            } else {
              hiddenInputRef.current.focus();
            }
          }
        };

        const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;
          onChange(val);
          if (val) {
            const [y, m, d] = val.split('-');
            setDay(d); setMonth(m); setYear(y);
          }
        };

        return (
          <StepLayout
            subtitle={t('intake.steps.step_3')}
            title={t('intake.birthdate.title')}
            onNext={onNext}
            onBack={onBack}
            nextDisabled={!value || value.length < 10 || !isValidAge}
            showNext={true}
          >
            <div className="pt-4 sm:pt-6">
              <div className={`
                flex items-center rounded-3xl min-h-[50px] border transition-all
                ${showError 
                  ? 'border-rose-500/40 bg-rose-500/5' 
                  : 'border-divider bg-background-warm/60 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20'
                }
              `}>
                {/* Left Wing: Calendar Trigger */}
                <div className="w-12 sm:w-14 shrink-0 flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={handleCalendarClick}
                    className={`size-9 rounded-2xl flex items-center justify-center transition-all
                      ${showError 
                        ? 'bg-rose-500/10 text-rose-500' 
                        : 'bg-primary/5 text-primary hover:bg-primary/10 active:scale-90'
                      }`}
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>

                {/* Center: Birthdate Inputs */}
                <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 min-w-0">
                  <input
                    ref={dayRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="DD"
                    value={day}
                    onChange={handleDayChange}
                    className={`${inputBaseClass} w-8 sm:w-10`}
                    maxLength={2}
                  />
                  <span className="text-ink/20 font-mono">/</span>
  
                  <input
                    ref={monthRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="MM"
                    value={month}
                    onChange={handleMonthChange}
                    onKeyDown={(e) => handleKeyDown(e, 'month')}
                    className={`${inputBaseClass} w-8 sm:w-10`}
                    maxLength={2}
                  />
                  <span className="text-ink/20 font-mono">/</span>
  
                  <input
                    ref={yearRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="YYYY"
                    value={year}
                    onChange={handleYearChange}
                    onKeyDown={(e) => handleKeyDown(e, 'year')}
                    className={`${inputBaseClass} w-14 sm:w-18`}
                    maxLength={4}
                  />
                </div>

                {/* Right Wing: Spacer for balancing */}
                <div className="w-12 sm:w-14 shrink-0" />
              </div>

              <input
                ref={hiddenInputRef}
                type="date"
                value={value || ''}
                min={datePickerLimits.min}
                max={datePickerLimits.max}
                onChange={handleCalendarChange}
                className="sr-only"
                style={{ colorScheme: 'dark' }}
                tabIndex={-1}
              />

              {showError && (
                <p className="mt-3 text-xs font-medium text-rose-500 animate-in slide-in-from-top-2">
                  {t('intake.birthdate.error')}
                </p>
              )}
            </div>
          </StepLayout>
        );
      }}
    />
  );
};
