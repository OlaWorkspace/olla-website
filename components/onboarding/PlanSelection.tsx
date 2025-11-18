// components/onboarding/PlanSelection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Zap, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';
import { useOnboardingGuard } from '@/lib/hooks/useOnboardingGuard';
import { setOnboardingStatus } from '@/lib/utils/onboarding';
import type { Plan } from '@/types';

export default function PlanSelection() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { setSelectedPlan } = useOnboarding();
  const { callFunction } = useEdgeFunction();
  const { isChecking, isAuthorized } = useOnboardingGuard();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await callFunction('web-get-available-plans', {});

        if (fetchError) {
          setError(fetchError);
          return;
        }

        setPlans(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (plan: Plan) => {
    // Attendre que l'authentification soit chargée
    if (authLoading) {
      setError('Chargement en cours, veuillez patienter...');
      return;
    }

    if (!user || !userProfile) {
      setError('Veuillez vous connecter pour continuer');
      return;
    }

    setSelectedSlug(plan.slug);
    setSelectedPlan(plan);
    setSaving(true);

    try {
      // Save progress to database
      const { error: saveError } = await callFunction('web-save-onboarding-progress', {
        userId: userProfile.id,
        authId: user.id,
        step: 'plan_selected',
        data: {
          selectedPlan: plan
        }
      });

      if (saveError) {
        console.error('Error saving plan selection:', saveError);
        // Continue anyway - data is in context
      }

      // Save status to localStorage for instant access on next visit
      setOnboardingStatus('plan_selected');

      // Redirection après sauvegarde
      setTimeout(() => {
        router.push('/onboarding/business');
      }, 300);
    } catch (err) {
      console.error('Error in handleSelectPlan:', err);
      // Save to localStorage even if API fails
      setOnboardingStatus('plan_selected');
      setTimeout(() => {
        router.push('/onboarding/business');
      }, 300);
    } finally {
      setSaving(false);
    }
  };

  // Helper function to format price from cents to euros
  const formatPrice = (priceInCents: number) => {
    if (priceInCents === 0) return 'Gratuit';
    return `${(priceInCents / 100).toFixed(2).replace('.', ',')}€`;
  };

  // Show loader while checking authorization
  if (isChecking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border rounded-full border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-text-light">Vérification...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authorized (will redirect)
  if (!isAuthorized) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border rounded-full border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-text-light">Chargement des plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-text-light">Aucun plan disponible</p>
      </div>
    );
  }

  // Find recommended plan (Premium or highest value plan)
  const recommendedPlan = plans.find(p => p.slug === 'premium') || plans.find(p => p.slug === 'pro') || plans[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-2 leading-tight">
          Choisissez le plan qui vous convient
        </h1>
        <p className="text-text-light text-base leading-relaxed">
          Accès complet à tous les outils. Changez de plan à tout moment.
        </p>
      </div>

      {/* Plans Grid - High Conversion Design */}
      <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
        {plans.map((plan) => {
          const isComingSoon = plan.slug === 'pro';
          const isSelected = selectedSlug === plan.slug;
          const isRecommended = plan.id === recommendedPlan.id && !isComingSoon;
          const isHighlighted = isRecommended && !isSelected;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                isComingSoon
                  ? 'border-border opacity-60 bg-gray-50'
                  : isSelected
                  ? 'border-success bg-success/5 shadow-lg'
                  : isHighlighted
                  ? 'border-success bg-white shadow-xl md:scale-105'
                  : 'border-border hover:border-primary/50 bg-white hover:shadow-md'
              }`}
            >
              {/* Recommended Badge */}
              {isRecommended && !plan.promotion_enabled && (
                <div className="absolute top-0 left-0 right-0 bg-success text-white text-center py-1.5 text-xs font-bold uppercase tracking-wide">
                  Recommandé
                </div>
              )}

              {/* Promotion Badge */}
              {plan.promotion_enabled && plan.promotion_label && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-1.5 text-xs font-bold uppercase tracking-wide">
                  {plan.promotion_label}
                </div>
              )}

              {/* Coming Soon Badge */}
              {isComingSoon && (
                <div className="absolute top-0 left-0 right-0 bg-gray-300 text-gray-600 text-center py-1.5 text-xs font-bold uppercase tracking-wide">
                  Bientôt disponible
                </div>
              )}

              <div className={`p-6 ${isRecommended || isComingSoon || plan.promotion_enabled ? 'pt-10' : ''} h-full flex flex-col`}>
                {/* Plan Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-text mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-text-light text-xs h-8 line-clamp-2">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6 pb-6 border-b border-border">
                  {plan.promotion_enabled && plan.promotion_months_free && plan.promotion_months_free > 0 ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-text">
                          0,00€
                        </span>
                        <span className="text-text-light text-sm">/mois</span>
                      </div>
                      <p className="text-xs text-purple-600 font-semibold mt-1">
                        pendant {plan.promotion_months_free} mois
                      </p>
                      <p className="text-xs text-text-light line-through mt-1">
                        Puis {(plan.price_monthly / 100).toFixed(2).replace('.', ',')}€/mois
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-text">
                          {formatPrice(plan.price_monthly)}
                        </span>
                        {plan.price_monthly > 0 && (
                          <span className="text-text-light text-sm">/mois</span>
                        )}
                      </div>
                      {plan.price_monthly === 0 && (
                        <p className="text-xs text-text-light mt-1">Parfait pour débuter</p>
                      )}
                    </>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6 space-y-2 flex-grow">
                  {plan.features && Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text text-sm leading-snug">{feature}</span>
                    </div>
                  ))}

                  {/* Max loyalty programs info */}
                  {plan.max_loyalty_programs && (
                    <div className="flex items-start gap-3 pt-3 border-t border-border/50 mt-4">
                      <Zap className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text text-sm font-semibold">
                        Jusqu'à {plan.max_loyalty_programs} programmes
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isComingSoon || isSelected}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    isComingSoon
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isSelected
                      ? 'bg-success text-white'
                      : isHighlighted
                      ? 'bg-success hover:bg-opacity-90 text-white shadow-md'
                      : 'bg-gray-100 text-text hover:bg-primary hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <>
                      <Check className="w-5 h-5" />
                      Sélectionné
                    </>
                  )}
                  {!isSelected && !isComingSoon && (
                    <>
                      Choisir ce plan
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                  {isComingSoon && 'Bientôt'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Signal & CTA */}
      <div className="bg-success/10 border border-success rounded-xl p-4 text-center max-w-xl mx-auto">
        <p className="text-success font-semibold text-sm mb-1">✓ Pas de carte bancaire requise</p>
        <p className="text-text text-xs">
          Essayez gratuitement dès maintenant.
        </p>
      </div>
    </div>
  );
}
