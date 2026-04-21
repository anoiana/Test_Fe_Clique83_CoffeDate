import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMeetings } from './useMeetings';
import { getStatusDetails } from '../utils/meetingStatusUtils';
import { Meeting } from '../api/meetingApi';

/**
 * useMeetingStatus
 * Hook to manage meeting status page logic.
 */
export const useMeetingStatus = (currentUser: string) => {
  const { t } = useTranslation();
  const { meetings, isRefreshing, error, refetch } = useMeetings();

  const meetingDetails = useMemo(() => {
    return meetings.map(meeting => ({
      ...meeting,
      details: getStatusDetails(meeting, currentUser, t)
    }));
  }, [meetings, currentUser, t]);

  return {
    meetings: meetingDetails,
    isRefreshing,
    error,
    refetch,
    hasMeetings: meetings.length > 0
  };
};

/**
 * useStatusGridLogic
 * Hook to extract logic for the StatusGrid component.
 */
export const useStatusGridLogic = (meeting: Meeting, currentUser: string) => {
  const isUserA = currentUser === meeting.userAId;

  const { youDone, matchDone } = useMemo(() => {
    let you = false;
    let match = false;

    if (meeting.status === 'awaiting_payment') {
      you = isUserA ? meeting.userAPaid : meeting.userBPaid;
      match = isUserA ? meeting.userBPaid : meeting.userAPaid;
    } else if (meeting.status === 'awaiting_availability') {
      you = isUserA ? !!meeting.userAAvailability : !!meeting.userBAvailability;
      match = isUserA ? !!meeting.userBAvailability : !!meeting.userAAvailability;
    } else {
      you = isUserA ? !!meeting.userALocationPreferences?.length : !!meeting.userBLocationPreferences?.length;
      match = isUserA ? !!meeting.userBLocationPreferences?.length : !!meeting.userALocationPreferences?.length;
    }

    return { youDone: you, matchDone: match };
  }, [meeting, isUserA]);

  return { youDone, matchDone };
};
