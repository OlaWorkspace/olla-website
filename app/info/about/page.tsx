import Link from "next/link";
import { Heart, Shield, Users, Zap, CheckCircle, Store } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section - Compact */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 relative z-10">
          <div className="text-center mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              A propos de <span className="text-primary">Olla Fidelite</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mx-auto">
              Une seule solution. Programme de fidelite automatique, avis Google et suivi en temps reel.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section - Compact Grid */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Value 1 */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Simplicite</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tout se fait en un geste.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Fiabilite</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Un systeme automatise, sans erreur ni oubli.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Accessibilite</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Adapte a tous types de commerces.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Proximite</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Une technologie au service du commerce local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-6 sm:py-8 lg:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4 sm:space-y-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Notre mission</h2>

            <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              <p>
                Chez Olla Fidelite, nous voulons rendre la fidelite <span className="font-semibold text-gray-900">simple, automatique et universelle</span>.
              </p>

              <p>
                Notre application remplace toutes les cartes papier et toutes les applis separees par un seul systeme intelligent.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section - Full Width like homepage */}
      <section className="py-10 sm:py-12 lg:py-16 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6">
              Rejoignez Olla Fidelite
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les commerces qui utilisent Olla Fidelite pour fideliser leurs clients et augmenter leurs ventes.
            </p>

            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-white text-primary rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Store className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Devenir professionnel</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
