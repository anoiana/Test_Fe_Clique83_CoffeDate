import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, CalendarDays, User } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { PageTransition } from '../shared/components/PageTransition';
import { Button } from '../shared/components/Button';
import { GoldenParticlesBackground } from '../shared/components/GoldenParticlesBackground';
import { useAuthContext } from '../shared/context/AuthContext';
import { matchApi } from '../features/match/api/matchApi';
import { matchingApi } from '../features/matching/api/matchingApi';
import { MutualMatchState, PhotoItem, SuggestionItem } from '../shared/types/index';

/**
 * MutualMatchCongratsPage
 * Celebratory screen when both users have accepted each other.
 * Step before the date reservation fee (payment 2).
 */
export const MutualMatchCongratsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, refreshUser } = useAuthContext();
    const [meetingData, setMeetingData] = useState<unknown>(null);
    const state = (location.state as MutualMatchState) || {};
    const [matchName, setMatchName] = useState(state.matchName || '');
    const [matchAvatar, setMatchAvatar] = useState(state.matchAvatar || '');
    const [userAvatar, setUserAvatar] = useState(user?.avatarUrl || '');
    const meetingId = state.meetingId;
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Refresh the current user profile once to get the latest avatarUrl
        refreshUser().then(freshUser => {
            if (freshUser?.avatarUrl) setUserAvatar(freshUser.avatarUrl);
        }).catch(err => console.error('Failed to refresh user profile:', err));

        // Extra check: Fetch photos to find public one
        if (!userAvatar) {
            const fetchMyPhotos = async () => {
                try {
                    const photos = await matchingApi.getMyPhotos();
                    const photoArray = Array.isArray(photos) ? photos : (photos?.data as PhotoItem[] || []);
                    const publicPhoto = photoArray.find((p: PhotoItem) => p.isPublic);
                    if (publicPhoto) {
                        setUserAvatar(publicPhoto.url);
                    }
                } catch (err) {
                    console.error('Failed to fetch user photos:', err);
                }
            };
            fetchMyPhotos();
        }
    }, []); // Only once on mount

    useEffect(() => {
        // Short delay to let the background settle
        const timer = setTimeout(() => setShowContent(true), 400);
        
        // Fallback: If name or avatar missing (e.g. on F5), fetch from API
        if (!matchName || !matchAvatar) {
            const fetchMatchDetail = async () => {
                try {
                    const suggestions = await matchApi.getLatestSuggestion();
                    // Find the mutual accept suggestion (there should be only one active)
                    const activeSuggestion = suggestions.find((s: SuggestionItem) => s.status === 'mutual_accept' || s.status === 'accepted');
                    if (activeSuggestion && activeSuggestion.reveal?.hero) {
                        setMatchName(activeSuggestion.reveal.hero.firstName || activeSuggestion.reveal.hero.fullName || '');
                        setMatchAvatar(activeSuggestion.reveal.hero.profilePicUrl || activeSuggestion.reveal.hero.avatarUrl || '');
                    }
                } catch (err) {
                    console.error('Failed to recover match data:', err);
                }
            };
            fetchMatchDetail();
        }

        return () => clearTimeout(timer);
    }, [meetingId, matchName, matchAvatar, user]);

    const handleContinue = () => {
        navigate('/date-payment', { state: { meetingId }, replace: true });
    };

    if (!meetingId) {
        // Fail-safe if no state passed
        navigate('/match');
        return null;
    }

    return (
        <PageTransition className="fixed inset-0 bg-background-paper z-[100] flex flex-col items-center justify-center p-6 text-center overflow-hidden font-sans">
            {/* Celebration Background */}
            <GoldenParticlesBackground particleCount={30} glowSize={600} glowIntensity="strong" />
            
            <AnimatePresence>
                {showContent && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 max-w-sm w-full flex flex-col items-center"
                    >
                        {/* Iconic Celebration with Dual Avatars */}
                        <div className="relative mb-16 flex items-center justify-center">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150"
                            />
                            
                            <div className="flex items-center gap-[-20px] relative">
                                {/* User 1 Avatar */}
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 10, opacity: 1 }}
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] overflow-hidden border-2 border-primary/30 z-10 bg-primary/10 flex items-center justify-center relative shadow-2xl"
                                >
                                    {userAvatar ? (
                                        <img src={userAvatar} alt="You" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="p-4"><User className="w-12 h-12 text-primary/40" /></div>
                                    )}
                                </motion.div>

                                {/* Central Heart Circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                    className="w-16 h-16 rounded-full bg-primary flex items-center justify-center backdrop-blur-3xl z-30 border-4 border-background-dark shadow-xl -mx-4"
                                >
                                    <Heart className="w-8 h-8 text-background-dark fill-background-dark animate-pulse" />
                                </motion.div>

                                {/* User 2 (Match) Avatar */}
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: -10, opacity: 1 }}
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] overflow-hidden border-2 border-divider z-10 bg-background-warm flex items-center justify-center relative shadow-2xl"
                                >
                                    {matchAvatar ? (
                                        <img src={matchAvatar} alt="Match" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="p-4"><User className="w-12 h-12 text-ink/20" /></div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Floating Sparkles Decoration */}
                            <motion.div 
                                className="absolute -top-6 -right-6 z-40"
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 15, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="w-10 h-10 text-ink fill-white shadow-glow" />
                            </motion.div>
                        </div>

                        {/* Text Message */}
                        <div className="mb-20 px-4">
                            <div className="space-y-6 mb-10">
                                <span className="typo-caption-supreme text-primary/60">
                                    {t('match_mutual.status')}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-extralight tracking-tight uppercase leading-tight italic text-ink">
                                    <Trans i18nKey="match_mutual.title">
                                        IT'S <span className="text-primary font-bold">A DATE!</span>
                                    </Trans>
                                </h1>
                            </div>
                            
                            <p className="typo-desc-page leading-relaxed max-w-[280px] mx-auto">
                                <Trans i18nKey="match_mutual.subtitle" values={{ name: matchName || t('common.someone') }}>
                                    Bạn và <span className="text-ink font-medium">{matchName || t('common.someone')}</span> đạt được sự tương hợp. Trải nghiệm tuyệt vời đang chờ đón hai bạn.
                                </Trans>
                            </p>
                        </div>

                        {/* CTA - Continue to Payment */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="w-full space-y-6 mt-4"
                        >
                            <Button
                                variant="golden"
                                onClick={handleContinue}
                                className="w-full h-18 text-base rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 group px-4"
                            >
                                {t('match_mutual.action')}
                                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                            
                            <div className="flex items-center justify-center gap-2 typo-footnote text-ink/40">
                                <CalendarDays className="w-3 h-3" />
                                <span>{t('match_mutual.footer')}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle Overlay Decoration */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-divider m-4 rounded-[40px] z-0" />
        </PageTransition>
    );
};
