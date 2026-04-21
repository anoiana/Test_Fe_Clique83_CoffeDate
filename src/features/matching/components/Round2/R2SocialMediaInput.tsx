import React, { useRef, useEffect } from 'react';
import { StepLayout } from '../../../onboarding/components/StepLayout';
import { useTranslation } from 'react-i18next';

/**
 * Social Media links input component for Round 2.
 */
interface R2SocialMediaInputProps {
  value: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  onChange: (value: { facebook?: string; instagram?: string; linkedin?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const R2SocialMediaInput = ({ 
  value, onChange, onNext, onBack
}: R2SocialMediaInputProps) => {
  const { t } = useTranslation();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (firstInputRef.current) firstInputRef.current.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field: string, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <StepLayout
      title={t('matching.round2.social_media.title')}
      description={t('matching.round2.social_media.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={false}
      showNext={true}
    >
      <div className="flex flex-col gap-6 pt-4 pb-10">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase text-ink/40 ml-1">
            {t('matching.round2.social_media.facebook.label')}
          </label>
          <input
            ref={firstInputRef}
            type="text"
            value={value.facebook || ''}
            onChange={(e) => handleInputChange('facebook', e.target.value)}
            placeholder={t('matching.round2.social_media.facebook.placeholder')}
            className="w-full p-4 rounded-xl bg-background-warm border border-divider focus:border-primary/50 transition-all text-base text-ink placeholder:text-ink/20 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase text-ink/40 ml-1">
            {t('matching.round2.social_media.instagram.label')}
          </label>
          <input
            type="text"
            value={value.instagram || ''}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
            placeholder={t('matching.round2.social_media.instagram.placeholder')}
            className="w-full p-4 rounded-xl bg-background-warm border border-divider focus:border-primary/50 transition-all text-base text-ink placeholder:text-ink/20 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase text-ink/40 ml-1">
            {t('matching.round2.social_media.linkedin.label')}
          </label>
          <input
            type="text"
            value={value.linkedin || ''}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            placeholder={t('matching.round2.social_media.linkedin.placeholder')}
            className="w-full p-4 rounded-xl bg-background-warm border border-divider focus:border-primary/50 transition-all text-base text-ink placeholder:text-ink/20 focus:outline-none"
          />
        </div>
      </div>
    </StepLayout>
  );
};
