import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IntakeReview } from '../features/onboarding/components/Intake/IntakeReview';

/**
 * ProfileReviewPage — Standalone wrapper for the IntakeReview component.
 * Used for viewing the profile from Settings.
 */
export const ProfileReviewPage = () => {
    const navigate = useNavigate();

    return (
        <IntakeReview 
            onClose={() => navigate(-1)} 
            onEdit={() => navigate('/onboarding')} 
        />
    );
};
