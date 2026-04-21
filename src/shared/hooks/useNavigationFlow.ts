import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { User } from '../types/models';

/**
 * useNavigationFlow Hook
 * Centralizes logic for determining the correct page based on user progress.
 * Prevents deep-linking into unauthorized steps.
 */
export const useNavigationFlow = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const getTargetRoute = useCallback((currentUser: User | null): string => {
    if (!currentUser) return '/';

    // 0. Community Guidelines (Must be accepted first)
    const hasAcceptedGuidelines = localStorage.getItem(`clique_guidelines_accepted_${currentUser.id || currentUser.userId}`);
    if (!hasAcceptedGuidelines) {
      return '/onboarding/guidelines';
    }

    // DEBUG: Log user progress flags to diagnose routing
    console.log('[NavigationFlow] User progress:', {
      id: currentUser.id || currentUser.userId,
      round1Completed: currentUser.round1Completed,
      round2Completed: currentUser.round2Completed,
      isMatchingSurveyCompleted: currentUser.isMatchingSurveyCompleted,
      isMember: currentUser.isMember,
    });

    // 1. Onboarding Round 1 (Intake Survey)
    // Robustness: If they've finished matching survey or photos, Round 1 MUST be done.
    const isR1ReallyDone = currentUser.round1Completed || currentUser.isMatchingSurveyCompleted || currentUser.round2Completed;
    if (!isR1ReallyDone) {
      return '/onboarding';
    }

    // 3. Photos + Review Journey
    if (!currentUser.round2Completed) {
      if (!currentUser.isMatchingSurveyCompleted) {
        return '/onboarding/matching-survey';
      }
      return '/onboarding/photo-upload';
    }

    // 4. Review Journey & Membership Payment
    //    round2Completed=true means survey + photos are done.
    //    We now enter the 4-step review/pricing flow.
    if (!currentUser.isMember) {
      return '/onboarding/review-status';
    }

    // 5. Admin Review Fallback
    //    Even if they are a member, they must be APPROVED to see matches.
    if (currentUser.adminStatus === 'PENDING_REVIEW' || currentUser.adminStatus === 'REJECTED') {
      return '/onboarding/review-status';
    }

    // 5. Round 3 Survey (Final Onboarding Step)
    if (!currentUser.round3Completed) {
      return '/onboarding/round3';
    }

    // All done → match page
    return '/match';
  }, []);

  /**
   * Navigate to the correct step based on user progress.
   * Accepts an optional `freshUser` param to avoid stale closures
   * (e.g., right after login when React state hasn't re-rendered yet).
   */
  const navigateToCorrectStep = useCallback((freshUser?: User | null) => {
    const targetUser = freshUser || user;
    if (!targetUser) {
      navigate('/', { replace: true });
      return;
    }
    const target = getTargetRoute(targetUser);
    if (target !== location.pathname) {
      navigate(target, { replace: true });
    }
  }, [user, navigate, getTargetRoute]);

  return { getTargetRoute, navigateToCorrectStep };
};
