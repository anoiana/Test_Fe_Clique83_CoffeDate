import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { useAsyncAction } from '../../../shared/hooks/useAsyncAction';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { Round3SurveyData } from '../../../shared/types/models';
import { buildRound3Payload } from '../utils/surveyMappers';
import { matchingApi } from '../api/matchingApi';

const INITIAL_DATA: Round3SurveyData = {
  moneyRelation: '',
  lifeStage: '',
  childrenView: '',
  diet: '',
  petPreference: '',
  sharedInterests: 3,
  religionImportance: 1,
  spirituality: 3,
  culturalBg: '',
  nationality: '',
  smoking: '',
  acceptSmoker: '',
  drinking: '',
  acceptDrinking: '',
  maritalStatus: '',
  acceptDivorced: '',
  descriptiveWords: { energy: '', depth: '', values: '' },
  anythingElse: '',
  mbti: ''
};

export const useRound3Survey = () => {

  const { t } = useTranslation('matching');
  const navigate = useNavigate();
  const { execute } = useAsyncAction();
  const { user, updateUser } = useAuthContext();
  
  const [step, setStep] = useLocalStorage('clique_survey_r3_step', 1);
  const [persistedData, setPersistedData] = useLocalStorage<Round3SurveyData>('clique_survey_r3_data', INITIAL_DATA);

  const formMethods = useForm<Round3SurveyData>({
    defaultValues: persistedData,
    mode: 'onChange'
  });

  const { watch, getValues, setValue } = formMethods;
  
  // Auto-save partial data when values change
  const currentData = watch();
  if (JSON.stringify(currentData) !== JSON.stringify(persistedData)) {
    setPersistedData(currentData as Round3SurveyData);
  }

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const data = getValues();
      try {
        const payload = buildRound3Payload(data, t);
        
        await execute(() => matchingApi.submitRound3(payload), { 
          loadingMessage: t('round3.submitting', 'Đang lưu hồ sơ chi tiết...'), 
          successMessage: t('round3.completed', 'Hồ sơ của bạn đã hoàn tất!'), 
          autoHideLoader: true 
        });
        
        updateUser({ isFullyOnboarded: true });
        localStorage.removeItem('clique_survey_r3_data');
        localStorage.removeItem('clique_survey_r3_step');
        
        navigate('/onboarding/round3-success');
      } catch (err) {
        console.error('Submit Round 3 failed:', err);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/onboarding/membership-success');
    }
  };

  return {
    step,
    totalSteps,
    formMethods,
    progress,
    handleNext,
    handleBack,
    t
  };
};
