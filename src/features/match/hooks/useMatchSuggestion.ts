import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { matchApi, MatchSuggestion } from '../api/matchApi';
import { MATCH_STATUS_PRIORITY } from '../data/matchConstants';

/**
 * useMatchSuggestion
 * Hook to retrieve and prioritize the most relevant match for the current user.
 * Refactored to use React Query for caching and automatic updates.
 */
export const useMatchSuggestion = () => {
  const { 
    data: response, 
    error, 
    isFetching, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['match-suggestion'],
    queryFn: () => matchApi.getLatestSuggestion(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });

  const suggestion = useMemo(() => {
    if (!Array.isArray(response)) return null;
    
    // Use priority order from constants to find the most relevant match
    for (const status of MATCH_STATUS_PRIORITY) {
      const match = response.find(m => m.status === status);
      if (match) return match;
    }
    
    return null;
  }, [response]);

  return {
    suggestion,
    error: error ? (error as unknown as {message?: string}).message || 'Unable to retrieve your match' : null,
    isRefreshing: isFetching || isLoading,
    refetch
  };
};
