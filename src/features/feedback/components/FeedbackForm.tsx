import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../../../shared/components/PageTransition';
import { feedbackApi } from '../api/feedbackApi';
import { useLoading } from '../../../shared/context/LoadingContext';
import { useNotification } from '../../../shared/context/NotificationContext';
import type { MeetingFeedbackSubmission, HasMetStatus } from '../../../shared/types/models';
import { ApiError } from '../../../shared/types/index';

interface FeedbackFormProps {
  meetingId: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

const STAR_COUNT = 5;

type RatingField = 'interestInYou' | 'appearance' | 'punctuality' | 'confidence' | 'comfortableSharing' | 'understoodPartner';

interface FormState extends MeetingFeedbackSubmission {
  // Q1: hasMet
  hasMet: HasMetStatus;
  // Q2: durationMinutes
  durationMinutes?: number;
  // Q3: overallExperience
  overallExperience: string;
  // Q4: conversationBalance
  conversationBalance: string;
  // Q5: partnerRating
  partnerRating: {
    interestInYou: number;
    appearance: number;
    punctuality: number;
  };
  // Q6: selfRating
  selfRating: {
    confidence: number;
    comfortableSharing: number;
    understoodPartner: number;
  };
  // Q7: wantsToMeetAgain
  wantsToMeetAgain: boolean;
  // Q8: hasSecondDatePlan
  hasSecondDatePlan: boolean;
  // Q9: openFeedback
  openFeedback: string;
}

/** Star rating component (1–5) */
const StarRating = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) => (
  <div className="flex flex-col items-center gap-2">
    <span className="text-[11px] text-ink/40 font-bold uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-1.5">
      {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className="transition-all active:scale-90"
          type="button"
          aria-label={`${n} star`}
        >
          <Star
            size={28}
            className={`transition-all ${
              n <= value
                ? 'text-primary fill-primary drop-shadow-[0_0_8px_rgba(209,169,62,0.6)]'
                : 'text-ink/20'
            }`}
          />
        </button>
      ))}
    </div>
    {value > 0 && (
      <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{value}/5</span>
    )}
  </div>
);

/** Toggle/Checkbox component */
const ToggleOption = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-full flex items-center justify-between py-4 px-5 rounded-2xl border transition-all active:scale-[0.98] ${
      checked
        ? 'border-primary/40 bg-primary/10 text-primary'
        : 'border-divider bg-background-warm/60 text-ink/60 hover:border-divider'
    }`}
  >
    <span className="text-[13px] font-bold uppercase tracking-wider">{label}</span>
    <div
      className={`w-12 h-7 rounded-full transition-all flex items-center px-1 ${
        checked ? 'bg-primary justify-end' : 'bg-ink/5 justify-start'
      }`}
    >
      <div className="w-5 h-5 rounded-full bg-white shadow-md" />
    </div>
  </button>
);

const hasMetOptions: { value: HasMetStatus; key: string }[] = [
  { value: 'yes', key: 'questions.hasMet.yes' },
  { value: 'no', key: 'questions.hasMet.no' },
  { value: 'missed', key: 'questions.hasMet.missed' },
];

export const FeedbackForm = ({ meetingId, onBack, onSuccess }: FeedbackFormProps) => {
  const { t } = useTranslation();
  const { showLoader, hideLoader } = useLoading();
  const { showError } = useNotification();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    hasMet: 'yes',
    durationMinutes: undefined,
    overallExperience: '',
    conversationBalance: '',
    partnerRating: { interestInYou: 0, appearance: 0, punctuality: 0 },
    selfRating: { confidence: 0, comfortableSharing: 0, understoodPartner: 0 },
    wantsToMeetAgain: false,
    hasSecondDatePlan: false,
    openFeedback: '',
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateNested = (
    group: 'partnerRating' | 'selfRating',
    key: keyof FormState['partnerRating'] | keyof FormState['selfRating'],
    value: number
  ) =>
    setForm((prev) => ({
      ...prev,
      [group]: { ...prev[group], [key]: value },
    }));

  const canGoNext = () => {
    switch (currentStep) {
      case 0: return !!form.hasMet;
      case 1: return true; // duration is optional
      case 2: return form.overallExperience.trim().length > 0;
      case 3: return form.conversationBalance.trim().length > 0;
      case 4:
        return (
          form.partnerRating.interestInYou > 0 &&
          form.partnerRating.appearance > 0 &&
          form.partnerRating.punctuality > 0
        );
      case 5:
        return (
          form.selfRating.confidence > 0 &&
          form.selfRating.comfortableSharing > 0 &&
          form.selfRating.understoodPartner > 0
        );
      case 6: return true; // toggle, always ok
      case 7: return true; // toggle, always ok
      case 8: return true; // optional
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    showLoader('SUBMITTING FEEDBACK');

    const payload: MeetingFeedbackSubmission = {
      hasMet: form.hasMet,
      durationMinutes: form.durationMinutes,
      overallExperience: form.overallExperience,
      conversationBalance: form.conversationBalance,
      partnerRating: form.partnerRating,
      selfRating: form.selfRating,
      wantsToMeetAgain: form.wantsToMeetAgain,
      hasSecondDatePlan: form.hasSecondDatePlan,
      openFeedback: form.openFeedback || undefined,
    };

    try {
      await feedbackApi.submitFeedback(meetingId, payload);
      onSuccess ? onSuccess() : onBack?.();
    } catch (err: unknown) {
      const status = (err as ApiError)?.response?.status;
      if (status === 409) {
        showError(t('feedback.errors.already_submitted'));
      } else {
        showError(t('feedback.errors.meeting_not_completed'));
      }
    } finally {
      hideLoader();
      setIsSubmitting(false);
    }
  };

  // Steps definitions
  const totalSteps = 9;

  return (
    <PageTransition className="bg-background-paper flex flex-col min-h-screen">
      <div className="flex flex-col flex-1 p-6 pb-6 font-sans relative overflow-hidden max-w-lg mx-auto w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          {onBack ? (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-background-warm border border-divider flex items-center justify-center text-ink/50 hover:text-ink/80 active:scale-90 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
          ) : (
            <div />
          )}
          <div className="flex flex-col items-center">
            <span className="typo-caption-cinematic text-primary font-bold tracking-[0.2em]">
              {t('feedback.header')}
            </span>
          </div>
          <div className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">
            {currentStep + 1}/{totalSteps}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-background-warm rounded-full mb-8 shrink-0 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {/* ── Step 0: Has Met ── */}
              {currentStep === 0 && (
                <div className="flex flex-col gap-5">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-ink mb-2">{t('feedback.questions.hasMet.label')}</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {hasMetOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update('hasMet', opt.value)}
                        className={`w-full py-4 px-6 rounded-2xl border text-[13px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] ${
                          form.hasMet === opt.value
                            ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_20px_rgba(122,46,46,0.15)]'
                            : 'border-divider bg-background-warm/60 text-ink/50 hover:border-divider'
                        }`}
                      >
                        {t(opt.key)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 1: Duration ── */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-5">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-ink mb-2">{t('feedback.questions.duration.label')}</h2>
                  </div>
                  <div className="flex items-center gap-3 bg-background-warm/60 border border-divider rounded-2xl px-5 py-4">
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={form.durationMinutes ?? ''}
                      onChange={(e) => update('durationMinutes', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder={t('feedback.questions.duration.placeholder')}
                      className="flex-1 bg-transparent text-ink text-lg font-bold outline-none placeholder:text-ink/20"
                    />
                    <span className="text-primary text-sm font-bold uppercase tracking-wider shrink-0">
                      {t('feedback.questions.duration.suffix')}
                    </span>
                  </div>
                </div>
              )}

              {/* ── Step 2: Overall Experience ── */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-5">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-ink mb-2">{t('feedback.questions.overallExperience.label')}</h2>
                  </div>
                  <textarea
                    value={form.overallExperience}
                    onChange={(e) => update('overallExperience', e.target.value)}
                    placeholder={t('feedback.questions.overallExperience.placeholder')}
                    rows={5}
                    className="w-full bg-background-warm/60 border border-divider rounded-2xl px-5 py-4 text-[14px] text-ink placeholder:text-ink/20 outline-none focus:border-primary/40 transition-all resize-none font-light leading-relaxed"
                  />
                </div>
              )}

              {/* ── Step 3: Conversation Balance ── */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-5">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-ink mb-2">{t('feedback.questions.conversationBalance.label')}</h2>
                  </div>
                  <textarea
                    value={form.conversationBalance}
                    onChange={(e) => update('conversationBalance', e.target.value)}
                    placeholder={t('feedback.questions.conversationBalance.placeholder')}
                    rows={5}
                    className="w-full bg-background-warm/60 border border-divider rounded-2xl px-5 py-4 text-[14px] text-ink placeholder:text-ink/20 outline-none focus:border-primary/40 transition-all resize-none font-light leading-relaxed"
                  />
                </div>
              )}

              {/* ── Step 4: Partner Rating (3 stars) ── */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-6">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-ink mb-2">{t('feedback.questions.partnerRating.label')}</h2>
                  </div>
                  <div className="flex justify-center gap-8">
                    {(['interestInYou', 'appearance', 'punctuality'] as const).map((field) => (
                      <StarRating
                        key={field}
                        label={t(`feedback.questions.partnerRating.${field}`)}
                        value={form.partnerRating[field]}
                        onChange={(v) => updateNested('partnerRating', field, v)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 5: Self Rating (3 stars) ── */}
              {currentStep === 5 && (
                <div className="flex flex-col gap-6">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-ink mb-2">{t('feedback.questions.selfRating.label')}</h2>
                  </div>
                  <div className="flex justify-center gap-8">
                    {(['confidence', 'comfortableSharing', 'understoodPartner'] as const).map((field) => (
                      <StarRating
                        key={field}
                        label={t(`feedback.questions.selfRating.${field}`)}
                        value={form.selfRating[field]}
                        onChange={(v) => updateNested('selfRating', field, v)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 6: Wants to meet again ── */}
              {currentStep === 6 && (
                <div className="flex flex-col gap-5">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-ink">{t('feedback.questions.wantsToMeetAgain.label')}</h2>
                  </div>
                  <ToggleOption
                    label={form.wantsToMeetAgain ? '✅ Yes' : '❌ No'}
                    checked={form.wantsToMeetAgain}
                    onChange={(v) => update('wantsToMeetAgain', v)}
                  />
                </div>
              )}

              {/* ── Step 7: Second date plan ── */}
              {currentStep === 7 && (
                <div className="flex flex-col gap-5">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-ink">{t('feedback.questions.hasSecondDatePlan.label')}</h2>
                  </div>
                  <ToggleOption
                    label={form.hasSecondDatePlan ? '✅ Yes' : '❌ No'}
                    checked={form.hasSecondDatePlan}
                    onChange={(v) => update('hasSecondDatePlan', v)}
                  />
                </div>
              )}

              {/* ── Step 8: Open feedback ── */}
              {currentStep === 8 && (
                <div className="flex flex-col gap-5">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-ink mb-2">{t('feedback.questions.openFeedback.label')}</h2>
                  </div>
                  <textarea
                    value={form.openFeedback}
                    onChange={(e) => update('openFeedback', e.target.value)}
                    placeholder={t('feedback.questions.openFeedback.placeholder')}
                    rows={5}
                    className="w-full bg-background-warm/60 border border-divider rounded-2xl px-5 py-4 text-[14px] text-ink placeholder:text-ink/20 outline-none focus:border-primary/40 transition-all resize-none font-light leading-relaxed"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-6 shrink-0">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="w-14 h-14 rounded-full bg-background-warm border border-divider flex items-center justify-center text-ink/50 hover:text-ink/80 active:scale-90 transition-all shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canGoNext()}
              className={`flex-1 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[12px] transition-all flex items-center justify-center gap-2 ${
                canGoNext()
                  ? 'bg-primary text-black shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98]'
                  : 'bg-background-warm text-ink/20 cursor-not-allowed'
              }`}
            >
              Continue
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-5 rounded-full bg-primary text-black font-bold uppercase tracking-[0.2em] text-[12px] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('feedback.actions.submitting') : t('feedback.actions.submit')}
              {!isSubmitting && <ChevronRight size={16} strokeWidth={3} />}
            </button>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
