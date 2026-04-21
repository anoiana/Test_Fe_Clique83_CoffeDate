import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStepValidation } from './GroupedStepLayout';

interface SurveyFieldGroupProps {
  id?: string;
  label: string;
  selectionNote?: string;
  selectionMode?: 'single' | 'multiple' | 'none';
  maxSelection?: number;
  error?: boolean;
  children: React.ReactNode;
}

export const SurveyFieldGroup: React.FC<SurveyFieldGroupProps> = ({ 
  id,
  label, 
  selectionNote, 
  selectionMode = 'none',
  maxSelection,
  error = false,
  children 
}) => {
  const { t } = useTranslation();
  const { showErrors } = useStepValidation();

  const isShowingError = showErrors && error;

  // Resolve selection note: priority to manual selectionNote, then automatic logic
  const resolvedNote = selectionNote !== undefined ? selectionNote : (selectionMode !== 'none' ? (
    selectionMode === 'single' ? t('common.selection.single') : (
      maxSelection 
        ? t('common.selection.up_to', { count: maxSelection })
        : t('common.selection.multiple')
    )
  ) : null);

  return (
    <div 
      id={id}
      className={`mb-6 last:mb-0 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 rounded-3xl transition-all ${
        isShowingError 
          ? 'bg-red-500/5 ring-1 ring-red-500/20 animate-shake' 
          : ''
      }`}
    >
      {/* Question Label - Minimalist Style */}
      <div className="mb-3 space-y-1">
        <h3 className={`text-[17px] font-medium leading-relaxed flex items-center gap-2 ${isShowingError ? 'text-red-500' : 'text-ink/80'}`}>
          {label}
          {isShowingError && <span className="material-symbols-outlined text-[18px]">error</span>}
        </h3>
        {resolvedNote && (
          <p className={`text-[12px] italic font-serif opacity-80 leading-relaxed ${isShowingError ? 'text-red-500/80' : 'text-primary'}`}>
            {resolvedNote}
          </p>
        )}
      </div>

      {/* Options Container - Flex Wrap for Tags - Supporting 3 items per row */}
      <div className="flex flex-wrap gap-2 text-center">
        {children}
      </div>
    </div>
  );
};

