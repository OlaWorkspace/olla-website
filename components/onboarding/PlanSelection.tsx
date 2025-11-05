// components/onboarding/PlanSelection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Zap } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';
import type { Plan } from '@/types';

export default function PlanSelection() {
  const router = useRouter();
  const { setSelectedPlan } = useOnboarding();
  const { callFunction } = useEdgeFunction();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

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

  const handleSelectPlan = (plan: Plan) => {
    setSelectedSlug(plan.slug);
    setSelectedPlan(plan);
    // Redirection après une courte animation
    setTimeout(() => {
      router.push('/onboarding/business');
    }, 300);
  };

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

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-text mb-4">
          Choisissez votre plan d'abonnement
        </h1>
        <p className="text-text-light text-lg">
          Tous nos plans incluent l'accès complet à la plateforme de fidélisation.
          Vous pourrez toujours changer de plan plus tard.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isProPlan = plan.slug === 'pro';
          const isSelected = selectedSlug === plan.slug;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              } ${isProPlan ? 'opacity-60' : ''}`}
            >
              {/* Badge "Soon" for Pro plan */}
              {isProPlan && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                    Bientôt disponible
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-text mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-text-light text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-text">
                      {plan.price_monthly === 0 ? 'Gratuit' : `${plan.price_monthly}€`}
                    </span>
                    {plan.price_monthly > 0 && (
                      <span className="text-text-light">/mois</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8 space-y-3">
                  {plan.features && Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text text-sm">{feature}</span>
                    </div>
                  ))}

                  {/* Max loyalty programs info */}
                  {plan.max_loyalty_programs && (
                    <div className="flex items-start gap-3 pt-3 border-t border-border/50">
                      <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-text text-sm font-semibold">
                        Jusqu'à {plan.max_loyalty_programs} programmes de fidélité
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isProPlan || selectedSlug === plan.slug}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    isProPlan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isSelected
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text hover:bg-primary hover:text-white'
                  }`}
                >
                  {selectedSlug === plan.slug ? 'Sélectionné ✓' : 'Choisir ce plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Notice */}
      <div className="bg-info/10 border border-info rounded-lg p-6 text-center max-w-2xl mx-auto">
        <p className="text-info text-sm">
          💡 <strong>Info:</strong> Vous pouvez essayer notre plateforme avec le plan gratuit avant de passer à un plan payant.
        </p>
      </div>
    </div>
  );
}
