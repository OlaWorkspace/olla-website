import Hero from "@/components/marketing/Hero";
import Section from "@/components/marketing/Section";
import { Zap, Lock, Gift, Smartphone, Store, TrendingUp, Users, Check, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="pt-6 sm:pt-10 lg:pt-16 pb-6 sm:pb-10 lg:pb-16 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section utilisateurs */}
          {/* <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Prêt à simplifier votre fidélité ?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Rejoignez des milliers d'utilisateurs qui ont déjà adopté Olla
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://apps.apple.com/app/olla"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary rounded-2xl font-semibold hover:bg-gray-50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>App Store</span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.olla"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-secondary text-white border-2 border-white rounded-2xl font-semibold hover:bg-white hover:text-primary hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span>Google Play</span>
              </a>
            </div>
          </div>
 */}
          {/* Séparateur */}
          {/* <div className="border-t border-white/20 my-16"></div> */}

          {/* Section commerçants */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6">
                <Store className="w-4 h-4" />
                <span>Pour les commerçants</span>
              </div> */}
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
                Fidélisez vos clients en toute simplicité
              </h2>
              <p className="text-xs sm:text-sm lg:text-xl text-blue-100 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                Rejoignez les centaines de commerces qui utilisent Olla pour booster leur fidélisation et augmenter leurs ventes.
              </p>
              <Link
                href="/become-pro"
                className="inline-flex items-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-white text-primary rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold text-xs sm:text-sm lg:text-base hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span>Devenir professionnel</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-4 lg:gap-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-4 lg:p-6 shadow-sm">
                <div className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center mb-1.5 sm:mb-3 lg:mb-4">
                  <TrendingUp className="w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                </div>
                <h3 className="text-[11px] sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-1.5 lg:mb-2">Augmentez vos ventes</h3>
                <p className="text-gray-600 text-[9px] sm:text-xs lg:text-sm leading-snug sm:leading-relaxed">
                  Les clients fidèles dépensent en moyenne 67% de plus
                </p>
              </div>
              <div className="bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-4 lg:p-6 shadow-sm">
                <div className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center mb-1.5 sm:mb-3 lg:mb-4">
                  <Users className="w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                </div>
                <h3 className="text-[11px] sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-1.5 lg:mb-2">Fidélisez facilement</h3>
                <p className="text-gray-600 text-[9px] sm:text-xs lg:text-sm leading-snug sm:leading-relaxed">
                  Interface simple et intuitive pour vos clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi choisir <span className="text-primary">Olla Fidelité</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une expérience de fidélité moderne, simple et sécurisée
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scan ultra-rapide</h3>
              <p className="text-gray-600 leading-relaxed">
                Collectez vos points en un instant avec notre technologie NFC et QR code optimisée.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sécurité maximale</h3>
              <p className="text-gray-600 leading-relaxed">
                Vos données sont chiffrées de bout en bout avec des QR codes éphémères.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Gift className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Récompenses exclusives</h3>
              <p className="text-gray-600 leading-relaxed">
                Débloquez des offres spéciales et profitez de réductions dans vos commerces préférés.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interface intuitive</h3>
              <p className="text-gray-600 leading-relaxed">
                Une app moderne et facile à utiliser, conçue pour tous les âges.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% gratuit</h3>
              <p className="text-gray-600 leading-relaxed">
                Aucun abonnement, aucune publicité. Profitez de toutes les fonctionnalités gratuitement.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-commerces</h3>
              <p className="text-gray-600 leading-relaxed">
                Gérez toutes vos cartes de fidélité au même endroit, sans limite.
              </p>
            </div>
          </div>
        </div>
      </section> */}

</>
  );
}
