'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  description: string;
  features: string[];
  max_loyalty_programs: number | null;
  is_active: boolean;
  promotion_enabled?: boolean;
  promotion_label?: string | null;
  promotion_months_free?: number;
  promotion_quantity_limit?: number | null;
  promotion_quantity_used?: number;
  promotion_start_date?: string | null;
  promotion_end_date?: string | null;
}

interface SubscriptionStatus {
  subscriptions: any[];
  availablePlans: SubscriptionPlan[];
  currentSubscription: any | null;
}

/**
 * Page de gestion des abonnements
 * Utilise useAuth() et useEdgeFunction() pour gérer les subscriptions
 */
export default function AbonnementsPage() {
  const { user, userProfile } = useAuth();
  const { callFunction } = useEdgeFunction();

  const [data, setData] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changingPlan, setChangingPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user || !userProfile) {
        setError('Utilisateur non authentifié');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: subscriptionData, error: subscriptionError } = await callFunction(
          'web-get-pro-subscription-status',
          {
            userId: userProfile.id,
            authId: user.id,
          }
        );

        if (subscriptionError) {
          throw new Error(subscriptionError);
        }

        if (subscriptionData) {
          setData(subscriptionData);
        } else {
          setError('Aucune donnée retournée');
        }
      } catch (err) {
        console.error('❌ Error fetching subscriptions:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user, userProfile, callFunction]);

  const handleChangePlan = async (planSlug: string) => {
    if (changingPlan || !user || !userProfile) return;

    try {
      setChangingPlan(planSlug);
      setError(null);

      const { data: changeData, error: changeError } = await callFunction(
        'web-change-subscription-plan',
        {
          userId: userProfile.id,
          authId: user.id,
          newPlanSlug: planSlug,
        }
      );

      if (changeError) {
        throw new Error(changeError);
      }

      if (changeData) {
        // Rafraîchir la page pour afficher le nouveau plan
        window.location.reload();
      }
    } catch (err) {
      console.error('❌ Error changing plan:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setChangingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Erreur lors du chargement'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Réessayer
          </button>
        </div>
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
                {plan.promotion_enabled && plan.promotion_label && (
                  <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                    {plan.promotion_label}
                  </span>
                )}
                {isPremium && !isInactive && !plan.promotion_enabled && (
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
                {plan.promotion_enabled && plan.promotion_months_free && plan.promotion_months_free > 0 ? (
                  <>
                    <div className="text-3xl font-bold text-slate-900">
                      0,00€
                      <span className="text-sm font-normal text-slate-600">/mois</span>
                    </div>
                    <p className="text-xs text-purple-600 font-semibold mt-1">
                      pendant {plan.promotion_months_free} mois
                    </p>
                    <p className="text-xs text-slate-500 line-through mt-1">
                      Puis {(plan.price_monthly / 100).toFixed(2)}€/mois
                    </p>
                  </>
                ) : (
                  <div className="text-3xl font-bold text-slate-900">
                    {formatPrice(plan.price_monthly)}
                  </div>
                )}
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
