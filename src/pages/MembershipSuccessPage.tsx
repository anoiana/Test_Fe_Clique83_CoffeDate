import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Crown, ArrowRight, HeartHandshake, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../shared/components/PageTransition';
import { Button } from '../shared/components/Button';
import { useAuthContext } from '../shared/context/AuthContext';
import { paymentApi } from '../features/payment/api/paymentApi';
import { LoadingOverlay } from '../shared/components/LoadingOverlay';

/**
 * ConfettiParticle Component: Celebratory explosion logic.
 */
const ConfettiParticle = ({ color, index }: { color: string; index: number }) => {
  const angle = (index / 40) * Math.PI * 2;
  const velocity = Math.random() * 300 + 150;
  const xEnd = Math.cos(angle) * velocity;
  const yEnd = Math.sin(angle) * velocity;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{ 
        x: xEnd, 
        y: yEnd, 
        opacity: 0,
        scale: [0, 1.2, 0.4],
        rotate: Math.random() * 360
      }}
      transition={{ 
        duration: Math.random() * 1.5 + 1, 
        ease: [0.1, 0.9, 0.2, 1],
        delay: Math.random() * 0.1
      }}
      className="absolute w-1.5 h-1.5 rounded-sm"
      style={{ backgroundColor: color }}
    />
  );
};

export const MembershipSuccessPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, updateUser } = useAuthContext();
    const [isVerifying, setIsVerifying] = useState(true);
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [showExplosion, setShowExplosion] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const orderCode = params.get('orderCode');
                const status = params.get('status');
                const code = params.get('code');

                if (orderCode && (status === 'PAID' || code === '00')) {
                    const statusResp = await paymentApi.checkPayOSStatus(orderCode);
                    if (statusResp.status === 'PAID' || statusResp.status === 'COMPLETED') {
                        updateUser({ isMember: true });
                        setIsVerifying(false);
                        setTimeout(() => setShowExplosion(true), 500);
                        return;
                    }
                }

                updateUser({ isMember: true });
                setIsVerifying(false);
                setTimeout(() => setShowExplosion(true), 500);
            } catch (err: unknown) {
                console.error('Payment verification failed', err);
                setVerifyError((err as any).message || t('membership.verification_failed'));
                setIsVerifying(false);
            }
        };
        verifyPayment();
    }, [location.search, updateUser, t]);

    const handleContinueToMatch = () => {
        navigate('/onboarding/round3', { replace: true });
    };

    if (isVerifying) {
        return <LoadingOverlay isVisible={true} message={t('membership.syncing_vnpay')} />;
    }

    if (verifyError && !user?.isMember) {
        return (
            <PageTransition className="fixed inset-0 bg-background-paper z-[100] flex flex-col items-center justify-center p-6 text-center">
                <XCircle className="w-16 h-16 text-red-500 mb-6" />
                <h1 className="text-ink text-2xl font-black uppercase tracking-widest">{t('membership.verification_failed')}</h1>
                <p className="typo-error-desc mt-4 max-w-xs mx-auto">{verifyError}</p>
                <Button variant="glass" className="mt-8 px-10" onClick={() => navigate('/onboarding/membership-payment')}>
                    {t('membership.back_to_payment')}
                </Button>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="fixed inset-0 bg-background-paper z-[100] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
                <AnimatePresence>
                    {showExplosion && (
                        <>
                            {[...Array(30)].map((_, i) => <ConfettiParticle key={`gold-${i}`} index={i} color="var(--c-primary)" />)}
                            {[...Array(15)].map((_, i) => <ConfettiParticle key={`white-${i}`} index={i} color="#FFFFFF" />)}
                        </>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="relative z-10 max-w-md w-full flex flex-col items-center">
                <motion.div 
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.1 }}
                    className="mb-8 w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary via-primary/30 to-black border border-primary/40 flex items-center justify-center relative shadow-[0_0_50px_rgba(255,215,0,0.2)] overflow-hidden"
                >
                    <Crown className="w-12 h-12 text-black/80 relative z-10" />
                    <motion.div animate={{ x: ['-200%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10"
                >
                    <HeartHandshake className="w-3 h-3 text-primary" />
                    <span className="text-primary typo-caption-wide">{t('membership.verified_member')}</span>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full px-4"
                >
                    <Button
                        variant="golden"
                        onClick={handleContinueToMatch}
                        className="w-full h-14 text-[15px] group rounded-2xl font-black uppercase tracking-[0.15em] shadow-lg whitespace-nowrap overflow-hidden"
                    >
                        {t('membership.continue_profile_completion')}
                        <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </motion.div>
            </div>
        </PageTransition>
    );
};
