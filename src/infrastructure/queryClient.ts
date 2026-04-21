import { QueryClient } from '@tanstack/react-query';

/**
 * Global Query Client Configuration
 * Optimized for a premium, fast-feeling experience.
 * Debt #2 solved: Centralized Server State Management.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (Keep data fresh, but avoid redundant API calls)
      gcTime: 1000 * 60 * 30,    // 30 minutes (Cache remains in memory longer for back-navigation)
      retry: 1,                 // Only retry once on failure (Better UX for unstable connections)
      refetchOnWindowFocus: false, // Don't refetch when user switches tabs (Save resources)
    },
  },
});
