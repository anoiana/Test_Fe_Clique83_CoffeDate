import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const FullBodyPhotoInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.full_view')}
      title={t('onboarding.full_body_photo.title')}
      description={t('onboarding.full_body_photo.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      scrollable={false}
    >
      <div className="flex flex-col items-center justify-center h-full pb-4">
        <div className="relative group mx-auto w-full max-w-[220px]">
          <div className="w-full aspect-[4/5] rounded-[32px] border-2 border-dashed border-divider bg-background-warm/60 overflow-hidden flex items-center justify-center transition-all group-hover:border-primary/50 shadow-2xl">
            {preview ? (
              <img src={preview} alt={t('onboarding.full_body_photo.preview_alt')} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <span className="material-symbols-outlined text-5xl text-primary/40">
                  accessibility_new
                </span>
                <p className="text-ink/40 text-xs">
                  {t('onboarding.full_body_photo.preview_text')}
                </p>
              </div>
            )}
          </div>
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            onChange={handleFileChange}
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-background-dark w-12 h-12 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(255,215,0,0.4)] border-4 border-background-dark transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-2xl font-bold">photo_library</span>
          </div>
        </div>
      </div>
    </StepLayout>
  );
};
