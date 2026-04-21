import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, AlertCircle, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '../shared/components/PageTransition';
import { useLoading } from '../shared/context/LoadingContext';
import { feedbackApi } from '../features/feedback/api/feedbackApi';
import { FeedbackForm } from '../features/feedback/components/FeedbackForm';
import { ApiError } from '../shared/types/index';

type Phase = 'loading' | 'form' | 'locked' | 'error';

interface ErrorPayload {
  title: string;
  message: string;
  canRetry: boolean;
}

/**
 * FeedbackPage — Phase 33
 * Route: /meeting/:meetingId/feedback
 *
 * On mount:
 *  1. If status already 'completed' (cron job / already confirmed) → skip API, show form.
 *  2. If 30-minute guard hasn't passed → show locked screen.
 *  3. If any other error → show error screen.
 *
 * On submit success → navigates to /meeting/:id/feedback/thank-you
 */
export const FeedbackPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const { showLoader, hideLoader } = useLoading();

  const [phase, setPhase] = useState<Phase>('loading');
  const [errorPayload, setErrorPayload] = useState<ErrorPayload | null>(null);

  useEffect(() => {
    if (!meetingId) {
      navigate('/meeting-status', { replace: true });
      return;
    }

    const initFeedback = async () => {
      showLoader('INITIALIZING FEEDBACK');
      try {
        // API 1: Complete meeting — /meetings/:id/complete-meeting
        // Backend: 400 if < 30 min, 409 if already submitted, 200 on success
        await feedbackApi.completeMeeting(meetingId);
        setPhase('form');
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        const status = apiErr?.response?.status;
        const errMsg = apiErr?.message || (err as Error)?.message || '';

        if (status === 409) {
          // Meeting already completed (cron job) — still show the form
          setPhase('form');
        } else if (status === 400 && errMsg.toLowerCase().includes('30')) {
          // Backend guard: 30-minute constraint triggered
          setErrorPayload({
            title: t('feedback.errors.too_early_title'),
            message: t('feedback.errors.too_early_message'),
            canRetry: true,
          });
          setPhase('locked');
        } else {
          setErrorPayload({
            title: t('shared.error.system_error'),
            message: errMsg || t('meeting_status.fetch_error'),
            canRetry: false,
          });
          setPhase('error');
        }
      } finally {
        hideLoader();
      }
    };

    initFeedback();
  }, [meetingId]);

  const retry = () => {
    setPhase('loading');
    setErrorPayload(null);
    window.location.reload();
  };

  const handleBack = () => navigate('/meeting-status', { replace: true });

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <PageTransition className="bg-background-paper flex flex-col min-h-screen">
        <div className="flex flex-col flex-1 p-6 pb-20 font-sans relative max-w-lg mx-auto w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <p className="text-ink/40 text-sm font-bold uppercase tracking-widest">
              {t('loading.processing_decision')}
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // ── Locked (30-min guard) ─────────────────────────────────────────────────────
  if (phase === 'locked') {
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
            <span className="typo-caption-cinematic text-primary font-bold tracking-[0.2em]">{t('feedback.header')}</span>
          </div>

          {/* Locked content */}
          <div className="flex flex-col flex-1 items-center justify-center text-center gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150" />
              <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative">
                <Clock className="w-12 h-12 text-primary" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-3"
            >
              <h1 className="text-3xl font-black text-ink">{errorPayload?.title}</h1>
              <p className="text-ink/60 text-[15px] leading-relaxed max-w-[280px]">
                {errorPayload?.message}
              </p>
              <p className="text-primary text-sm font-bold uppercase tracking-widest">
                {t('feedback.errors.too_early_wait')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-background-warm/60 border border-divider"
            >
              <Clock size={14} className="text-primary animate-pulse" />
              <span className="text-[11px] font-bold text-ink/40 uppercase tracking-widest">
                {t('feedback.errors.too_early_wait')}
              </span>
            </motion.div>
          </div>

          {/* Retry button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative z-10"
          >
            <button
              onClick={retry}
              className="w-full py-5 rounded-full bg-primary text-black font-bold uppercase tracking-[0.2em] text-[12px] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              {t('common.retry')}
            </button>
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
  }

  // ── Error (unknown) ────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <PageTransition className="bg-background-paper flex flex-col min-h-screen">
        <div className="flex flex-col flex-1 p-6 pb-20 font-sans relative max-w-lg mx-auto w-full items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <AlertCircle className="w-12 h-12 text-ink/20" />
            <p className="text-ink/60 text-center text-[15px]">{errorPayload?.message}</p>
            <div className="flex flex-col gap-3 w-full">
              {errorPayload?.canRetry && (
                <button
                  onClick={retry}
                  className="px-8 py-4 rounded-full bg-primary text-black font-bold uppercase tracking-wider text-[12px]"
                >
                  {t('common.retry', 'Thử lại')}
                </button>
              )}
              <button
                onClick={handleBack}
                className="px-8 py-4 rounded-full border border-divider text-ink/60 text-sm font-bold uppercase tracking-wider"
              >
                {t('meeting_status.back_to_search')}
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────────
  return (
    <FeedbackForm
      meetingId={meetingId!}
      onSuccess={() => navigate(`/meeting/${meetingId}/feedback/thank-you`)}
      onBack={handleBack}
    />
  );
};
