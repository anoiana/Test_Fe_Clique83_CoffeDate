import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Step {
  id: string;
  modalTitle: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * HelpModal Component
 * Provides a step-by-step tutorial for the application.
 */
export const HelpModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<'app_flow' | 'how_it_works'>('app_flow');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  
  const touchStartX = React.useRef(0);
  const touchEndX = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (swipeDistance > 50 && !isLastStep) {
      setCurrentStepIdx(prev => prev + 1);
    } else if (swipeDistance < -50 && currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const APP_FLOW_STEPS: Step[] = [
    { id: 'value', modalTitle: t('help.steps.value.modal_title'), title: t('help.steps.value.title'), description: t('help.steps.value.desc'), icon: 'flare' },
    { id: 'intake', modalTitle: t('help.steps.intake.modal_title'), title: t('help.steps.intake.title'), description: t('help.steps.intake.desc'), icon: 'assignment_ind' },
    { id: 'membership', modalTitle: t('help.steps.membership.modal_title'), title: t('help.steps.membership.title'), description: t('help.steps.membership.desc'), icon: 'diamond' },
    { id: 'matching', modalTitle: t('help.steps.matching.modal_title'), title: t('help.steps.matching.title'), description: t('help.steps.matching.desc'), icon: 'insights' },
    { id: 'weekly_match', modalTitle: t('help.steps.weekly_match.modal_title'), title: t('help.steps.weekly_match.title'), description: t('help.steps.weekly_match.desc'), icon: 'favorite' },
    { id: 'payment', modalTitle: t('help.steps.payment.modal_title'), title: t('help.steps.payment.title'), description: t('help.steps.payment.desc'), icon: 'payments' },
    { id: 'meeting_flow', modalTitle: t('help.steps.meeting_flow.modal_title'), title: t('help.steps.meeting_flow.title'), description: t('help.steps.meeting_flow.desc'), icon: 'coffee' }
  ];

  const HOW_IT_WORKS_STEPS: Step[] = [
    { id: 'data_depth', modalTitle: t('help.steps.matching.modal_title'), title: t('help.how_match_works.data_depth.title'), description: t('help.how_match_works.data_depth.desc'), icon: 'database' },
    { id: 'psychological_fit', modalTitle: t('help.steps.matching.modal_title'), title: t('help.how_match_works.psychological_fit.title'), description: t('help.how_match_works.psychological_fit.desc'), icon: 'psychology' },
    { id: 'human_curation', modalTitle: t('help.steps.matching.modal_title'), title: t('help.how_match_works.human_curation.title'), description: t('help.how_match_works.human_curation.desc'), icon: 'clinical_notes' }
  ];

  const STEPS = activeMode === 'app_flow' ? APP_FLOW_STEPS : HOW_IT_WORKS_STEPS;
  const currentStep = STEPS[currentStepIdx];
  const isLastStep = currentStepIdx === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleModeChange = (mode: 'app_flow' | 'how_it_works') => {
    setActiveMode(mode);
    setCurrentStepIdx(0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 py-4 px-2">
        {/* Tabs / Progress - Now on Top */}
        <div className="flex justify-between items-center gap-2 mb-1 px-1">
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStepIdx(idx)}
              className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                idx <= currentStepIdx ? 'bg-primary glow-gold-sm' : 'bg-divider'
              }`}
            />
          ))}
        </div>

        {/* Premium Segmented Control / Tabs */}
        <div className="flex flex-col gap-4">
          <div className="flex p-1 bg-ink/[0.03] border border-divider rounded-2xl relative overflow-hidden">
            <div
              className="absolute inset-y-1 rounded-xl bg-ink/5 border border-divider z-0 transition-all duration-300 ease-out"
              style={{
                left: activeMode === 'app_flow' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 6px)'
              }}
            />
            
            <button
              onClick={() => handleModeChange('app_flow')}
              className={`flex-1 relative z-10 py-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${
                activeMode === 'app_flow' ? 'text-primary' : 'text-ink/40 hover:text-ink/60'
              }`}
            >
              <span className="typo-caption-bold">
                {t('help.mode_app_flow', 'App Flow')}
              </span>
            </button>

            <button
              onClick={() => handleModeChange('how_it_works')}
              className={`flex-1 relative z-10 py-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${
                activeMode === 'how_it_works' ? 'text-primary' : 'text-ink/40 hover:text-ink/60'
              }`}
            >
              <span className="typo-caption-bold">
                {t('help.mode_matching', 'Matching')}
              </span>
            </button>
          </div>
        </div>

        {/* Phase Title - Enlarged and Closer */}
        <div className="flex justify-center -mb-2 mt-1 min-h-[20px]">
          <h3 className="typo-modal-title text-center transition-opacity duration-200">
             {currentStep.modalTitle}
          </h3>
        </div>

        {/* Content with Swipe support and Bottom Navigation */}
        <div className="flex flex-col w-full mt-1 relative">
          {/* Swipeable Text Content - Fluid Height */}
          <div 
            className="w-full flex flex-col items-center text-center touch-pan-y min-h-[140px] py-2"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
              <div className="flex flex-col items-center w-full transition-opacity duration-200">
                <h4 className="typo-modal-title italic mb-2">
                  {currentStep.title}
                </h4>
                <p className="typo-desc-bright px-0 sm:px-6">
                  {currentStep.description}
                </p>
              </div>
          </div>

          {/* Bottom Controls / Arrows */}
          <div className="flex justify-between items-center mt-4 px-2">
            <button 
               onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
               className={`w-10 h-10 rounded-full bg-background-warm flex items-center justify-center transition-all active:scale-95 ${currentStepIdx > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
               type="button"
            >
               <span className="material-symbols-outlined text-ink/40 text-2xl">arrow_back</span>
            </button>

            {/* Step Indicator Text (Optional UX hint) */}
            <span className="typo-caption text-ink/20">
              {currentStepIdx + 1} / {STEPS.length}
            </span>

            <button 
               onClick={handleNext}
               className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center transition-all active:scale-95"
               type="button"
            >
               <span className="material-symbols-outlined text-primary text-2xl">{isLastStep ? 'check' : 'arrow_forward'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
