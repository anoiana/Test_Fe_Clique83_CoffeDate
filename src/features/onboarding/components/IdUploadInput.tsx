import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const IdUploadInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Mock upload
      onChange(e.dataTransfer.files[0].name);
    }
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.verification')}
      title={t('onboarding.id_upload.title')}
      description={t('onboarding.id_upload.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      scrollable={false}
    >
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative w-full h-64 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : value 
              ? 'border-primary/40 bg-primary/5' 
              : 'border-divider bg-background-warm/60'
        }`}
      >
        <span className="material-symbols-outlined text-4xl text-primary/60">
          {value ? 'task' : 'cloud_upload'}
        </span>
        <div className="text-center">
          <p className="text-ink font-medium">
            {value ? value : t('onboarding.id_upload.drop_text')}
          </p>
          <p className="text-ink/40 text-xs mt-1">
            {value ? t('onboarding.id_upload.finish_hint') : t('onboarding.id_upload.browse_text')}
          </p>
        </div>
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => e.target.files && onChange(e.target.files[0].name)}
        />
      </div>
    </StepLayout>
  );
};
