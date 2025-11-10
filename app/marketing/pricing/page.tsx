import Section from "@/components/marketing/Section";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
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
      <Section className="!py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-text mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            Commencez gratuitement. Évoluez selon vos besoins.
          </p>
        </div>
      </Section>

      <Section className="!py-8">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isProPlan = plan.slug === 'pro';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${
                  isProPlan ? 'border-primary opacity-60' : 'border-border'
                }`}
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
                  <Link
                    href="/auth/signup"
                    className={`w-full block text-center py-3 rounded-lg font-semibold transition ${
                      isProPlan
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                        : 'bg-success text-white hover:bg-opacity-90'
                    }`}
                  >
                    Devenir Pro
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-text mb-4">Questions sur les tarifs ?</h3>
          <p className="text-text-light mb-6">
            Consultez notre FAQ ou contactez notre équipe
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/marketing/faq"
              className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-semibold"
            >
              Voir la FAQ
            </Link>
            <Link
              href="/marketing/contact"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
