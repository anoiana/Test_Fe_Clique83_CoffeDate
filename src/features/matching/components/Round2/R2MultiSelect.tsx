import React from 'react';
import { StepLayout } from '../../../onboarding/components/StepLayout';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { useTranslation } from 'react-i18next';
import { MultiSelectIndicator } from '../../../../shared/components/MultiSelectIndicator';

/**
 * Reusable Multi-Select component for Round 2.
 * Supports optional max selection limit and "Other" input.
 */
interface R2MultiSelectProps {
  title: string;
  description?: React.ReactNode;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  maxSelect?: number | null;
  showOther?: boolean;
  otherLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  nextDisabled?: boolean;
  showSelectAll?: boolean;
}

export const R2MultiSelect = ({ 
  title, description = '', options, value = [], onChange, onNext, onBack, 
  maxSelect = null, showOther = false, otherLabel, showBack = true, showNext = true,
  nextDisabled = false, showSelectAll = false
}: R2MultiSelectProps) => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';
  const effectiveOtherLabel = otherLabel || t('matching.round2.common.other');
  
  const otherValue = value.find(v => !options.includes(v) && v !== effectiveOtherLabel) || '';
  const showOtherInput = !!(showOther && (value.includes(effectiveOtherLabel) || otherValue));

  const handleToggle = (option: string) => {
    if (showOther && option === effectiveOtherLabel) {
      if (value.includes(effectiveOtherLabel)) {
        onChange(value.filter(v => v !== effectiveOtherLabel));
      } else {
        if (maxSelect && value.length >= maxSelect) return;
        onChange([...value, effectiveOtherLabel]);
      }
      return;
    }

    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      if (maxSelect && value.length >= maxSelect) return;
      onChange([...value, option]);
    }
  };

  const handleSelectAll = () => {
    const allSelected = options.every(opt => value.includes(opt));
    if (allSelected) {
      onChange(value.filter(v => !options.includes(v)));
    } else {
      if (maxSelect) return; // Prevent select all if there is a limit
      onChange([...new Set([...value, ...options])]);
    }
  };

  const handleOtherChange = (text: string) => {
    const filtered = value.filter(v => options.includes(v) || v === effectiveOtherLabel);
    if (text) {
      onChange([...filtered.filter(v => v !== effectiveOtherLabel), text]);
    } else {
      onChange(filtered);
    }
  };

  const isAllSelected = options.every(opt => value.includes(opt));

  return (
    <StepLayout
      title={title}
      description={description}
      onNext={onNext}
      onBack={onBack}
      showBack={showBack}
      showNext={showNext}
      nextDisabled={nextDisabled || value.length === 0}
      scrollable={true}
      selectionMode="multiple"
      maxSelection={maxSelect || undefined}
      extraHeader={
        <div className="flex items-center justify-between w-full h-8">
          {maxSelect ? (
             <MultiSelectIndicator 
               currentCount={value.length} 
               maxCount={maxSelect} 
               minRequired={maxSelect} 
             />
          ) : <div />}

          {(showSelectAll && !maxSelect) && (
            <button 
              onClick={handleSelectAll}
              className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-primary hover:text-ink transition-colors animate-in fade-in slide-in-from-right-4 duration-500"
            >
              {isAllSelected ? t('common.deselect_all') : t('common.select_all')}
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = value.includes(option) || (option === effectiveOtherLabel && showOtherInput);
          const isDisabled = maxSelect && value.length >= maxSelect && !isSelected;
          
          return (
            <OptionButton
              key={option}
              label={option}
              selected={isSelected}
              onClick={() => handleToggle(option)}
              className={isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
              icon="check"
            />
          );
        })}

        {showOtherInput && (
          <div className="pt-2 pb-6">
            <input
              autoFocus
              type="text"
              placeholder={t('matching.round2.common.specify_placeholder')}
              value={otherValue}
              onChange={(e) => handleOtherChange(e.target.value)}
              className="w-full h-12 px-5 rounded-2xl bg-background-warm/60 border border-primary/40 focus:border-primary transition-all text-sm text-ink placeholder:text-ink/20 focus:outline-none"
            />
          </div>
        )}
      </div>
    </StepLayout>
  );
};
