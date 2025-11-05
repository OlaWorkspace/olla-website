// contexts/OnboardingContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  features: string[];
  max_loyalty_programs: number | null;
  display_order: number;
}

interface OnboardingContextType {
  selectedPlan: Plan | null;
  setSelectedPlan: (plan: Plan) => void;
  clearSelectedPlan: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <OnboardingContext.Provider
      value={{
        selectedPlan,
        setSelectedPlan,
        clearSelectedPlan: () => setSelectedPlan(null)
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
