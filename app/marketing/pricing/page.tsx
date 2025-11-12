import Link from "next/link";
import { Check, Zap, CreditCard, HelpCircle, MessageCircle, Star, Sparkles } from "lucide-react";
import type { Plan } from '@/types';

// Plans en dur basés sur la base de données
const HARDCODED_PLANS: Plan[] = [
  {
    id: '779a7603-9750-4a86-90b7-702125fcafd8',
    name: 'Gratuit',
    slug: 'free',
    description: 'Pour débuter avec les cartes de fidélité',
    price_monthly: 0,
    features: [
      'Carte de fidélité',
      'Apparaître sur la map de l\'app'
    ],
    max_loyalty_programs: 1,
    display_order: 1
  },
  {
    id: 'b44f0e35-de72-42ba-ac4c-9bf77b20aeac',
    name: 'Premium',
    slug: 'premium',
    description: 'Pour les commerces qui veulent aller plus loin',
    price_monthly: 14.99,
    features: [
      'Carte de fidélité',
      'Apparaître sur la map de l\'app',
      'Lien avec avis google',
      'Personnalisation programme de fidélité à paliers',
      'Statistiques simples'
    ],
    max_loyalty_programs: null,
    display_order: 2
  },
  {
    id: '81708212-b75a-4f9c-9420-b9a38238c01e',
    name: 'Pro',
    slug: 'pro',
    description: 'Pour les professionnels exigeants (bientôt disponible)',
    price_monthly: 39.96,
    features: [
      'Carte de fidélité',
      'Apparaître sur la map de l\'app',
      'Lien avec avis google',
      'Personnalisation programme de fidélité à paliers',
      'Statistiques avancées',
      'Support prioritaire',
      'API access'
    ],
    max_loyalty_programs: null,
    display_order: 3
  }
];

export default function PricingPage() {
  const plans = HARDCODED_PLANS;

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

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-lg sm:rounded-2xl lg:rounded-3xl border transition-all duration-300 ${
                    isProPlan
                      ? 'border-gray-200 opacity-60'
                      : isPremium
                      ? 'border-primary shadow-xl sm:scale-105'
                      : 'border-gray-100 hover:border-primary hover:shadow-xl'
                  }`}
                >
                  {/* Badge "Populaire" for Premium */}
                  {isPremium && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-primary to-secondary text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-lg">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Populaire
                      </span>
                    </div>
                  )}

                  {/* Badge "Soon" for Pro plan */}
                  {isProPlan && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-semibold rounded-full">
                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Bientôt disponible
                      </span>
                    </div>
                  )}

                  <div className="p-4 sm:p-6 lg:p-8">
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
                        <span className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900">
                          {plan.price_monthly === 0 ? 'Gratuit' : `${plan.price_monthly}€`}
                        </span>
                        {plan.price_monthly > 0 && (
                          <span className="text-gray-600 text-xs sm:text-sm lg:text-lg">/mois</span>
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
