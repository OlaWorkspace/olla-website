'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  getOnboardingStatus,
  getRedirectPath,
  OnboardingStatus,
} from '@/lib/utils/onboarding';

interface UseOnboardingGuardReturn {
  isChecking: boolean;
  isAuthorized: boolean;
}

/**
 * Hook to guard onboarding pages and ensure users are at the correct step
 *
 * Features:
 * - Checks if user can access the current onboarding step
 * - Redirects forward if user has already completed current step
 * - Redirects backward if user hasn't completed previous steps
 * - Shows loading state during verification
 * - Syncs with database onboarding_status
 *
 * @example
 * ```tsx
 * function OnboardingPage() {
 *   const { isChecking, isAuthorized } = useOnboardingGuard();
 *
 *   if (isChecking) return <Loader />;
 *   if (!isAuthorized) return null;
 *
 *   return <YourContent />;
 * }
 * ```
 */
export const useOnboardingGuard = (): UseOnboardingGuardReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userProfile, loading: authLoading } = useAuth();

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        return;
      }

      // If no user, redirect to login
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // If not a pro user, redirect to home
      if (!userProfile?.pro) {
        router.push('/');
        return;
      }

      // Get current onboarding status from localStorage
      let currentStatus = getOnboardingStatus();

      // Sync with database if available
      if (userProfile?.onboarding_status !== undefined) {
        currentStatus = userProfile.onboarding_status as OnboardingStatus;
      }

      // Check if user needs to be redirected
      const redirectPath = getRedirectPath(currentStatus, pathname);

      if (redirectPath && redirectPath !== pathname) {
        // User should be redirected to a different step
        setIsChecking(false);
        setIsAuthorized(false);
        router.push(redirectPath);
        return;
      }

      // User is authorized to view this page
      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAccess();
  }, [user, userProfile, authLoading, pathname, router]);

  return {
    isChecking,
    isAuthorized,
  };
};
