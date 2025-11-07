'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/clients/browser';

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  description: string;
  features: string[];
  max_loyalty_programs: number | null;
  is_active: boolean;
}

interface SubscriptionStatus {
  subscriptions: any[];
  availablePlans: SubscriptionPlan[];
  currentSubscription: any | null;
}

export default function AbonnementsPage() {
  const [data, setData] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changingPlan, setChangingPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setError('User not authenticated');
          return;
        }

        const { data: dbUser, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', authUser.id)
          .single();

        if (userError || !dbUser) {
          setError('Failed to fetch user data');
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          setError('No access token available');
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/web-get-pro-subscription-status`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              userId: dbUser.id,
              authId: authUser.id,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch subscription data (${response.status})`);
        }

        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleChangePlan = async (planSlug: string) => {
    if (changingPlan) return;

    try {
      setChangingPlan(planSlug);
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setError('User not authenticated');
        return;
      }

      const { data: dbUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (userError || !dbUser) {
        setError('Failed to fetch user data');
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError('No access token available');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/web-change-subscription-plan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: dbUser.id,
            authId: authUser.id,
            newPlanSlug: planSlug,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to change plan (${response.status})`);
      }

      const result = await response.json();
      if (result.success) {
        window.location.reload();
      } else {
        setError(result.error || 'Failed to change plan');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setChangingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600">Chargement...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error || 'Erreur lors du chargement'}</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    return `${(price / 100).toFixed(2)}€/mois`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Abonnements
        </h1>
        <p className="text-slate-600">
          Choisissez le plan adapté à vos besoins
        </p>
      </div>

      {/* Current Plan Banner */}
      {data.currentSubscription && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-sm font-medium text-green-900">
            Plan actuel : <strong>{data.currentSubscription.plan.name}</strong>
            {data.currentSubscription.expiresAt && (
              <span className="text-green-700 ml-2">
                (jusqu'au {new Date(data.currentSubscription.expiresAt).toLocaleDateString('fr-FR')})
              </span>
            )}
          </p>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {data.availablePlans.map((plan) => {
          const isCurrentPlan = data.currentSubscription?.plan.slug === plan.slug;
          const isPremium = plan.slug === 'premium';
          const isInactive = !plan.is_active;

          return (
            <div
              key={plan.id}
              className={`border rounded-lg p-6 ${
                isPremium && !isInactive
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              } ${isCurrentPlan ? "ring-2 ring-green-500" : ""}`}
            >
              {/* Header */}
              <div className="mb-4">
                {isPremium && !isInactive && (
                  <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                    Recommandé
                  </span>
                )}
                {isInactive && (
                  <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                    Bientôt disponible
                  </span>
                )}
                {isCurrentPlan && (
                  <span className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                    Plan actuel
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-slate-900">
                  {formatPrice(plan.price_monthly)}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.max_loyalty_programs && (
                  <li className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Jusqu'à {plan.max_loyalty_programs} programmes</span>
                  </li>
                )}
              </ul>

              {/* Special Pro Info */}
              {plan.slug === 'pro' && isInactive && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded text-sm">
                  <p className="font-semibold text-orange-900 mb-1">Offre de lancement</p>
                  <ul className="space-y-1 text-orange-800">
                    <li>• -30% à vie</li>
                    <li>• 3 mois offerts</li>
                    <li>• Accès prioritaire</li>
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={() => !isInactive && handleChangePlan(plan.slug)}
                disabled={isCurrentPlan || isInactive || changingPlan !== null}
                className={`w-full py-2 px-4 rounded font-medium transition ${
                  isCurrentPlan || isInactive || changingPlan !== null
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : isPremium
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {changingPlan === plan.slug
                  ? "Changement..."
                  : isCurrentPlan
                  ? "Plan actuel"
                  : isInactive
                  ? "Bientôt disponible"
                  : "Choisir ce plan"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Simple FAQ */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Questions fréquentes</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">Puis-je changer de plan ?</h4>
            <p className="text-sm text-slate-600">Oui, à tout moment sans engagement.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">Comment annuler ?</h4>
            <p className="text-sm text-slate-600">En un clic depuis votre compte, accès maintenu jusqu'à la fin de période.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">Essai gratuit ?</h4>
            <p className="text-sm text-slate-600">Le plan Gratuit est disponible sans limite de temps.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
