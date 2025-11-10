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
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">

            <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 mb-2 leading-tight">
              Tarifs <span className="text-primary">simples et transparents</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Commencez gratuitement. Évoluez selon vos besoins.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 my-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const isProPlan = plan.slug === 'pro';
              const isPremium = plan.slug === 'premium';

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl border transition-all duration-300 ${
                    isProPlan
                      ? 'border-gray-200 opacity-60'
                      : isPremium
                      ? 'border-primary shadow-xl scale-105'
                      : 'border-gray-100 hover:border-primary hover:shadow-xl'
                  }`}
                >
                  {/* Badge "Populaire" for Premium */}
                  {isPremium && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold rounded-full shadow-lg">
                        <Star className="w-3 h-3" />
                        Populaire
                      </span>
                    </div>
                  )}

                  {/* Badge "Soon" for Pro plan */}
                  {isProPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Bientôt disponible
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="mb-8 pb-8 border-b border-gray-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-gray-900">
                          {plan.price_monthly === 0 ? 'Gratuit' : `${plan.price_monthly}€`}
                        </span>
                        {plan.price_monthly > 0 && (
                          <span className="text-gray-600 text-lg">/mois</span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-8 space-y-4">
                      {plan.features && Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary stroke-[3]" />
                          </div>
                          <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                        </div>
                      ))}

                      {/* Max loyalty programs info */}
                      {plan.max_loyalty_programs && (
                        <div className="flex items-start gap-3 pt-4 mt-4 border-t border-gray-100">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Zap className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-gray-900 text-sm font-semibold">
                            Jusqu'à {plan.max_loyalty_programs} programmes de fidélité
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={isProPlan ? "#" : "/auth/signup"}
                      className={`w-full block text-center py-4 rounded-2xl font-semibold transition-all duration-300 ${
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
      <section className="py-16 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Questions sur les tarifs ?
            </h2>
            {/* <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Consultez notre FAQ ou contactez notre équipe pour en savoir plus
            </p> */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketing/faq"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Voir la FAQ</span>
              </Link>
              <Link
                href="/marketing/contact"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Nous contacter</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
