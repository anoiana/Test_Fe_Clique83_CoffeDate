import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const WorkPositionInput = ({ value, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  
  const options = [
    { 
      id: 'c_level', 
      label: t('onboarding.work_position.options.c_level.label'), 
      sub: t('onboarding.work_position.options.c_level.sub') 
    },
    { 
      id: 'mid_manager', 
      label: t('onboarding.work_position.options.mid_manager.label'), 
      sub: t('onboarding.work_position.options.mid_manager.sub') 
    },
    { 
      id: 'team_leader', 
      label: t('onboarding.work_position.options.team_leader.label'), 
      sub: t('onboarding.work_position.options.team_leader.sub') 
    },
    { 
      id: 'staff', 
      label: t('onboarding.work_position.options.staff.label'), 
      sub: t('onboarding.work_position.options.staff.sub') 
    },
    { 
      id: 'other', 
      label: t('onboarding.work_position.options.other.label'), 
      sub: t('onboarding.work_position.options.other.sub') 
    }
  ];

  const handleSelect = (id) => {
    onChange(id);
    setTimeout(() => onNext(), 300);
  };

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.authority')}
      title={t('onboarding.work_position.title')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      showNext={false}
    >
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full py-5 px-6 rounded-2xl flex flex-col transition-all border text-left ${
              value === option.id 
                ? 'bg-primary/20 border-primary shadow-[0_4px_20px_rgba(255,215,0,0.1)]' 
                : 'bg-background-warm border-divider hover:bg-ink/5'
            }`}
          >
            <span className={`text-lg font-bold ${value === option.id ? 'text-primary' : 'text-ink'}`}>
              {option.label}
            </span>
            <span className={`text-xs mt-1 ${value === option.id ? 'text-primary/70' : 'text-ink/40'}`}>
              {option.sub}
            </span>
          </button>
        ))}
      </div>
    </StepLayout>
  );
};
