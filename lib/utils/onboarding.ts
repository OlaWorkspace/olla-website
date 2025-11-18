/**
 * Onboarding status management utilities
 * Uses localStorage for client-side persistence
 */

export type OnboardingStatus =
  | null
  | 'plan_selected'
  | 'business_info'
  | 'loyalty_setup'
  | 'completed';

const ONBOARDING_STATUS_KEY = 'olla_onboarding_status';

/**
 * Get the current onboarding status from localStorage
 */
export const getOnboardingStatus = (): OnboardingStatus => {
  if (typeof window === 'undefined') return null;

  try {
    const status = localStorage.getItem(ONBOARDING_STATUS_KEY);
    return status as OnboardingStatus;
  } catch (error) {
    console.error('Error reading onboarding status:', error);
    return null;
  }
};

/**
 * Set the onboarding status in localStorage
 */
export const setOnboardingStatus = (status: OnboardingStatus): void => {
  if (typeof window === 'undefined') return;

  try {
    if (status === null) {
      localStorage.removeItem(ONBOARDING_STATUS_KEY);
    } else {
      localStorage.setItem(ONBOARDING_STATUS_KEY, status);
    }
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
};

/**
 * Clear the onboarding status from localStorage
 */
export const clearOnboardingStatus = (): void => {
  setOnboardingStatus(null);
};

/**
 * Get the route path for a given onboarding status
 */
export const getOnboardingPath = (status: OnboardingStatus): string => {
  switch (status) {
    case 'plan_selected':
      return '/onboarding/business';
    case 'business_info':
      return '/onboarding/loyalty';
    case 'loyalty_setup':
      return '/onboarding/welcome';
    case 'completed':
      return '/pro';
    default:
      return '/onboarding/plan';
  }
};

/**
 * Get the expected status for a given route
 */
export const getExpectedStatus = (pathname: string): OnboardingStatus | 'completed' => {
  if (pathname.includes('/onboarding/plan')) {
    return null;
  }
  if (pathname.includes('/onboarding/business')) {
    return 'plan_selected';
  }
  if (pathname.includes('/onboarding/loyalty')) {
    return 'business_info';
  }
  if (pathname.includes('/onboarding/welcome')) {
    return 'loyalty_setup';
  }
  return 'completed';
};

/**
 * Check if the user can access a specific onboarding step
 */
export const canAccessStep = (
  currentStatus: OnboardingStatus,
  pathname: string
): boolean => {
  const expectedStatus = getExpectedStatus(pathname);

  // If onboarding is completed, redirect to dashboard
  if (currentStatus === 'completed') {
    return pathname === '/pro';
  }

  // Define the step order
  const steps: (OnboardingStatus | 'completed')[] = [
    null,
    'plan_selected',
    'business_info',
    'loyalty_setup',
    'completed'
  ];

  const currentIndex = steps.indexOf(currentStatus);
  const expectedIndex = steps.indexOf(expectedStatus);

  // User can access the current step or previous steps
  return expectedIndex <= currentIndex + 1;
};

/**
 * Get the correct redirect path based on current status and attempted path
 */
export const getRedirectPath = (
  currentStatus: OnboardingStatus,
  pathname: string
): string | null => {
  // If onboarding is completed, redirect to dashboard
  if (currentStatus === 'completed') {
    return '/pro';
  }

  // Check if user can access this step
  if (!canAccessStep(currentStatus, pathname)) {
    // Redirect to the next step they should complete
    return getOnboardingPath(currentStatus);
  }

  return null;
};
