import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, ShieldCheck, Heart, ArrowRight, Zap, Gem } from 'lucide-react';
import { PageTransition } from '../shared/components/PageTransition';
import { useAuthContext } from '../shared/context/AuthContext';
import { useAsyncAction } from '../shared/hooks/useAsyncAction';
import { authApi } from '../features/authentication/api/authApi';
import { Button } from '../shared/components/Button';

/**
 * ReviewJourneyPage — The 4-step flow after Photo Upload.
 * 1. Success R2 + How it works
 * 2. Pending Approval
 * 3. Approved Success
 * 4. Pricing & Logistics
 */
export const ReviewJourneyPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, updateUser, refreshUser } = useAuthContext();
    const { execute } = useAsyncAction();

    // Internal flow state (1-4)
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync step with user status on mount
    useEffect(() => {
        if (!user) return;

        // Only auto-advance to Step 3 if already approved.
        // We allow Step 1 to be shown even if status is PENDING_REVIEW 
        // so the user sees the "Congratulations" message first.
        if (user.adminStatus === 'APPROVED') {
            setStep(prev => prev < 3 ? 3 : prev);
        }
    }, [user?.adminStatus]);

    const handleStartReview = async () => {
        const userId = user?.id || user?.userId;
        if (!userId) return;

        setIsSubmitting(true);
        try {
            // Submit profile for review
            await execute(() => authApi.updateProfile(userId, { adminStatus: 'PENDING_REVIEW' }));
            updateUser({ adminStatus: 'PENDING_REVIEW' });
            setStep(2);
        } catch (err) {
            console.error('Failed to submit for review:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReady = () => setStep(4);
    const handleContinue = () => navigate('/onboarding/round3');

    // Rendering Logic
    return (
        <PageTransition className="bg-background-paper min-h-[100dvh] flex flex-col relative">
            {/* Background Texture & Decor */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/paper-texture.png')] mix-blend-multiply" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

            <div className="flex-1 flex flex-col items-center justify-center py-4 px-6 relative z-10 max-w-lg mx-auto w-full">
                <AnimatePresence mode="wait">
                    {step === 1 && <Step1Intro key="step1" onNext={handleStartReview} isLoading={isSubmitting} />}
                    {step === 2 && <Step2Pending key="step2" onRefresh={refreshUser} />}
                    {step === 3 && <Step3Approved key="step3" onNext={handleReady} />}
                    {step === 4 && <Step4Pricing key="step4" onNext={handleContinue} />}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

// --- Sub-components ---

const Step1Intro = ({ onNext, isLoading }: { onNext: () => void, isLoading: boolean }) => {
    const { t } = useTranslation();
    const rulesData = t('onboarding.post_upload.step1.rules', { returnObjects: true });
    const rules = Array.isArray(rulesData) ? rulesData : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col items-center text-center"
        >
            <div className="mb-4">
                <img src="/logo.png" alt="Clique83" className="w-20 h-20 object-contain" />
            </div>

            <h1 className="text-3xl font-black text-ink mb-2 leading-tight font-serif italic uppercase">
                {t('onboarding.post_upload.step1.title')}
            </h1>
            <p className="text-primary font-black text-[12px] tracking-[0.3em] uppercase mb-6">
                {t('onboarding.post_upload.step1.how_it_works')}
            </p>

            {/* Value Points List */}
            <div className="w-full space-y-3 mb-4">
                {rules.map((rule, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-background-warm rounded-3xl border border-divider text-left"
                    >
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-background-paper" strokeWidth={3} />
                        </div>
                        <span className="text-ink font-bold text-[15px] leading-tight tracking-tight">{rule}</span>
                    </motion.div>
                ))}
            </div>

            {/* Philosophy & CTA */}
            <div className="w-full mt-4">
                <p className="text-center text-ink/40 font-serif italic text-lg mb-4">
                    {t('onboarding.post_upload.step1.philosophy')}
                </p>
                <Button 
                    onClick={onNext} 
                    disabled={isLoading}
                    variant="golden"
                    className="w-full h-14 rounded-3xl"
                >
                    {isLoading ? t('common.loading') : t('onboarding.post_upload.step1.cta')}
                </Button>
            </div>
        </motion.div>
    );
};

const Step2Pending = ({ onRefresh }: { onRefresh: () => void }) => {
    const { t } = useTranslation();

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center justify-center"
        >
            {/* Vetting Card */}
            <div className="w-full bg-background-warm rounded-[2.5rem] p-8 border border-divider shadow-card relative overflow-hidden flex flex-col items-center text-center">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
                
                {/* Processing Icon */}
                <div className="relative mb-8">
                    {/* Pulsing circles */}
                    <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-primary/20 rounded-full"
                    />
                    <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute inset-0 bg-primary/10 rounded-full"
                    />
                    
                    <motion.div 
                        className="w-20 h-20 flex items-center justify-center relative z-10"
                    >
                        <img src="/logo.png" className="w-16 h-16 object-contain" alt="Logo" />
                    </motion.div>
                </div>

                <h2 className="text-2xl font-black text-ink mb-4 font-serif italic">
                    {t('onboarding.post_upload.step2.pending_title')}
                </h2>
                
                <p className="text-ink/60 text-lg leading-relaxed mb-8 px-2">
                    {t('onboarding.post_upload.step2.pending_text')}
                </p>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary font-bold text-[11px] uppercase tracking-widest border border-primary/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {t('onboarding.post_upload.step2.vetting_status')}
                </div>
            </div>

            {/* Refresh Action */}
            <div className="w-full mt-8">
                <Button 
                    onClick={() => window.location.reload()} 
                    variant="glass" 
                    className="w-full h-14 rounded-3xl border-divider hover:bg-background-warm"
                    icon="refresh"
                >
                    {t('onboarding.post_upload.step2.refresh_btn')}
                </Button>
            </div>
        </motion.div>
    );
};

const Step3Approved = ({ onNext }: { onNext: () => void }) => {
    const { t } = useTranslation();

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center justify-center"
        >
            {/* Success Card */}
            <div className="w-full bg-background-warm rounded-[2.5rem] p-8 border border-divider shadow-card relative overflow-hidden flex flex-col items-center text-center">
                {/* Celebration Sparkles */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <Sparkles className="absolute top-10 left-10 w-6 h-6 text-primary/20" />
                    <Sparkles className="absolute bottom-20 right-10 w-4 h-4 text-primary/30" />
                    <Sparkles className="absolute top-1/2 left-4 w-5 h-5 text-primary/10" />
                </motion.div>

                {/* Main Success Icon (Logo) */}
                <div className="relative mb-8">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                        className="w-24 h-24 rounded-[2.5rem] bg-background-paper flex items-center justify-center relative z-10 shadow-lg border border-divider"
                    >
                        <img src="/logo.png" alt="Clique83" className="w-16 h-16 object-contain" />
                    </motion.div>
                    {/* Glowing effect */}
                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150" />
                </div>

                <h2 className="text-3xl font-black text-ink mb-6 font-serif italic leading-tight">
                    {t('onboarding.post_upload.step3.approved_title')}
                </h2>

                {/* Social Proof Section */}
                <div className="mb-6">
                    <p className="text-ink/60 text-lg leading-relaxed max-w-[260px]">
                        {t('onboarding.post_upload.step3.social_proof')}
                    </p>
                </div>

            </div>

            {/* Action Button */}
            <div className="w-full mt-10">
                <Button 
                    onClick={onNext} 
                    variant="golden" 
                    className="w-full h-14 rounded-3xl shadow-lg shadow-primary/10"
                    icon="arrow_forward"
                >
                    {t('onboarding.post_upload.step3.cta')}
                </Button>
            </div>
        </motion.div>
    );
};

const Step4Pricing = ({ onNext }: { onNext: () => void }) => {
    const { t } = useTranslation();
    const pointsData = t('onboarding.post_upload.step4.value_prop.points', { returnObjects: true });
    const valuePoints = Array.isArray(pointsData) ? pointsData : [];

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex flex-col"
        >
            <div className="mb-6 text-center px-4">
                <img src="/logo.png" alt="Clique83" className="w-16 h-16 object-contain mx-auto mb-4" />
                <p className="text-ink text-lg leading-relaxed font-serif italic font-medium">
                    {t('onboarding.post_upload.step4.pricing_intro')}
                </p>
            </div>

            <div className="bg-background-warm rounded-[2.5rem] p-8 border border-divider mb-6 shadow-card">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Gem className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-ink uppercase tracking-tight italic font-serif">
                        {t('onboarding.post_upload.step4.pricing_details.title')}
                    </h3>
                </div>

                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <p className="text-ink font-bold leading-snug">
                            {t('onboarding.post_upload.step4.pricing_details.membership')}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <p className="text-ink font-bold leading-snug">
                            {t('onboarding.post_upload.step4.pricing_details.per_session')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-8 pl-4 border-l-2 border-primary/20">
                <h4 className="text-lg font-black text-ink mb-4 font-serif italic uppercase">
                    {t('onboarding.post_upload.step4.value_prop.title')}
                </h4>
                <div className="space-y-3">
                    {valuePoints.map((point, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-ink/60">
                            <Zap className="w-4 h-4 text-primary/40" />
                            <span className="text-sm font-medium">{point}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                onClick={onNext}
                variant="golden"
                className="w-full h-14 rounded-3xl group"
                icon="arrow_forward"
            >
                {t('onboarding.post_upload.step4.cta')}
            </Button>
        </motion.div>
    );
};
