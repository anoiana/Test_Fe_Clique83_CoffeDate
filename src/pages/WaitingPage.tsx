import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, RefreshCw, MessageSquare, BellRing, Hourglass, UserCheck, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../shared/components/BackButton';
import { PageTransition } from '../shared/components/PageTransition';
import { meetingApi, Meeting } from '../features/match/api/meetingApi';
import { useAuthContext } from '../shared/context/AuthContext';
import { authApi } from '../features/authentication/api/authApi';
import { IntakeReview } from '../features/onboarding/components/Intake/IntakeReview';
import { useNotification } from '../shared/context/NotificationContext';

/**
 * WaitingPage — Awaiting Match Response
 * Displays a cinematic waiting state while the matched user selects their availability.
 */
export const WaitingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, updateUser } = useAuthContext();
    const { showSuccess, showError } = useNotification();
    const meetingId = location.state?.meetingId;
    
    const [showReview, setShowReview] = useState(false);
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [isUpdatingPool, setIsUpdatingPool] = useState(false);

    useEffect(() => {
        // Find specifically the meeting we are interested in
        const fetchMeeting = async () => {
            if (!meetingId) return;
            try {
                const meetings = await meetingApi.getMyMeetings();
                const current = meetings.find(m => m.id === meetingId);
                if (current) setMeeting(current);
            } catch (err) {
                console.error('Failed to fetch meeting in WaitingPage:', err);
            }
        };
        fetchMeeting();
    }, [meetingId]);

    const handleToggleMatchingPool = async () => {
        const userId = user?.id || user?.userId;
        if (!userId || isUpdatingPool) return;

        const newStatus = !user?.isInMatchingPool;
        setIsUpdatingPool(true);

        try {
            await authApi.updateProfile(userId, { isInMatchingPool: newStatus });
            updateUser({ isInMatchingPool: newStatus });
            showSuccess(newStatus ? t('settings.matching_service.pool_active') : t('settings.matching_service.pool_inactive'));
        } catch (err: unknown) {
            console.error('Failed to update matching pool status:', err);
            showError(err instanceof Error ? err.message : t('settings.matching_service.update_error'));
        } finally {
            setIsUpdatingPool(false);
        }
    };

    // Placeholder name if we don't have the full match object here 
    const matchName = t('common.match_fallback'); 
    const profilePicUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'; // Default placeholder

    return (
        <PageTransition className="bg-background-paper flex flex-col min-h-screen">
            <AnimatePresence>
                {showReview && (
                    <IntakeReview 
                        onClose={() => setShowReview(false)} 
                        onEdit={() => navigate('/onboarding')} 
                        ctaLabel={t('intake.review.looks_good')} 
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-col flex-1 p-6 pb-12 font-sans relative overflow-x-hidden max-w-lg mx-auto w-full">

                {/* Standardized Header Controls */}
                <div className="fixed top-0 left-0 w-full z-[120] pointer-events-none">
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3 pointer-events-auto">
                        <BackButton onClick={() => navigate('/meeting-status')} className="shadow-lg !bg-background-warm text-primary border-divider" />
                    </div>

                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 pointer-events-auto">
                        <button
                            onClick={() => setShowReview(true)}
                            className="size-8 sm:size-10 rounded-full bg-background-warm flex items-center justify-center border border-divider shadow-lg text-primary transition-all active:scale-95"
                        >
                            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="size-8 sm:size-10 rounded-full bg-background-warm flex items-center justify-center border border-divider shadow-lg text-primary transition-all active:scale-95"
                        >
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                <header className="flex flex-col items-center mb-8 mt-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Hourglass className="w-3 h-3 text-primary animate-spin-slow" />
                        <h1 className="typo-caption-wide text-primary">{t('waiting.awaiting_response')}</h1>
                        <Hourglass className="w-3 h-3 text-primary animate-spin-slow" />
                    </div>
                    <div className="h-1 w-8 bg-primary rounded-full" />
                </header>

                {/* Title Section */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl font-black text-ink tracking-tight mb-2">{t('waiting.great_choice')}</h2>
                    <p className="typo-desc">{t('waiting.waiting_for_match', { name: matchName })}</p>
                </Motion.div>

                {/* Avatars Section with Waiting Animation */}
                <div className="flex justify-center items-center mb-12 relative">
                    <div className="relative flex items-center justify-center">
                        <Motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-48 h-48 rounded-full border border-primary/30"
                        />
                        <Motion.div
                            animate={{ scale: [1.2, 1.8, 1.2], opacity: [0.05, 0.15, 0.05] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute w-48 h-48 rounded-full border border-primary/20"
                        />

                        <div className="relative flex -space-x-6 items-center">
                            <Motion.div
                                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ type: "spring", damping: 15 }}
                                className="w-24 h-24 rounded-[2.5rem] border-4 border-background-dark overflow-hidden relative shadow-2xl z-10"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
                                    alt="Your Avatar"
                                    className="w-full h-full object-cover grayscale-[0.5]"
                                />
                                <div className="absolute inset-0 bg-primary/10" />
                            </Motion.div>

                            <Motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="w-12 h-12 rounded-full bg-background-paper border border-divider flex items-center justify-center z-20 shadow-2xl"
                            >
                                <Motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                >
                                    <RefreshCw className="w-5 h-5 text-primary" />
                                </Motion.div>
                            </Motion.div>

                            <Motion.div
                                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ type: "spring", damping: 15, delay: 0.2 }}
                                className="w-24 h-24 rounded-[2.5rem] border-4 border-background-dark overflow-hidden relative shadow-2xl z-10"
                            >
                                <img
                                    src={profilePicUrl}
                                    alt={matchName}
                                    className="w-full h-full object-cover blur-[2px] opacity-40 grayscale"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                                    <Clock className="w-8 h-8 text-ink/20 animate-pulse" />
                                </div>
                            </Motion.div>
                        </div>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="flex flex-col gap-4 mb-10">
                    <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 rounded-[2.5rem] bg-background-warm/60 border border-divider backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-5 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="typo-footnote text-ink/20 mb-1">{t('waiting.status')}</span>
                                <span className="text-ink text-base font-black font-sans tracking-tight">{t('waiting.syncing')}</span>
                            </div>
                        </div>
                        <p className="typo-desc-xs leading-relaxed px-1">
                            {t('waiting.overlap_notif', { name: matchName })}
                        </p>
                    </Motion.div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <Motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="p-5 rounded-[2rem] bg-background-warm/60 border border-divider hover:bg-background-warm/80 transition-all flex flex-col items-center gap-3 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-background-warm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BellRing className="w-5 h-5 text-ink/40 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="typo-footnote text-ink/40 group-hover:text-ink transition-colors">{t('waiting.notify_her')}</span>
                        </Motion.button>
                        <Motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="p-5 rounded-[2rem] bg-background-warm/60 border border-divider hover:bg-background-warm/80 transition-all flex flex-col items-center gap-3 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-background-warm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-5 h-5 text-ink/40 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="typo-footnote text-ink/40 group-hover:text-ink transition-colors">{t('waiting.send_note')}</span>
                        </Motion.button>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-auto px-4 w-full flex flex-col items-center gap-6">
                    <p className="text-center typo-footnote text-ink/30 leading-relaxed max-w-[280px]">
                        {t('waiting.timing_desc')}
                    </p>

                    <Motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/date-set')}
                        className="btn-cta-secondary flex items-center justify-center gap-3 font-sans"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>{t('waiting.refresh_status')}</span>
                    </Motion.button>

                    <div className="flex items-center gap-2 opacity-30">
                        <div className="h-px w-8 bg-white" />
                        <span className="typo-footnote">{t('waiting.clique_experience')}</span>
                        <div className="h-px w-8 bg-white" />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};
