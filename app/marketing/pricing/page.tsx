import Link from "next/link";
import { Check, Zap, CreditCard, HelpCircle, MessageCircle, Star, Sparkles, Tag } from "lucide-react";
import type { Plan } from '@/types';

// Helper function to check if promotion is active
function isPromotionActive(plan: Plan): boolean {
  if (!plan.promotion_enabled) return false;

  const now = new Date();

  // Check start date
  if (plan.promotion_start_date) {
    const startDate = new Date(plan.promotion_start_date);
    if (now < startDate) return false;
  }

  // Check end date
  if (plan.promotion_end_date) {
    const endDate = new Date(plan.promotion_end_date);
    if (now > endDate) return false;
  }

  // Check quantity limits
  if (plan.promotion_quantity_limit !== null && plan.promotion_quantity_limit !== undefined) {
    const used = plan.promotion_quantity_used || 0;
    if (used >= plan.promotion_quantity_limit) return false;
  }

  return true;
}

// Fonction pour récupérer les plans depuis Supabase (Server Component)
async function getPlans(): Promise<Plan[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/web-get-available-plans`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Pas de cache pour avoir les dernières données
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch plans:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (data.success && data.data) {
      // Convertir price_monthly de centimes en euros
      return data.data.map((plan: any) => ({
        ...plan,
        price_monthly: plan.price_monthly / 100
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <>
      {/* Hero Section */}
      <section className="py-4 sm:py-6 lg:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-10 lg:mb-16">

            <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-2 leading-tight">
              Tarifs <span className="text-primary">simples et transparents</span>
            </h1>
            <p className="text-xs sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Commencez gratuitement. Évoluez selon vos besoins.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 my-4 sm:my-6 lg:my-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const isProPlan = plan.slug === 'pro';
              const isPremium = plan.slug === 'premium';
              const hasActivePromotion = isPromotionActive(plan);

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-lg sm:rounded-2xl lg:rounded-3xl border-2 transition-all duration-300 ${
                    hasActivePromotion
                      ? 'border-orange-400 shadow-lg shadow-orange-100 sm:scale-105'
                      : isProPlan
                      ? 'border-gray-200 opacity-60'
                      : isPremium
                      ? 'border-primary shadow-xl sm:scale-105'
                      : 'border-gray-100 hover:border-primary hover:shadow-xl'
                  }`}
                >
                  {/* Badge "Promotion" for active promotions */}
                  {hasActivePromotion && plan.promotion_label && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-lg">
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {plan.promotion_label}
                      </span>
                    </div>
                  )}

                  {/* Badge "Populaire" for Premium (only if no promotion) */}
                  {!hasActivePromotion && isPremium && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-primary to-secondary text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-lg">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Populaire
                      </span>
                    </div>
                  )}

                  {/* Badge "Soon" for Pro plan (only if no promotion) */}
                  {!hasActivePromotion && isProPlan && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-semibold rounded-full">
                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Bientôt disponible
                      </span>
                    </div>
                  )}

                  <div className="p-4 sm:p-6 lg:p-8">
                    {/* Promotion Banner (inside card, at top) */}
                    {hasActivePromotion && (
                      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-[10px] sm:text-xs font-bold text-orange-700">
                              {plan.promotion_label || 'Offre spéciale'}
                            </p>
                            {plan.promotion_months_free && plan.promotion_months_free > 0 && (
                              <p className="text-[9px] sm:text-[10px] text-orange-600">
                                {plan.promotion_months_free} {plan.promotion_months_free === 1 ? 'mois offert' : 'mois offerts'}
                              </p>
                            )}
                          </div>
                          {plan.promotion_end_date && (
                            <div className="text-right">
                              <p className="text-[8px] sm:text-[9px] text-orange-600 font-medium">
                                Expire le
                              </p>
                              <p className="text-[9px] sm:text-[10px] text-orange-700 font-semibold">
                                {new Date(plan.promotion_end_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                              </p>
                            </div>
                          )}
                        </div>
                        {plan.promotion_quantity_limit && (
                          <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-orange-200">
                            <div className="flex items-center justify-between">
                              <p className="text-[9px] sm:text-[10px] text-orange-600 font-medium">
                                Places restantes
                              </p>
                              <div className="flex items-center gap-1">
                                <div className="h-1 sm:h-1.5 w-12 sm:w-16 bg-orange-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-orange-500 rounded-full transition-all"
                                    style={{
                                      width: `${Math.max(0, Math.min(100, ((plan.promotion_quantity_limit - (plan.promotion_quantity_used || 0)) / plan.promotion_quantity_limit) * 100))}%`
                                    }}
                                  />
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-bold text-orange-700">
                                  {Math.max(0, plan.promotion_quantity_limit - (plan.promotion_quantity_used || 0))}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-3 sm:mb-4 lg:mb-6">
                      <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-1.5 lg:mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 text-[10px] sm:text-xs lg:text-sm leading-snug sm:leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4 sm:mb-6 lg:mb-8 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-100">
                      <div className="flex items-baseline gap-1 sm:gap-1.5 lg:gap-2">
                        <span className={`text-2xl sm:text-3xl lg:text-5xl font-bold ${hasActivePromotion ? 'text-orange-600' : 'text-gray-900'}`}>
                          {plan.price_monthly === 0 ? 'Gratuit' : `${plan.price_monthly}€`}
                        </span>
                        {plan.price_monthly > 0 && (
                          <span className={`text-xs sm:text-sm lg:text-lg ${hasActivePromotion ? 'text-orange-500' : 'text-gray-600'}`}>/mois</span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4 sm:mb-6 lg:mb-8 space-y-2 sm:space-y-3 lg:space-y-4">
                      {plan.features && Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 sm:gap-2 lg:gap-3">
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-primary stroke-[3]" />
                          </div>
                          <span className="text-gray-700 text-[10px] sm:text-xs lg:text-sm leading-snug sm:leading-relaxed">{feature}</span>
                        </div>
                      ))}

                      {/* Max loyalty programs info */}
                      {plan.max_loyalty_programs && (
                        <div className="flex items-start gap-1.5 sm:gap-2 lg:gap-3 pt-2 sm:pt-3 lg:pt-4 mt-2 sm:mt-3 lg:mt-4 border-t border-gray-100">
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Zap className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-primary" />
                          </div>
                          <span className="text-gray-900 text-[10px] sm:text-xs lg:text-sm font-semibold">
                            Jusqu'à {plan.max_loyalty_programs} programmes de fidélité
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={isProPlan ? "#" : "/auth/signup"}
                      className={`w-full block text-center py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 text-[11px] sm:text-sm lg:text-base ${
                        isProPlan
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                          : isPremium
                          ? 'bg-gradient-to-r from-primary to-secondary text-white hover:bg-secondary hover:shadow-xl hover:scale-105 '
                          : 'bg-primary text-white hover:bg-secondary hover:shadow-xl hover:scale-105'
                      }`}
                    >
                      {plan.price_monthly === 0 ? 'Commencer gratuitement' : 'Devenir Pro'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ CTA Section */}
      <section className="py-6 sm:py-10 lg:py-16 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
              Questions sur les tarifs ?
            </h2>
            {/* <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Consultez notre FAQ ou contactez notre équipe pour en savoir plus
            </p> */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center">
              <Link
                href="/marketing/faq"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3.5 lg:py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold hover:bg-white hover:text-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm lg:text-lg"
              >
                <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span>Voir la FAQ</span>
              </Link>
              <Link
                href="/marketing/contact"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3.5 lg:py-5 bg-white text-primary rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm lg:text-lg"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span>Nous contacter</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
