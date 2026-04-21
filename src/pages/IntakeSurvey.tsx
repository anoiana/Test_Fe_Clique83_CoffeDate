import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { PageTransition } from '../shared/components/PageTransition';

import { IntakeSectionName } from '../features/onboarding/components/Intake/IntakeSectionName';
import { IntakeSectionIdentity } from '../features/onboarding/components/Intake/IntakeSectionIdentity';
import { IntakeSectionBackground } from '../features/onboarding/components/Intake/IntakeSectionBackground';


import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../shared/context/AuthContext';
import { useAsyncAction } from '../shared/hooks/useAsyncAction';
import { matchingApi } from '../features/matching/api/matchingApi';
import { IntakeReview } from '../features/onboarding/components/Intake/IntakeReview';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';
import { buildEvaluationPayload } from '../features/onboarding/utils/intakeMappers';

export const IntakeSurvey = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthContext();
  const { execute } = useAsyncAction();

  const [step, setStep] = useLocalStorage('clique_intake_step', 1);
  const [showReview, setShowReview] = useState(false);
  const [data, setData] = useLocalStorage('clique_intake_data', {
    name: '',
    gender: '',
    targetGenders: [],
    birthdate: '',
    location: '',
    education: '',
    workField: '',
    income: '',
    lookingFor: [],
    source: [],
    phoneNumber: user?.phoneNumber || ''
  });

  const methods = useForm({
    defaultValues: data,
    mode: 'onChange'
  });

  const { watch, getValues } = methods;

  useEffect(() => {
    const subscription = watch((value) => {
      setData(value as any);
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  const formData = getValues();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const userId = user?.id || user?.userId;
      // Inject phoneNumber from user object as it's required by the payload mapper
      const finalData = { 
        ...formData, 
        phoneNumber: formData.phoneNumber || user?.phoneNumber || '' 
      };
      const evaluationData = buildEvaluationPayload(finalData as any, userId);

      try {
        await execute(
          async () => await matchingApi.submitEvaluation(evaluationData),
          {
            loadingMessage: t('intake.analyzing_profile'),
            successMessage: t('intake.profile_completed'),
            showToastOnSuccess: true,
            autoHideLoader: true
          }
        );
        
        localStorage.removeItem('clique_intake_data');
        localStorage.removeItem('clique_intake_step');
        updateUser({ 
          round1Completed: true,
          phoneNumber: finalData.phoneNumber
        });
        navigate('/onboarding/r1-completion');
      } catch (err) {
        console.error('Submission error:', err);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  return (
    <FormProvider {...methods}>
      <div className="relative flex flex-col w-full h-[100dvh] bg-background-paper overflow-hidden max-w-lg mx-auto">
        <AnimatePresence>
          {showReview && (
            <IntakeReview
              onClose={() => navigate('/onboarding/matching-survey')}
              onEdit={() => setShowReview(false)}
              ctaLabel={t('common.continue', 'Continue')}
            />
          )}
        </AnimatePresence>

        <main className="flex-1 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <PageTransition key="intake-name">
                <IntakeSectionName
                  onNext={handleNext}
                  onBack={handleBack}
                />
              </PageTransition>
            )}

            {step === 2 && (
              <PageTransition key="intake-identity">
                <IntakeSectionIdentity
                  onNext={handleNext}
                  onBack={handleBack}
                />
              </PageTransition>
            )}

            {step === 3 && (
              <PageTransition key="intake-background">
                <IntakeSectionBackground
                  onNext={handleNext}
                  onBack={handleBack}
                />
              </PageTransition>
            )}
          </AnimatePresence>
        </main>
      </div>
    </FormProvider>
  );
};
