import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { OptionButton } from '../../../../shared/components/OptionButton';

interface R3SectionExpressionProps {
  onNext: () => void;
  onBack: () => void;
}

export const R3SectionExpression: React.FC<R3SectionExpressionProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();

  const sharedInterests = useWatch({ control, name: 'sharedInterests' });
  const descriptiveWords = useWatch({ control, name: 'descriptiveWords' });
  const anythingElse = useWatch({ control, name: 'anythingElse' });
  const mbti = useWatch({ control, name: 'mbti' });

  const handleWordSelect = (category: 'energy' | 'depth' | 'values', word: string) => {
    setValue('descriptiveWords', { ...descriptiveWords, [category]: word }, { shouldValidate: true });
  };

  const ENERGY_WORDS = ['Ấm áp', 'Hài hước', 'Nhẹ nhàng', 'Hòa đồng', 'Cởi mở', 'Điềm đạm', 'Tự tin', 'Tích cực'];
  const DEPTH_WORDS = ['Sâu sắc', 'Tinh tế', 'Thấu hiểu', 'Lý trí', 'Chín chắn', 'Độc lập', 'Tình cảm', 'Kiên định'];
  const VALUES_WORDS = ['Chân thành', 'Tử tế', 'Bản lĩnh', 'Trách nhiệm', 'Quan tâm', 'Kỷ luật', 'Bao dung', 'Cầu tiến'];

  const MBTI_OPTIONS = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  // Validation logic
  const errorsList: string[] = [];
  
  const isSharedInterestsError = sharedInterests === undefined;
  if (isSharedInterestsError) errorsList.push('group-shared-interests');
  
  const isEnergyError = !descriptiveWords?.energy;
  if (isEnergyError) errorsList.push('group-word-energy');
  
  const isDepthError = !descriptiveWords?.depth;
  if (isDepthError) errorsList.push('group-word-depth');

  const isValuesError = !descriptiveWords?.values;
  if (isValuesError) errorsList.push('group-word-values');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={4}
      totalSteps={4}
      title={<><span className="text-primary italic">THẤU HIỂU</span> BẢN THÂN</>}
      description="Bước cuối cùng để chúng tôi hiểu rõ về cá tính của bạn."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        
        {/* Shared Interests Importance */}
        <SurveyFieldGroup 
          id="group-shared-interests"
          label={t('matching.round2.shared_interests.title', 'Việc có chung sở thích quan trọng như thế nào?')}
          selectionNote={t('common.selection_note_slider', 'Kéo để chọn')}
          error={isSharedInterestsError}
        >
          <div className="w-full pt-8 pb-4">
             <div className="relative h-1.5 bg-background-warm rounded-full">
                <div 
                  className={`absolute h-full rounded-full transition-colors duration-300 ${sharedInterests !== undefined ? 'bg-primary' : 'bg-ink/10'}`}
                  style={{ width: `${((sharedInterests || 3) - 1) * 25}%` }} 
                />
                <input type="range" min="1" max="5" step="1" value={sharedInterests || 3} onChange={(e) => setValue('sharedInterests', parseInt(e.target.value), { shouldValidate: true })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-background-paper rounded-full shadow-lg pointer-events-none transition-colors duration-300 ${sharedInterests !== undefined ? 'bg-primary' : 'bg-ink/20'}`}
                  style={{ left: `${((sharedInterests || 3) - 1) * 25}%`, marginLeft: '-12px' }} 
                />
             </div>
             <div className="flex justify-between mt-6 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Không</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Rất quan trọng</span>
             </div>
          </div>
        </SurveyFieldGroup>

        {/* 3-Section Descriptive Words */}
        <div className="space-y-6">
          <SurveyFieldGroup 
            id="group-word-energy"
            label="Năng lượng của bạn" 
            selectionNote="CHỌN 1 TỪ TỎA RA NĂNG LƯỢNG CỦA BẠN"
            error={isEnergyError}
          >
            <div className="flex flex-wrap gap-2.5">
              {ENERGY_WORDS.map(word => (
                <OptionButton key={word} label={word} selected={descriptiveWords?.energy === word} onClick={() => handleWordSelect('energy', word)} size="sm" />
              ))}
            </div>
          </SurveyFieldGroup>

          <SurveyFieldGroup 
            id="group-word-depth"
            label="Chiều sâu tính cách" 
            selectionNote="CHỌN 1 TỪ MÔ TẢ NỘI TÂM"
            error={isDepthError}
          >
            <div className="flex flex-wrap gap-2.5">
              {DEPTH_WORDS.map(word => (
                <OptionButton key={word} label={word} selected={descriptiveWords?.depth === word} onClick={() => handleWordSelect('depth', word)} size="sm" />
              ))}
            </div>
          </SurveyFieldGroup>

          <SurveyFieldGroup 
            id="group-word-values"
            label="Giá trị theo đuổi" 
            selectionNote="CHỌN 1 TỪ LÀ KIM CHỈ NAM"
            error={isValuesError}
          >
            <div className="flex flex-wrap gap-2.5">
              {VALUES_WORDS.map(word => (
                <OptionButton key={word} label={word} selected={descriptiveWords?.values === word} onClick={() => handleWordSelect('values', word)} size="sm" />
              ))}
            </div>
          </SurveyFieldGroup>
        </div>

        {/* MBTI (Optional) */}
        <SurveyFieldGroup label="MBTI (Tùy chọn)" selectionMode="single" selectionNote="Nếu bạn biết nhóm tính cách của mình">
          <div className="flex flex-wrap gap-2.5">
            {MBTI_OPTIONS.map((opt) => (
              <OptionButton
                key={opt}
                label={opt}
                selected={mbti === opt}
                onClick={() => setValue('mbti', mbti === opt ? '' : opt, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        {/* Additional Notes (Optional) */}
        <SurveyFieldGroup label="Ghi chú thêm (Tùy chọn)" selectionNote="Bất cứ điều gì bạn muốn chia sẻ thêm">
          <textarea
            value={anythingElse || ''}
            onChange={(e) => setValue('anythingElse', e.target.value)}
            placeholder="Ví dụ: Mình thích người biết nấu ăn, hoặc mình không thích mùi thuốc lá..."
            className="w-full h-32 bg-background-warm border border-divider rounded-3xl p-6 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </SurveyFieldGroup>

      </div>
    </GroupedStepLayout>
  );
};
