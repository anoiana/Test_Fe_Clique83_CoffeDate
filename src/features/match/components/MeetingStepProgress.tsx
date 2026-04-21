import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, CreditCard, Calendar, Coffee, CheckCircle2 } from 'lucide-react';

interface MeetingStepProgressProps {
  currentStatus: string;
}

/**
 * MeetingStepProgress — Visual indicator of the dating journey.
 * Extracted from MeetingStatusPage for better maintainability and DRY compliance.
 */
export const MeetingStepProgress = ({ currentStatus }: MeetingStepProgressProps) => {
  const { t } = useTranslation();
  const steps = [
    { id: 'match', label: 'Match', icon: Sparkles },
    { id: 'payment', label: t('shared.steps.pay_fee'), icon: CreditCard, statuses: ['awaiting_payment'] },
    { id: 'schedule', label: t('shared.steps.pick_date'), icon: Calendar, statuses: ['awaiting_availability'] },
    { id: 'venue', label: 'Venue', icon: Coffee, statuses: ['slot_found', 'awaiting_location'] },
    { id: 'date', label: t('shared.steps.go'), icon: CheckCircle2, statuses: ['confirmed', 'completed'] }
  ];

  const getActiveStepIndex = () => {
    if (['awaiting_payment'].includes(currentStatus)) return 1;
    if (['awaiting_availability'].includes(currentStatus)) return 2;
    if (['slot_found', 'awaiting_location'].includes(currentStatus)) return 3;
    if (['confirmed', 'completed'].includes(currentStatus)) return 4;
    return 0; // Fresh match
  };

  const activeIndex = getActiveStepIndex();

  return (
    <div className="flex items-center justify-between w-full mb-12 px-1 relative">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx < activeIndex;
        const isActive = idx === activeIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2 group relative z-10">
              <div className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500
                ${isCompleted ? 'bg-primary text-black' : isActive ? 'bg-primary shadow-[0_0_15px_rgba(212,175,55,0.4)] text-black scale-110' : 'bg-background-warm text-ink/20'}
              `}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={isCompleted || isActive ? 2.5 : 1.5} />
              </div>
              <span className={`absolute top-full mt-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap transition-all duration-300 ${isActive ? 'text-primary opacity-100' : 'text-ink/20 opacity-0 sm:opacity-100'}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-background-warm mx-1 sm:mx-2 group-last:hidden relative overflow-hidden -z-0">
                {isCompleted && <div className="absolute inset-0 bg-primary w-full transition-all duration-700" />}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
