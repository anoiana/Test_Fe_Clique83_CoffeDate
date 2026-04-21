import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Smartphone, Sparkles, Clock, AlertCircle, RefreshCw, ExternalLink, X } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { PageTransition } from '../shared/components/PageTransition';
import { useAuthContext } from '../shared/context/AuthContext';
import { MEMBERSHIP_BENEFITS } from '../features/payment/data/paymentConstants';
import { paymentApi, PayOSInfoResponse } from '../features/payment/api/paymentApi';
import { useAsyncAction } from '../shared/hooks/useAsyncAction';
import { useError } from '../shared/context/ErrorContext';
import { useLoading } from '../shared/context/LoadingContext';

type PaymentStatus = 'IDLE' | 'PENDING' | 'SUCCESS' | 'EXPIRED' | 'CANCELLED' | 'ADMIN_PENDING' | 'ADMIN_REJECTED';

/**
 * MembershipPaymentPage — PayOS Premium QR Experience
 * Restored and fixed with proper polling and countdown management.
 */
export const MembershipPaymentPage = () => {
    const { t } = useTranslation();
    const { execute } = useAsyncAction();
    const { showLoader, hideLoader } = useLoading();
    const { showError } = useError();
    const navigate = useNavigate();
    const { user, updateUser, refreshUser } = useAuthContext();
    
    // States
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(() => {
        if (user?.adminStatus === 'PENDING_REVIEW') return 'ADMIN_PENDING';
        if (user?.adminStatus === 'REJECTED') return 'ADMIN_REJECTED';
        return 'IDLE';
    });
    const [payosData, setPayosData] = useState<PayOSInfoResponse | null>(null);
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
    
    // Refs for intervals
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);
    const countdownInterval = useRef<NodeJS.Timeout | null>(null);

    const stopPolling = () => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
        }
    };

    const stopCountdown = () => {
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
            countdownInterval.current = null;
        }
    };

    useEffect(() => {
        const checkStatus = async () => {
          showLoader(t('membership.processing'));
          try {
            const freshUser = await refreshUser();
            
            // Priority 1: Admin status check (must be handled before membership redirect)
            if (freshUser?.adminStatus === 'PENDING_REVIEW') {
                setPaymentStatus('ADMIN_PENDING');
                hideLoader();
                return;
            } else if (freshUser?.adminStatus === 'REJECTED') {
                setPaymentStatus('ADMIN_REJECTED');
                hideLoader();
                return;
            }

            // Priority 2: Membership check
            if (freshUser?.isMember) {
                navigate('/onboarding/membership-success', { replace: true });
                hideLoader();
                return;
            }
          } catch (err) {
            // Fallback: check cached user state
            const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');

            if (cachedUser?.adminStatus === 'PENDING_REVIEW') {
                setPaymentStatus('ADMIN_PENDING');
                hideLoader();
                return;
            } else if (cachedUser?.adminStatus === 'REJECTED') {
                setPaymentStatus('ADMIN_REJECTED');
                hideLoader();
                return;
            }

            if (cachedUser?.isMember) {
                navigate('/onboarding/membership-success', { replace: true });
                hideLoader();
                return;
            }
          } finally {
            hideLoader();
          }
        };

        checkStatus();

        return () => {
            stopPolling();
            stopCountdown();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startCountdown = () => {
        stopCountdown();
        setTimeLeft(900);
        countdownInterval.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    stopCountdown();
                    stopPolling();
                    setPaymentStatus('EXPIRED');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const startPolling = (orderCode: string) => {
        stopPolling();
        pollingInterval.current = setInterval(async () => {
            try {
                const response = await paymentApi.checkPayOSStatus(orderCode);
                // Check for multiple success statuses
                const isPaid = response.status === 'PAID' || 
                               response.status === 'COMPLETED' || 
                               response.status === 'SUCCESS';
                               
                if (isPaid) {
                    stopPolling();
                    stopCountdown();
                    setPaymentStatus('SUCCESS');
                    updateUser({ isMember: true, isInMatchingPool: true });
                    
                    // Auto redirect after success view is shown
                    setTimeout(() => {
                        navigate('/onboarding/membership-success', { replace: true });
                    }, 2000);
                } else if (response.status === 'CANCELLED' || response.status === 'FAILED') {
                    stopPolling();
                    stopCountdown();
                    setPaymentStatus('CANCELLED');
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 3000);
    };

    const handleMockSuccess = async () => {
        setIsProcessing(true);
        try {
            // Update local state and mock successful verification
            updateUser({ 
                isMember: true,
                isInMatchingPool: true 
            });
            setPaymentStatus('SUCCESS');
            stopPolling();
            stopCountdown();
            
            // Redirect after a short delay
            setTimeout(() => {
                navigate('/onboarding/membership-success', { replace: true });
            }, 1500);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirm = async () => {
        const userId = user?.id || user?.userId;

        if (!userId) {
            showError(t('membership.session_expired'));
            return;
        }

        setIsProcessing(true);
        try {
            const response = await paymentApi.createMatchingFeePayment(userId, {});

            if (response?.success && (response?.qrCode || response?.paymentUrl)) {
                setPayosData(response);
                setPaymentStatus('PENDING');
                if (response.txnRef) startPolling(response.txnRef);
                startCountdown();
            } else {
                // If backend returned success: false or missing link, show the backend message
                showError(response?.message || t('membership.errors.create_failed'));
            }
        } catch (err: unknown) {
            console.error('PAYMENT ERROR:', err);
            const errorMsg = (err as Error).message || "";
            if (errorMsg.includes('Already a member')) {
                updateUser({ isMember: true });
                navigate('/onboarding/membership-success', { replace: true });
                return;
            }
            showError(errorMsg || t('membership.errors.processing_error'));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSuccessRedirect = () => {
        navigate('/onboarding/membership-success', { replace: true });
    };

    const handleRetry = () => {
        setPaymentStatus('IDLE');
        setPayosData(null);
        stopPolling();
        stopCountdown();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <PageTransition className="bg-background-paper flex flex-col min-h-screen">
            <div className="flex flex-col flex-1 p-6 pt-16 pb-12 font-sans relative overflow-x-hidden max-w-md mx-auto w-full">
                
                <AnimatePresence mode="wait">
                    {paymentStatus === 'IDLE' && (
                        <motion.div 
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col flex-1"
                        >
                            <div className="mb-10 text-center">
                                <h1 className="text-4xl font-extrabold tracking-tight text-ink leading-[1.1] mb-3">
                                    <Trans i18nKey="membership.become_member">
                                        Join <span className="text-primary italic">Clique Community</span>
                                    </Trans>
                                </h1>
                                <p className="typo-desc">{t('membership.no_recurring')}</p>
                            </div>

                            <div className="mb-10">
                                <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-white/5 border border-primary/30 shadow-[0_20px_50px_-15px_rgba(255,215,0,0.15)] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Sparkles className="w-20 h-20 text-primary" />
                                    </div>
                                    
                                    <div className="flex flex-col relative z-10">
                                        <span className="text-5xl font-black text-ink leading-tight">{t('membership.price', '2.000.000đ')}</span>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-divider space-y-3 relative z-10">
                                        {MEMBERSHIP_BENEFITS.slice(0, 4).map((benefit, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                    <Check className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                                <span className="typo-benefit">{t(benefit.titleKey)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-10">
                                <div className="bg-background-warm border border-divider rounded-[2rem] p-5 flex items-center gap-4 shadow-xl">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-ink font-bold text-base tracking-tight leading-none mb-1">
                                            PayOS
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-black stroke-[3px]" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto w-full flex flex-col items-center gap-6">
                                <div className="w-full relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleConfirm}
                                        disabled={isProcessing}
                                        className="btn-cta-primary relative z-10 flex items-center justify-center gap-2 group"
                                    >
                                        {isProcessing ? t('membership.processing') : (
                                            <>
                                                {t('membership.confirm_membership')}
                                                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-all duration-500" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {paymentStatus === 'PENDING' && payosData && (
                        <motion.div 
                            key="pending"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex flex-col items-center justify-center flex-1 text-center"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-ink mb-2">{t('membership.scan_to_pay')}</h2>
                                <div className="flex items-center justify-center gap-2 text-primary font-bold">
                                    <Clock className="w-5 h-5 animate-pulse" />
                                    <span className="text-lg tabular-nums">{formatTime(timeLeft)}</span>
                                </div>
                            </div>

                            <div className="relative mb-8 group">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all" />
                                <div className="relative p-6 bg-white rounded-3xl shadow-2xl transition-transform hover:scale-[1.02]">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payosData.qrCode)}`}
                                        alt="Payment QR Code" 
                                        className="w-64 h-64 md:w-80 md:h-80 object-contain"
                                    />
                                    <div className="absolute inset-0 border-[10px] border-black/5 rounded-3xl" />
                                </div>
                            </div>

                            <div className="space-y-4 w-full">
                                <div className="flex flex-col gap-1 items-center">
                                    <p className="text-ink font-bold text-xl">{(payosData.amount || 2000000).toLocaleString()} VND</p>
                                    <p className="text-ink/90 text-xs font-black uppercase tracking-[0.2em]">{t('membership.waiting_payment')}</p>
                                </div>

                                <div className="bg-background-warm border border-divider rounded-2xl p-4 flex items-center justify-between gap-4">
                                    <div className="text-left">
                                        <p className="text-ink/90 text-xs font-bold uppercase tracking-wider mb-1">{t('membership.order_code')}</p>
                                        <p className="text-ink font-mono font-medium tracking-tight">#{payosData.txnRef}</p>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.open(payosData.paymentUrl, '_blank')}
                                        className="flex items-center gap-2 px-4 py-2 bg-ink/5 hover:bg-white/20 rounded-xl text-ink text-xs font-bold transition-colors"
                                    >
                                        {t('membership.open_payos')} <ExternalLink className="w-3.5 h-3.5" />
                                    </motion.button>
                                </div>

                                <button 
                                    onClick={handleRetry}
                                    className="text-ink/40 hover:text-ink/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto pt-4 transition-colors"
                                >
                                    <X className="w-4 h-4" /> {t('membership.cancel_transaction')}
                                </button>

                                <button 
                                    onClick={handleMockSuccess}
                                    className="text-primary/40 hover:text-primary/60 text-[9px] font-black uppercase tracking-[0.2em] mt-8 pt-4 border-t border-divider w-full transition-colors"
                                >
                                    [ Simulation Mode: Confirm Success ]
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {paymentStatus === 'SUCCESS' && (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center flex-1 text-center py-10"
                        >
                            <div className="relative mb-10">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.5)]"
                                >
                                    <Check className="w-16 h-16 text-black stroke-[4px]" />
                                </motion.div>
                                <div className="absolute -top-4 -right-4">
                                    <Sparkles className="w-12 h-12 text-primary animate-bounce" />
                                </div>
                            </div>

                            <h2 className="text-4xl font-black text-ink mb-4 italic uppercase tracking-tight">{t('membership.payment_successful')}</h2>
                            <p className="text-ink/60 text-lg font-medium max-w-[280px] leading-relaxed mb-12">
                                {t('membership.welcome_msg')}
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSuccessRedirect}
                                className="btn-cta-secondary"
                            >
                                {t('membership.redirecting_success')}
                            </motion.button>
                        </motion.div>
                    )}

                    {(paymentStatus === 'EXPIRED' || paymentStatus === 'CANCELLED') && (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center flex-1 text-center"
                        >
                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30 mb-8">
                                <AlertCircle className="w-12 h-12 text-red-500" />
                            </div>

                            <h2 className="text-3xl font-black text-ink mb-4 uppercase">
                                {paymentStatus === 'EXPIRED' ? t('membership.link_expired') : t('membership.payment_failed')}
                            </h2>
                            
                            <p className="text-ink/40 font-medium mb-10 max-w-[250px]">
                                {t('membership.error_retry_msg')}
                            </p>

                            <button
                                onClick={handleRetry}
                                className="btn-cta-ghost flex items-center gap-3"
                            >
                                <RefreshCw className="w-4 h-4" /> {t('membership.retry')}
                            </button>
                        </motion.div>
                    )}

                    {paymentStatus === 'ADMIN_PENDING' && (
                        <motion.div 
                            key="admin-pending"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center flex-1 text-center py-10"
                        >
                            <div className="relative mb-10">
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-32 h-32 bg-background-warm rounded-[2.5rem] flex items-center justify-center border border-divider shadow-xl"
                                >
                                    <Clock className="w-16 h-16 text-primary/40 animate-pulse" />
                                </motion.div>
                                <div className="absolute -top-4 -right-4">
                                    <Sparkles className="w-12 h-12 text-primary/40 opacity-50" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-extrabold text-ink mb-4 leading-tight">
                                {t('membership.admin_review.title')}
                            </h2>
                            <p className="text-ink/60 text-base font-medium max-w-[300px] leading-relaxed mb-12">
                                {t('membership.admin_review.description')}
                            </p>

                            <div className="w-full space-y-4">
                                <div className="px-6 py-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center gap-3 text-primary font-bold text-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                    {t('membership.admin_review.status')}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {paymentStatus === 'ADMIN_REJECTED' && (
                        <motion.div 
                            key="admin-rejected"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center flex-1 text-center py-10"
                        >
                            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-8">
                                <X className="w-12 h-12 text-red-500" />
                            </div>

                            <h2 className="text-3xl font-extrabold text-ink mb-4 leading-tight">
                                {t('membership.admin_rejected.title')}
                            </h2>
                            <p className="text-ink/60 text-base font-medium max-w-[300px] leading-relaxed mb-12">
                                {t('membership.admin_rejected.description', { reason: user?.adminRejectionReason || t('common.no_reason_provided') })}
                            </p>

                            <div className="w-full space-y-4">
                                <div className="px-6 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-center gap-3 text-red-500 font-bold text-sm">
                                    {t('membership.admin_rejected.status')}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </PageTransition>
    );
};
