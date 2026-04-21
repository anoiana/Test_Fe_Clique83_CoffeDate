import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { matchingApi } from '../api/matchingApi';
import { buildRound2Payload } from '../utils/surveyMappers';
import { useAsyncAction } from '../../../shared/hooks/useAsyncAction';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { Round2SurveyData } from '../../../shared/types/models';

const INITIAL_DATA: Round2SurveyData = {
  coreValues: [],
  lifestylePreference: '',
  decisionStyle: '',
  ageRange: null,
  introExtro: '',
  attachmentStyle: '',
  conflictStyle: '',
  loveLanguage: [],
  physicalActivity: '',
  height: '',
  minHeight: '',
  activities: [],
  languages: [],
  openness: '',
  dealbreakers: '',
  bio: '',
};

export const useMatchingSurvey = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { execute } = useAsyncAction();
  const { user, updateUser } = useAuthContext();

  const [step, setStep] = useLocalStorage('clique_survey_r2_step', 1);
  const [persistedData, setPersistedData] = useLocalStorage<Round2SurveyData>('clique_survey_r2_data', INITIAL_DATA);

  const formMethods = useForm<Round2SurveyData>({
    defaultValues: persistedData,
    mode: 'onChange'
  });

  const { watch, reset, getValues, control, setValue } = formMethods;

  // Sync localStorage with form state changes
  useEffect(() => {
    const subscription = watch((value) => {
      // Update local storage without triggering a re-render if possible
      // but setPersistedData from useLocalStorage is a state setter, so it will re-render
      // However, since we are using watch callback, it only fires on change.
      setPersistedData(value as Round2SurveyData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setPersistedData]);

  // Sync form state if persistedData changes from outside (e.g. storage events)
  // REMOVED to prevent infinite loop with reset() triggering watch()
  /*
  useEffect(() => {
    if (persistedData && JSON.stringify(persistedData) !== JSON.stringify(getValues())) {
      reset(persistedData);
    }
  }, [persistedData, reset, getValues]);
  */

  // AUTO-REDIRECT removed — RouteGuard already handles progress-based routing.
  // Having a second redirect here caused an infinite loop:
  // RouteGuard says "stay on matching-survey" → this effect says "go to photo-upload" 
  // → RouteGuard on photo-upload says "go back to matching-survey" → infinite loop.

  const totalSteps = 7; // 7 Grouped Sections
  const progress = useMemo(() => (step / totalSteps) * 100, [step, totalSteps]);



  const handleNext = useCallback(async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const currentData = getValues();
      try {
        // Build API payload from localized form data
        const payload = buildRound2Payload(currentData, t);

        await execute(() => matchingApi.submitRound2(payload), {
          loadingMessage: t('matching.round2.curating_experience'),
          successMessage: t('matching.round2.survey_completed'),
          autoHideLoader: true
        });

        localStorage.removeItem('clique_survey_r2_data');
        localStorage.removeItem('clique_survey_r2_step');
        updateUser({ isMatchingSurveyCompleted: true });
        navigate('/onboarding/photo-upload');
      } catch (error: unknown) {
        console.error('ROUND 2 SUBMISSION ERROR:', {
          message: (error as any)?.message,
          stack: (error as any)?.stack,
          user: user?.id || user?.userId
        });

        // If backend says it's already done, just move forward
        const errorMsg = (error as any)?.message || '';
        if (errorMsg.includes('Round 2 đã được chỉnh sửa rồi') || errorMsg.includes('already completed')) {
          updateUser({ isMatchingSurveyCompleted: true, round2Completed: true });
          navigate('/onboarding/photo-upload');
          return;
        }

        if (errorMsg.includes('Membership payment required')) {
          navigate('/onboarding');
        }
      }
    }
  }, [step, totalSteps, getValues, t, execute, updateUser, navigate, user, setStep]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/onboarding/r1-completion');
    }
  }, [step, navigate, setStep]);

  // Safety Reset: If user was on a step > 7 from the old 39-step flow, reset to 1
  useEffect(() => {
    if (step > totalSteps) {
      setStep(1);
    }
  }, [step, totalSteps, setStep]);

  return {
    step,
    formMethods,
    control,
    setValue,
    progress,
    handleNext,
    handleBack,
    totalSteps,
    t
  };
};

