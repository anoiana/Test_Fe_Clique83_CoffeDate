import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Smartphone, Clock, ExternalLink, X, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../shared/components/PageTransition';
import { BackButton } from '../shared/components/BackButton';
import { PAYMENT_METHODS } from '../features/payment/data/paymentConstants';
import { meetingApi, MeetingPaymentResponse } from '../features/match/api/meetingApi';
import { paymentApi } from '../features/payment/api/paymentApi';
import { useLoading } from '../shared/context/LoadingContext';
import { useNotification } from '../shared/context/NotificationContext';
import { API_CONFIG } from '../infrastructure/apiConfig';

/**
 * PaymentPage — Date Reservation Payment
 * Allows users to select a payment method and confirm their date reservation fee.
 * Now integrated with PayOS QR code and real-time polling.
 */
export const PaymentPage = () => {
    const { t } = useTranslation();
    const [selectedMethod, setSelectedMethod] = useState('payos');
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoader, hideLoader } = useLoading();
    const { showError } = useNotification();

    // Payment States
    const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED'>('IDLE');
    const [payosData, setPayosData] = useState<MeetingPaymentResponse | null>(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);
    const countdownInterval = useRef<NodeJS.Timeout | null>(null);

    const handleBack = () => {
        if (paymentStatus === 'PENDING') {
            handleRetry();
        } else {
            navigate('/meeting-status');
        }
    };

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
        return () => {
            stopPolling();
            stopCountdown();
        };
    }, []);

    const startCountdown = () => {
        stopCountdown();
        setTimeLeft(600);
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
                const isPaid = response.status === 'PAID' || 
                               response.status === 'COMPLETED' || 
                               response.status === 'SUCCESS';
                               
                if (isPaid) {
                    stopPolling();
                    stopCountdown();
                    setPaymentStatus('SUCCESS');
                    
                    // Auto redirect after success
                    setTimeout(() => {
                        navigate('/meeting-status', { replace: true });
                    }, 2500);
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

    const handleConfirm = async () => {
        const meetingId = location.state?.meetingId;
        
        if (!meetingId) {
            showError(t('payment.errors.not_ready'));
            return;
        }

        try {
            showLoader(t('common.processing', 'Processing...'));
            const response = await meetingApi.pay(meetingId);

            if (response.paymentUrl) {
                setPayosData(response);
                setPaymentStatus('PENDING');
                startCountdown();
                if (response.txnRef) {
                    startPolling(response.txnRef);
                }
            } else if (response.message === 'SUCCESS' || (response as any).success) {
                // Fallback for simple success responses
                setPaymentStatus('SUCCESS');
                setTimeout(() => navigate('/meeting-status', { replace: true }), 2000);
            } else {
                showError(response.message || t('payment.errors.submit_failed'));
            }
        } catch (err: unknown) {
            console.error('Payment failed:', err);
            showError((err as Error).message || t('payment.errors.general_error'));
        } finally {
            hideLoader();
        }
    };

    const handleRetry = () => {
        stopPolling();
        stopCountdown();
        setPaymentStatus('IDLE');
        setPayosData(null);
    };

    const handleMockSuccess = () => {
        setPaymentStatus('SUCCESS');
        setTimeout(() => navigate('/meeting-status', { replace: true }), 2000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (paymentStatus === 'SUCCESS') {
        return (
            <PageTransition className="fixed inset-0 bg-background-paper flex flex-col items-center justify-center p-6 text-center">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.3)] mb-8"
                >
                    <Check className="w-16 h-16 text-black stroke-[4px]" />
                </motion.div>
                <h2 className="text-3xl font-black text-ink mb-4 uppercase tracking-widest">{t('payment.payment_successful', 'Payment Successful')}</h2>
                <p className="text-ink/60 font-medium mb-8 italic">{t('payment.meeting_confirmed_redirecting')}</p>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="bg-background-paper flex flex-col min-h-screen">
            <div className="flex flex-col flex-1 p-6 pb-12 font-sans relative overflow-x-hidden max-w-md mx-auto w-full">
                
                <header className="mb-12 pt-4 flex items-center justify-between">
                    <BackButton onClick={handleBack} />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{t('payment.premium_service')}</span>
                        <div className="h-px w-8 bg-primary/30 mt-1" />
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {paymentStatus === 'IDLE' && (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col flex-1"
                        >
                            <div className="mb-12 text-left">
                                <h1 className="text-4xl font-extrabold tracking-tight text-ink leading-[1.1] mb-3">
                                    {t('payment.secure_your_date')}
                                </h1>
                                <p className="text-ink/40 text-sm font-medium tracking-wide">
                                    {t('payment.final_step')}
                                </p>
                            </div>

                            <div className="mb-10">
                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-divider shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                        <Check className="w-24 h-24 text-ink" />
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-ink/40 text-[10px] font-black uppercase tracking-widest">{t('payment.order_summary')}</span>
                                            <span className="text-primary text-[10px] font-black uppercase tracking-widest">Premium</span>
                                        </div>
                                        
                                        <div className="pt-2 flex justify-between items-center text-sm">
                                            <span className="text-ink/60 font-light">{t('payment.reservation_fee')}</span>
                                            <span className="text-ink font-bold tracking-tight">50.000 VNĐ</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-ink/60 font-light">{t('payment.service_coordination')}</span>
                                            <span className="text-ink font-bold tracking-tight italic">{t('payment.included')}</span>
                                        </div>

                                        <div className="h-px bg-background-warm my-2" />
                                        
                                        <div className="flex justify-between items-end">
                                            <span className="text-ink/80 text-xs font-black uppercase tracking-widest mb-1">{t('payment.total_due')}</span>
                                            <div className="text-right">
                                                <span className="text-3xl font-black text-ink tracking-tighter">50.000</span>
                                                <span className="text-primary text-xs font-black ml-1 uppercase tracking-widest">VND</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-12">
                                <h3 className="text-[10px] font-black text-ink/20 uppercase tracking-[0.3em] mb-4 ml-4">{t('membership.payment_method')}</h3>
                                <div className="flex flex-col gap-3 px-2">
                                    {PAYMENT_METHODS.map((method) => {
                                        const isSelected = selectedMethod === method.id;
                                        return (
                                            <button
                                                key={method.id}
                                                onClick={() => setSelectedMethod(method.id)}
                                                className={`group flex items-center gap-5 p-5 rounded-[2rem] border transition-all duration-500 ${isSelected
                                                    ? 'bg-primary/10 border-primary/30 shadow-[0_10px_30px_-10px_rgba(212,175,55,0.2)]'
                                                    : 'bg-white/[0.02] border-divider hover:bg-background-warm/80'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-primary text-black' : 'bg-background-warm text-ink/20 group-hover:text-ink/40'
                                                    }`}>
                                                    <method.icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className={`text-sm font-black tracking-widest uppercase mb-0.5 transition-colors ${isSelected ? 'text-ink' : 'text-ink/40 group-hover:text-ink/60'}`}>
                                                        {t(method.labelKey)}
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isSelected ? 'border-primary bg-primary' : 'border-divider'}`}>
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[4px]" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-auto px-2 w-full pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleConfirm}
                                    className="w-full py-5 rounded-[2rem] bg-primary text-black font-black uppercase tracking-[0.3em] text-[13px] shadow-2xl relative z-10 transition-all flex items-center justify-center gap-3 overflow-hidden"
                                >
                                    {t('payment.complete_reservation')}
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {paymentStatus === 'PENDING' && payosData && (
                        <motion.div 
                            key="pending"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center flex-1 text-center"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-ink mb-2">{t('membership.scan_to_pay', 'Scan to Pay')}</h2>
                                <div className="flex items-center justify-center gap-2 text-primary font-bold">
                                    <Clock className="w-5 h-5 animate-pulse" />
                                    <span className="text-lg tabular-nums">{formatTime(timeLeft)}</span>
                                </div>
                            </div>

                            <div className="relative mb-8 group">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                <div className="relative p-6 bg-white rounded-3xl shadow-2xl transition-transform hover:scale-[1.02]">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payosData.paymentUrl)}`}
                                        alt="Payment QR Code" 
                                        className="w-64 h-64 object-contain"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6 w-full">
                                <div className="flex flex-col gap-1 items-center">
                                    <p className="text-ink font-bold text-2xl">50.000 VND</p>
                                    <p className="text-ink/60 text-xs font-black uppercase tracking-[0.2em]">{t('membership.waiting_payment')}</p>
                                </div>

                                <div className="bg-background-warm border border-divider rounded-2xl p-5 flex items-center justify-between gap-4">
                                    <div className="text-left">
                                        <p className="text-ink/40 text-[10px] font-bold uppercase tracking-wider mb-1">{t('membership.order_code')}</p>
                                        <p className="text-ink font-mono font-medium tracking-tight">#{payosData.txnRef || 'N/A'}</p>
                                    </div>
                                    <button
                                        onClick={() => window.open(payosData.paymentUrl, '_blank')}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                                    >
                                        {t('membership.open_payos')} <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <button 
                                    onClick={handleRetry}
                                    className="text-ink/40 hover:text-ink/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto pt-4 transition-colors"
                                >
                                    <X className="w-4 h-4" /> {t('membership.cancel_transaction')}
                                </button>

                                {API_CONFIG.USE_MOCK && (
                                    <button 
                                        onClick={handleMockSuccess}
                                        className="text-primary/40 hover:text-primary/60 text-[9px] font-black uppercase tracking-[0.2em] mt-8 pt-4 border-t border-divider w-full transition-colors"
                                    >
                                        [ Simulation Mode: Confirm Success ]
                                    </button>
                                )}
                            </div>
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
                            <button
                                onClick={handleRetry}
                                className="px-10 py-4 bg-ink/5 hover:bg-ink/10 rounded-2xl text-ink font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all"
                            >
                                <RefreshCw className="w-4 h-4" /> {t('membership.retry')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

