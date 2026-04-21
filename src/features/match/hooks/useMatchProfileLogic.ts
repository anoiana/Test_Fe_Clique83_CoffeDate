import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { matchApi, MatchSuggestion } from '../api/matchApi';
import { useMeetings } from './useMeetings';
import { useLoading } from '../../../shared/context/LoadingContext';
import { useNotification } from '../../../shared/context/NotificationContext';
import { useScroll, useTransform, useMotionValue } from 'framer-motion';

/**
 * useMatchProfileActions
 * Hook to handle accept/reject actions for a match.
 */
export const useMatchProfileActions = (suggestion: MatchSuggestion | null) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showLoader, hideLoader } = useLoading();
  const { showSuccess } = useNotification();

  const rejectMutation = useMutation({
    mutationFn: (suggestionId: string) => matchApi.rejectSuggestion(suggestionId),
    onMutate: () => showLoader(t('shared.loading.processing_decision')),
    onSettled: () => hideLoader(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-suggestion'] });
      navigate('/dashboard');
    },
    onError: (err: Error) => console.error('Failed to reject match:', err)
  });

  const acceptMutation = useMutation({
    mutationFn: (suggestionId: string) => matchApi.acceptSuggestion(suggestionId),
    onMutate: () => showLoader(t('shared.loading.initiating')),
    onSettled: () => hideLoader(),
    onSuccess: () => {
      showSuccess(t('shared.success.default_message'));
      queryClient.invalidateQueries({ queryKey: ['match-suggestion'] });
      // Reload to trigger status-based screen selection or mutation will handle it
      // Actually, invalidating query might be enough but original code did a reload
      window.location.reload();
    },
    onError: (err: Error) => console.error('Failed to accept match:', err)
  });

  const handleReject = useCallback(() => {
    if (suggestion) rejectMutation.mutate(suggestion.id);
  }, [suggestion, rejectMutation]);

  const handleLike = useCallback(() => {
    if (suggestion) acceptMutation.mutate(suggestion.id);
  }, [suggestion, acceptMutation]);

  return { handleReject, handleLike, isProcessing: rejectMutation.isPending || acceptMutation.isPending };
};

/**
 * useMatchProfileNavigation
 * Hook to handle complex navigation logic for Match Profile.
 */
import { MatchDataForNavigation } from '../../../shared/types/index';

export const useMatchProfileNavigation = (suggestion: MatchSuggestion | null, matchData: MatchDataForNavigation) => {
  const navigate = useNavigate();
  const { activeMeeting, isRefreshing: isCheckingMeetings } = useMeetings();
  const [hasCheckedMeetings, setHasCheckedMeetings] = useState(false);

  // AUTH/LOGIC GUARD: If there's already an active meeting, don't show match profile
  useEffect(() => {
    if (isCheckingMeetings) return;

    if (activeMeeting) {
      if (activeMeeting.status === 'awaiting_payment' && suggestion) {
        setHasCheckedMeetings(true);
      } else {
        navigate('/meeting-status', { replace: true });
      }
    } else {
      setHasCheckedMeetings(true);
    }
  }, [navigate, suggestion, isCheckingMeetings, activeMeeting]);

  // Handle auto-redirect if suggestion is fully accepted by both parties
  useEffect(() => {
    if (hasCheckedMeetings && suggestion && (suggestion.status === 'accepted' || suggestion.status === 'mutual_accept') && matchData) {
      navigate('/match/found', { 
        state: { 
          meetingId: suggestion.meetingId, 
          matchName: matchData.name,
          matchAvatar: matchData.profilePicUrl 
        },
        replace: true
      });
    }
  }, [hasCheckedMeetings, suggestion, navigate, matchData]);

  return { hasCheckedMeetings };
};

/**
 * useMatchProfileScroll
 * Hook to handle scroll effects and progress in Match Profile.
 * Uses Framer Motion's useScroll for high-performance, consistent tracking.
 */
export const useMatchProfileScroll = (introStage: number) => {
  // Use built-in useScroll hook for the most reliable tracking across all devices
  const { scrollY, scrollYProgress } = useScroll();

  // Progress bar animation
  const headerScrollWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const particlesFade = useTransform(scrollYProgress, [0.1, 0.4], [1, 0.1]);
  const scrollHintOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  return { 
    scrollYProgress, 
    scrollY, 
    headerScrollWidth, 
    particlesFade, 
    scrollHintOpacity
  };
};
