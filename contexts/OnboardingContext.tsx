'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/clients/browser';
import type { Plan } from '@/types';

interface LoyaltyProgram {
  id: string;
  pointsRequired: number;
  rewardLabel: string;
}

interface BusinessData {
  businessName: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  website: string;
  category: string;
  openingHours: string;
}

interface OnboardingContextType {
  selectedPlan: Plan | null;
  setSelectedPlan: (plan: Plan) => void;
  clearSelectedPlan: () => void;
  loyaltyPrograms: LoyaltyProgram[] | null;
  setLoyaltyPrograms: (programs: LoyaltyProgram[]) => void;
  businessData: BusinessData | null;
  setBusinessData: (data: BusinessData) => void;
  clearOnboarding: () => void;
  onboardingStatus: string | null;
  loading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgram[] | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore onboarding data from database when user is authenticated
  useEffect(() => {
    const restoreOnboardingData = async () => {
      if (authLoading) {
        return; // Wait for auth to finish loading
      }

      if (!user || !userProfile || !userProfile.pro) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: userData, error } = await supabase
          .from('users')
          .select('onboarding_status, onboarding_data')
          .eq('id', userProfile.id)
          .single();

        if (error) {
          setLoading(false);
          return;
        }

        if (userData) {
          setOnboardingStatus(userData.onboarding_status);

          // Restore data from onboarding_data if it exists
          const onboardingData = userData.onboarding_data || {};

          if (onboardingData.selectedPlan) {
            setSelectedPlan(onboardingData.selectedPlan);
          }

          if (onboardingData.businessData) {
            setBusinessData(onboardingData.businessData);
          }

          if (onboardingData.loyaltyPrograms) {
            setLoyaltyPrograms(onboardingData.loyaltyPrograms);
          }
        }
      } catch (err) {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };

    restoreOnboardingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, userProfile?.id, authLoading]);

  return (
    <OnboardingContext.Provider
      value={{
        selectedPlan,
        setSelectedPlan,
        clearSelectedPlan: () => setSelectedPlan(null),
        loyaltyPrograms,
        setLoyaltyPrograms,
        businessData,
        setBusinessData,
        clearOnboarding: () => {
          setSelectedPlan(null);
          setLoyaltyPrograms(null);
          setBusinessData(null);
        },
        onboardingStatus,
        loading
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
