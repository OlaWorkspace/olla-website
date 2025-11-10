import Hero from "@/components/marketing/Hero";
import Section from "@/components/marketing/Section";
import { Zap, Lock, Gift, Smartphone, Store, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />

      {/* CTA Section pour les commerçants */}
      <Section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 lg:p-16 border-2 border-emerald-100">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 font-medium text-sm mb-6">
                  <Store className="w-4 h-4" />
                  <span>Pour les commerçants</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Fidélisez vos clients en toute simplicité
                </h2>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Rejoignez les centaines de commerces qui utilisent Olla pour booster leur fidélisation et augmenter leurs ventes.
                </p>
                <Link
                  href="/become-pro"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Store className="w-5 h-5" />
                  <span>Devenir professionnel</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Augmentez vos ventes</h3>
                  <p className="text-gray-600 text-sm">
                    Les clients fidèles dépensent en moyenne 67% de plus que les nouveaux clients
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Fidélisez facilement</h3>
                  <p className="text-gray-600 text-sm">
                    Interface simple et intuitive. Vos clients adorent la facilité d'utilisation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section className="bg-gradient-to-br from-gray-50 to-white py-32">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Besoin d'aide ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Contactez notre équipe supportive par mail ou téléphone
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="mailto:support@ollafidelite.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-[#0052FF] text-[#0052FF] rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              support@ollafidelite.com
            </a>
            <a
              href="tel:+33652211352"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#0052FF] text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.92 7.02C19.45 8.18 20.7 9.95 21.19 12c.49 2.05.49 4.09 0 6.14-.52 2.06-1.77 3.84-3.27 5.02m-5.33-1.48c-1.66 0-3.21-.55-4.49-1.5-2.54-1.94-4.18-5.05-4.18-8.52s1.64-6.58 4.18-8.52c1.28-.95 2.83-1.5 4.49-1.5m5.31 1.35c-.88-1.19-2.08-2.21-3.46-2.9m-1.48 9.53c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2M3.5 9v6c0 .55.45 1 1 1h2v4h3v-4h2c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1h-7c-.55 0-1 .45-1 1z" />
              </svg>
              +33 652 211 352
            </a>
          </div>
        </div>
      </Section>

      {/* Final CTA Section - Même fond que le footer */}
      <section className="bg-gradient-to-br from-[#0052FF] to-blue-600 text-white py-24 px-4 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white opacity-5 rounded-full -mr-36 -mt-36"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-white opacity-5 rounded-full"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-8">
            <Gift className="w-4 h-4" />
            <span>Téléchargement gratuit</span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            Prêt à simplifier votre fidélité ?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Téléchargez Olla maintenant et ne perdez plus jamais vos points de fidélité. Rejoignez des milliers d'utilisateurs satisfaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://apps.apple.com/app/olla"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#0052FF] rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-[#0052FF]/70">Télécharger sur</div>
                <div className="text-lg font-bold">App Store</div>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.olla"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#0052FF] rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-[#0052FF]/70">Télécharger sur</div>
                <div className="text-lg font-bold">Google Play</div>
              </div>
            </a>
          </div>
          <p className="text-blue-200 text-sm">
            Installation gratuite • Sans publicité • Disponible sur iOS et Android
          </p>
        </div>
      </section>
    </>
  );
}
