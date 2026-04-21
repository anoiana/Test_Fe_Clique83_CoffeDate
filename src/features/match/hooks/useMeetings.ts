import { useQuery } from '@tanstack/react-query';
import { meetingApi, Meeting } from '../api/meetingApi';

/**
 * useMeetings
 * Hook to retrieve and manage user's meetings using React Query.
 */
export const useMeetings = () => {
  const { 
    data: meetings = [], 
    error, 
    isFetching, 
    isLoading,
    refetch 
  } = useQuery<Meeting[]>({
    queryKey: ['meetings'],
    queryFn: () => meetingApi.getMyMeetings(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1
  });

  const activeMeeting = meetings.length > 0 ? meetings[0] : null;

  return {
    meetings,
    activeMeeting,
    error: error ? (error as unknown as {message?: string}).message || 'Unable to retrieve meetings' : null,
    isRefreshing: isFetching || isLoading,
    refetch
  };
};
