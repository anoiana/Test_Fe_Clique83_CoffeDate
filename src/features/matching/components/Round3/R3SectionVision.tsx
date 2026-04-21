import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroupedStepLayout } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { OptionButton } from '../../../../shared/components/OptionButton';

interface R3SectionVisionProps {
  onNext: () => void;
  onBack: () => void;
}

export const R3SectionVision: React.FC<R3SectionVisionProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();

  const moneyRelation = useWatch({ control, name: 'moneyRelation' });
  const lifeStage = useWatch({ control, name: 'lifeStage' });
  const childrenView = useWatch({ control, name: 'childrenView' });
  const religionImportance = useWatch({ control, name: 'religionImportance' });
  const spirituality = useWatch({ control, name: 'spirituality' });

  // Validation logic
  const errorsList: string[] = [];
  
  const isMoneyError = !moneyRelation;
  if (isMoneyError) errorsList.push('group-money');
  
  const isLifeStageError = !lifeStage;
  if (isLifeStageError) errorsList.push('group-life-stage');
  
  const isChildrenError = !childrenView;
  if (isChildrenError) errorsList.push('group-children');

  const isReligionError = religionImportance === undefined;
  if (isReligionError) errorsList.push('group-religion-importance');

  const isSpiritualityError = spirituality === undefined;
  if (isSpiritualityError) errorsList.push('group-spirituality');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={1}
      totalSteps={4}
      title={<><span className="text-primary italic">ĐỊNH HƯỚNG</span> & NIỀM TIN</>}
      description="Quan điểm sống và những gì bạn hướng tới trong tương lai."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-12 pb-10">
        
        {/* Money Mindset */}
        <SurveyFieldGroup 
          id="group-money"
          label={t('matching.round2.money_relation.title', 'Quan điểm của bạn về tài chính?')} 
          selectionMode="single" 
          error={isMoneyError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'plan_save', label: t('matching.round2.money_relation.options.plan_save', 'I plan and save carefully') },
              { id: 'spend_enjoy', label: t('matching.round2.money_relation.options.spend_enjoy', 'I spend to enjoy life') },
              { id: 'invest_growth', label: t('matching.round2.money_relation.options.invest_growth', 'I invest for long-term growth') },
              { id: 'balance', label: t('matching.round2.money_relation.options.balance', 'I try to balance all three') },
              { id: 'not_focus', label: t('matching.round2.money_relation.options.not_focus', "Money isn't a big focus for me") }
            ].map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={moneyRelation === opt.label}
                onClick={() => setValue('moneyRelation', opt.label, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        {/* Life Stage */}
        <SurveyFieldGroup 
          id="group-life-stage"
          label={t('matching.round2.life_stage.title', 'Bạn đang ở giai đoạn nào của cuộc sống?')} 
          selectionMode="single" 
          error={isLifeStageError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'exploring', label: t('matching.round2.life_stage.options.exploring', 'Exploring / figuring things out') },
              { id: 'building_career', label: t('matching.round2.life_stage.options.building_career', 'Building my career') },
              { id: 'established', label: t('matching.round2.life_stage.options.established', 'Established & stable') },
              { id: 'starting_family', label: t('matching.round2.life_stage.options.starting_family', 'Starting or raising a family') },
              { id: 'in_transition', label: t('matching.round2.life_stage.options.in_transition', 'In transition') }
            ].map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={lifeStage === opt.label}
                onClick={() => setValue('lifeStage', opt.label, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        {/* Children Goal */}
        <SurveyFieldGroup 
          id="group-children"
          label={t('matching.round2.children_view.title', 'Dự định của bạn về con cái?')} 
          selectionMode="single" 
          error={isChildrenError}
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'want_children', label: t('matching.round2.children_view.options.want_children', 'I want children') },
              { id: 'no_children', label: t('matching.round2.children_view.options.no_children', "I don't want children") },
              { id: 'already_have', label: t('matching.round2.children_view.options.already_have', 'I already have children') },
              { id: 'open', label: t('matching.round2.children_view.options.open', "I'm open / undecided") }
            ].map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={childrenView === opt.label}
                onClick={() => setValue('childrenView', opt.label, { shouldValidate: true })}
                size="sm"
              />
            ))}
          </div>
        </SurveyFieldGroup>

        {/* Religion Importance */}
        <SurveyFieldGroup 
          id="group-religion-importance"
          label={t('matching.round2.religion_importance.title', 'Tôn giáo có quan trọng trong cuộc sống của bạn không?')}
          selectionNote={t('common.selection_note_slider', 'Kéo để chọn')}
          error={isReligionError}
        >
          <div className="w-full pt-8 pb-4">
             <div className="relative h-1.5 bg-background-warm rounded-full">
                <div 
                  className={`absolute h-full rounded-full transition-colors duration-300 ${religionImportance !== undefined ? 'bg-primary' : 'bg-ink/10'}`}
                  style={{ width: `${((religionImportance || 1) - 1) * 25}%` }} 
                />
                <input type="range" min="1" max="5" step="1" value={religionImportance || 1} onChange={(e) => setValue('religionImportance', parseInt(e.target.value), { shouldValidate: true })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-background-paper rounded-full shadow-lg pointer-events-none transition-colors duration-300 ${religionImportance !== undefined ? 'bg-primary' : 'bg-ink/20'}`}
                  style={{ left: `${((religionImportance || 1) - 1) * 25}%`, marginLeft: '-12px' }} 
                />
             </div>
             <div className="flex justify-between mt-6 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Không</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Rất quan trọng</span>
             </div>
          </div>
        </SurveyFieldGroup>

        {/* Fortune Belief (Spirituality) */}
        <SurveyFieldGroup 
          id="group-spirituality"
          label={t('matching.round2.spirituality.title', 'Bạn có tin vào tâm linh, tử vi không?')}
          selectionNote={t('common.selection_note_slider', 'Kéo để chọn')}
          error={isSpiritualityError}
        >
          <div className="w-full pt-8 pb-4">
             <div className="relative h-1.5 bg-background-warm rounded-full">
                <div 
                  className={`absolute h-full rounded-full transition-colors duration-300 ${spirituality !== undefined ? 'bg-primary' : 'bg-ink/10'}`}
                  style={{ width: `${((spirituality || 3) - 1) * 25}%` }} 
                />
                <input type="range" min="1" max="5" step="1" value={spirituality || 3} onChange={(e) => setValue('spirituality', parseInt(e.target.value), { shouldValidate: true })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-background-paper rounded-full shadow-lg pointer-events-none transition-colors duration-300 ${spirituality !== undefined ? 'bg-primary' : 'bg-ink/20'}`}
                  style={{ left: `${((spirituality || 3) - 1) * 25}%`, marginLeft: '-12px' }} 
                />
             </div>
             <div className="flex justify-between mt-6 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Thực tế</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Tâm linh</span>
             </div>
          </div>
        </SurveyFieldGroup>

      </div>
    </GroupedStepLayout>
  );
};
