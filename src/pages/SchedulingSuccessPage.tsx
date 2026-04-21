import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, CheckCircle2, Calendar, ArrowRight, Coffee } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { PageTransition } from '../shared/components/PageTransition';
import { Button } from '../shared/components/Button';
import { GoldenParticlesBackground } from '../shared/components/GoldenParticlesBackground';
import { meetingApi, Meeting } from '../features/match/api/meetingApi';

/**
 * SchedulingSuccessPage
 * Cinematic confirmation after the user submits their availability.
 * Guides them to wait for the counterpart.
 */
export const SchedulingSuccessPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { meetingId, type } = (location.state as { meetingId?: string, type?: 'scheduling' | 'location' }) || {};
    const [showContent, setShowContent] = useState(false);
    const [meeting, setMeeting] = useState<Meeting | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            if (!meetingId) {
                setShowContent(true);
                return;
            }

            try {
                const meetings = await meetingApi.getMyMeetings();
                const found = meetings.find(m => m.id === meetingId);
                setMeeting(found || null);
                
                if (!found) {
                    setShowContent(true);
                    return;
                }

                // If fully confirmed, just go back to status list
                if (found.status === 'confirmed' || found.status === 'completed') {
                    navigate('/meeting-status', { replace: true });
                    return;
                }

                // If both have schedules but we are in scheduling mode, proceed to location selection
                if (type === 'scheduling' && found.userAAvailability && found.userBAvailability) {
                    navigate('/select-location', { state: { meetingId }, replace: true });
                    return;
                }
                
                // Otherwise, show the wait screen for the partner
                setShowContent(true);
            } catch (err) {
                console.error('Failed to check meeting status:', err);
                setShowContent(true);
            }
        };

        checkStatus();
    }, [meetingId, type, navigate]);

    const handleProceed = () => {
        navigate('/meeting-status', { replace: true });
    };

    const isLocation = type === 'location';

    return (
        <PageTransition className="fixed inset-0 bg-background-paper z-[100] flex flex-col items-center justify-center p-6 text-center overflow-hidden font-sans">
            <GoldenParticlesBackground particleCount={25} glowSize={600} glowIntensity="soft" />
            
            <AnimatePresence>
                {showContent && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 max-w-sm w-full flex flex-col items-center"
                    >
                        {/* Status Icon */}
                        <div className="relative mb-16 flex items-center justify-center">
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150"
                            />
                            
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center backdrop-blur-3xl relative"
                            >
                                {isLocation ? <Coffee className="w-10 h-10 text-primary" /> : <Calendar className="w-10 h-10 text-primary" />}
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-background-dark"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-black" />
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Message */}
                        <div className="mb-16 px-4">
                            <div className="space-y-4 mb-10">
                                <span className="typo-caption-supreme text-primary/60">
                                    {isLocation ? t('scheduling_success.location.status') : t('scheduling_success.status')}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none italic text-ink">
                                    {isLocation ? (
                                        <Trans i18nKey="scheduling_success.location.title">
                                            VENUE <span className="text-primary">SENT!</span>
                                        </Trans>
                                    ) : (
                                        <Trans i18nKey="scheduling_success.title">
                                            SENT <span className="text-primary">SUCCESSFULLY!</span>
                                        </Trans>
                                    )}
                                </h1>
                            </div>
                            
                            <p className="typo-desc-page leading-relaxed max-w-[320px] mx-auto text-balance">
                                {isLocation ? (
                                    <Trans i18nKey="scheduling_success.location.subtitle">
                                        Your selections have been recorded. System is waiting for <span className="text-ink font-medium">your match</span> to update their favorites.
                                    </Trans>
                                ) : (
                                    <Trans i18nKey="scheduling_success.subtitle">
                                        Great! You have finished scheduling. Now please be patient and wait for <span className="text-ink font-medium">your match</span> to update their availability.
                                    </Trans>
                                )}
                            </p>
                        </div>

                        {/* Action */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="w-full space-y-6"
                        >
                            <Button
                                variant="golden"
                                onClick={handleProceed}
                                className="w-full h-18 text-base rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 group px-4"
                            >
                                {t('scheduling_success.action')}
                                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                            
                            <div className="flex items-center justify-center gap-3 typo-caption text-ink/40">
                                <Clock className="w-4 h-4 text-primary/60 animate-pulse" />
                                <span>{isLocation ? t('scheduling_success.location.footer') : t('scheduling_success.footer')}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decorative background number/text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-ink/[0.02] pointer-events-none select-none z-0">
                {isLocation ? t('scheduling_success.location.background_text') : t('scheduling_success.background_text')}
            </div>
        </PageTransition>
    );
};
