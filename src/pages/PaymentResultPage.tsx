import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../shared/context/AuthContext';
import { PageTransition } from '../shared/components/PageTransition';
import { XCircle } from 'lucide-react';
import { Button } from '../shared/components/Button';
import { useLoading } from '../shared/context/LoadingContext';

/**
 * PaymentResultPage
 * Handles redirection from backend after VNPay payment processing.
 * Backend redirects here with a simplified ?code=... format.
 */
export const PaymentResultPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { updateUser } = useAuthContext();
    const { showLoader, hideLoader } = useLoading();
    const code = searchParams.get('code');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const isSuccess = code === '0' || code === '00' || status === 'PAID';

    useEffect(() => {
        if (isSuccess) {
            const isMeetingFlow = type === 'meeting' || type === 'date';
            
            // Only update membership if it's the membership flow
            if (!isMeetingFlow) {
                updateUser({ isMember: true });
            }
            
            showLoader(isMeetingFlow ? t('payment.meeting_confirmed_redirecting') : t('payment.membership_confirmed_redirecting'));
            
            // Short delay for better UX before heading to the next page
            const timer = setTimeout(() => {
                hideLoader();
                if (isMeetingFlow) {
                    navigate('/meeting-status', { replace: true });
                } else {
                    navigate('/onboarding/membership-success', { replace: true });
                }
            }, 2000);
            return () => clearTimeout(timer);
        } else if (code || status === 'CANCELLED') {
            // Failure case
        }
    }, [isSuccess, type, navigate, updateUser, showLoader, hideLoader, t]);

    if (isSuccess) {
        // While timer is running and loader is visible, return black background
        return <div className="fixed inset-0 bg-background-paper" />;
    }

    return (
        <PageTransition className="fixed inset-0 bg-background-paper flex flex-col items-center justify-center p-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mb-6" />
            <h1 className="text-ink text-2xl font-black uppercase tracking-widest">{t('payment.failed')}</h1>
            <p className="typo-error-desc mt-4 max-w-xs mx-auto">
                {t('payment.unsuccessful_error', { code: code || 'Unknown' })}
            </p>
            <Button 
                variant="glass" 
                className="mt-8 px-10"
                onClick={() => navigate('/onboarding/membership-payment')}
            >
                {t('membership.back_to_payment')}
            </Button>
        </PageTransition>
    );
};
