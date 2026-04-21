import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useNavigationFlow } from '../hooks/useNavigationFlow';
import { LoadingOverlay } from './LoadingOverlay';

interface RouteGuardProps {
  children: React.ReactNode;
  isPublic?: boolean;
}

/**
 * RouteGuard Component
 * Handles Public/Private route logic and progress-based redirection.
 * 
 * Uses a "verification key" to ensure verification runs exactly ONCE per
 * unique combination of (pathname, user identity). This prevents:
 * 1. Infinite redirect loops (same key = skip verification)
 * 2. Stale redirects after login/logout (key changes = re-verify)
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ children, isPublic = false }) => {
  const { user, isInitialized } = useAuthContext();
  const { getTargetRoute } = useNavigationFlow();
  const location = useLocation();
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  
  // Track the last verified "key" to prevent re-verification for the same state
  // Key = pathname + user identity (userId or "anonymous")
  const lastVerifiedKeyRef = useRef<string>('');

  useEffect(() => {
    if (!isInitialized) return;

    // Build a unique key for this route + user combination
    const userId = user?.id || user?.userId || 'anonymous';
    const currentKey = `${location.pathname}::${userId}`;

    // If we've already verified this exact combination, skip
    if (lastVerifiedKeyRef.current === currentKey) return;
    lastVerifiedKeyRef.current = currentKey;

    // Reset state for fresh verification
    setTargetPath(null);

    if (!user) {
      setIsVerifying(false);
      return;
    }

    // User is logged in — determine where they should be
    const correctPath = getTargetRoute(user);
    
    console.log('[RouteGuard] Verifying path:', {
      current: location.pathname,
      target: correctPath,
      userStatus: user?.adminStatus,
      r1: user?.round1Completed,
      r2: user?.round2Completed
    });

    // Define onboarding routes that need strict enforcement
    const onboardingRoutes = [
      '/onboarding/welcome',
      '/onboarding',
      '/onboarding/matching-survey',
      '/onboarding/photo-upload',
      '/onboarding/review-status',
      '/onboarding/r1-completion',
      '/onboarding/matching-fee',
      '/onboarding/membership-success',
      '/onboarding/round3',
      '/onboarding/round3-success'
    ];

    const currentPath = location.pathname;

    // 1. If on a public route (like /) but logged in, go to correctPath
    if (isPublic && currentPath === '/') {
      setTargetPath(correctPath);
    }
    // 2. If the user hasn't finished onboarding (correctPath is an onboarding route)
    //    and they are trying to access a non-onboarding page (like /match).
    //    Allow ANY onboarding step — each page handles its own prerequisite checks.
    //    This prevents redirect loops (e.g. photo-upload ↔ matching-fee).
    else if (onboardingRoutes.includes(correctPath)) {
      const currentIndex = onboardingRoutes.indexOf(currentPath);

      const isOnAllowedPath = currentPath.startsWith('/settings')
        || currentPath.startsWith('/onboarding/r1-completion')
        || currentIndex !== -1; // Allow any onboarding step

      if (!isOnAllowedPath) {
        setTargetPath(correctPath);
      }
    }
    // 3. If user has COMPLETED onboarding (correctPath is /match, /meeting-status, etc.)
    //    but they're still on an onboarding page → redirect to post-onboarding page.
    else if (onboardingRoutes.indexOf(currentPath) !== -1) {
      setTargetPath(correctPath);
    }

    setIsVerifying(false);
  }, [isInitialized, user, location.pathname, isPublic, getTargetRoute]);

  if (!isInitialized || isVerifying) {
    return <LoadingOverlay isVisible={true} message="" />;
  }

  // Handle Private Route redirection
  if (!isPublic && !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Handle Progress-based redirection
  if (targetPath && targetPath !== location.pathname) {
    return <Navigate to={targetPath} replace />;
  }

  return <>{children}</>;
};
