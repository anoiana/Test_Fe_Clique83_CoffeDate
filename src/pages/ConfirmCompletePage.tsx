import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, ChevronLeft, Sparkles, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '../shared/components/PageTransition';
import { useNotification } from '../shared/context/NotificationContext';
import { feedbackApi } from '../features/feedback/api/feedbackApi';

const MINUTES_TO_UNLOCK = 30;

function getRemainingMinutes(agreedSlot: string): number {
  const agreedDate = new Date(agreedSlot);
  const unlockTime = new Date(agreedDate.getTime() + MINUTES_TO_UNLOCK * 60 * 1000);
  const now = new Date();
  const diffMs = unlockTime.getTime() - now.getTime();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (60 * 1000));
}

function isUnlocked(agreedSlot: string): boolean {
  return getRemainingMinutes(agreedSlot) <= 0;
}

function formatCountdown(agreedSlot: string): string {
  const mins = getRemainingMinutes(agreedSlot);
  if (mins <= 0) return '0';
  if (mins === 1) return '1';
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}`;
}

/**
 * ConfirmCompletePage — Phase 33
 * Route: /meeting/:meetingId/confirm-complete
 *
 * Step 2 of the feedback flow.
 * Shows a locked "Hoàn thành cuộc hẹn" button with live countdown.
 * User clicks → navigate to /meeting/:meetingId/feedback
 *
 * States:
 *  - locked: countdown visible, button disabled
 *  - unlocked: button enabled, user can proceed
 */
export const ConfirmCompletePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const { showError } = useNotification();

  // agreedSlot từ localStorage (được set bởi PromiseMadePage hoặc MeetingStatusPage)
  const [agreedSlot] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(`meeting_${meetingId}_agreedSlot`) : null
  );
  const [remainingMinutes, setRemainingMinutes] = useState(() =>
    agreedSlot ? getRemainingMinutes(agreedSlot) : 0
  );

  // Update countdown every 30 seconds
  useEffect(() => {
    if (!agreedSlot) return;

    const update = () => setRemainingMinutes(getRemainingMinutes(agreedSlot));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [agreedSlot]);

  const unlocked = agreedSlot ? isUnlocked(agreedSlot) : false;
  const countdownText = agreedSlot ? formatCountdown(agreedSlot) : '0';

  const handleComplete = async () => {
    if (!unlocked || !meetingId) return;
    try {
      await feedbackApi.completeMeeting(meetingId);
      navigate(`/meeting/${meetingId}/feedback`);
    } catch (err: unknown) {
      showError((err as any)?.message || t('meeting_status.fetch_error'));
    }
  };

  const handleBack = () => navigate(`/meeting/${meetingId}/promise`, { replace: true });

  return (
    <PageTransition className="bg-background-paper flex flex-col min-h-screen">
      <div className="flex flex-col flex-1 p-6 pb-10 font-sans relative overflow-hidden max-w-lg mx-auto w-full">

        {/* Header */}
        <div className="flex items-center gap-4 mt-4 mb-12">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-background-warm border border-divider flex items-center justify-center text-ink/50 hover:text-ink/80 active:scale-90 transition-all shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-col">
            <span className="typo-caption-cinematic text-primary font-bold tracking-[0.2em]">{t('feedback.confirm.title')}</span>
            <div className="h-0.5 w-12 bg-primary/40 rounded-full mt-1" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 items-center justify-center text-center gap-8">

          {/* Lock/Unlocked animation */}
          <motion.div
            key={unlocked ? 'unlocked' : 'locked'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className={`absolute inset-0 rounded-full blur-2xl scale-150 ${unlocked ? 'bg-primary/20' : 'bg-background-warm'}`} />
            <div className={`w-24 h-24 rounded-full flex items-center justify-center relative border ${
              unlocked ? 'bg-primary/10 border-primary/30' : 'bg-background-warm/60 border-divider'
            }`}>
              {unlocked ? (
                <Sparkles className="w-12 h-12 text-primary" />
              ) : (
                <Lock className="w-12 h-12 text-ink/20" />
              )}
            </div>
          </motion.div>

          {/* Title & countdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <h1 className="text-3xl font-black text-ink">
              {unlocked ? t('feedback.confirm.ready') : t('feedback.confirm.locked')}
            </h1>

            {/* Countdown */}
            {!unlocked ? (
              <div className="flex flex-col gap-1">
                <p className="text-ink/50 text-[13px] leading-relaxed max-w-[260px]">
                  {t('feedback.confirm.unlock_desc')}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2 px-6 py-3 rounded-2xl bg-ink/[0.04] border border-divider w-fit mx-auto">
                  <Clock size={18} className="text-primary animate-pulse" />
                  <span className="text-2xl font-black text-primary tracking-widest">
                    {countdownText}
                  </span>
                  <span className="text-ink/40 text-sm font-bold uppercase tracking-widest">
                    {remainingMinutes <= 1 ? t('feedback.confirm.minute') : t('feedback.confirm.minutes')}
                  </span>
                </div>
                <p className="text-ink/40 text-[12px] uppercase tracking-widest font-bold mt-2">
                  {t('feedback.confirm.unlock_footer')}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-ink/50 text-[13px] leading-relaxed max-w-[260px]">
                  {t('feedback.confirm.countdown_ready')}
                </p>
                <p className="text-primary text-[13px] font-bold uppercase tracking-widest">
                  {t('feedback.confirm.unlocked_message')}
                </p>
              </div>
            )}
          </motion.div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="px-6 py-5 rounded-2xl bg-background-warm/60 border border-divider text-left w-full max-w-[320px]"
          >
            <p className="text-[12px] text-ink/40 font-bold uppercase tracking-widest mb-2">
              {t('feedback.confirm.note_label')}
            </p>
            <p className="text-[13px] text-ink/60 leading-relaxed">
              {t('feedback.confirm.note_desc')}
            </p>
          </motion.div>
        </div>

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10"
        >
          {!unlocked ? (
            <button
              disabled
              className="w-full py-5 rounded-full bg-ink/[0.04] text-ink/20 font-bold uppercase tracking-[0.2em] text-[12px] cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Lock size={16} />
              {t('feedback.confirm.action_button')}
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="w-full py-5 rounded-full bg-primary text-black font-bold uppercase tracking-[0.2em] text-[12px] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <Sparkles size={16} />
              {t('feedback.confirm.action_button')}
            </button>
          )}

          <button
            onClick={handleBack}
            className="w-full py-3 mt-3 rounded-full text-ink/40 font-bold text-[11px] uppercase tracking-widest"
          >
            {t('meeting_status.back_to_search')}
          </button>
        </motion.div>

      </div>
    </PageTransition>
  );
};
