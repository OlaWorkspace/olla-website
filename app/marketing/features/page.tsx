import { type Metadata } from "next";
import { Zap, Smartphone, Shield, Gift, Users, BarChart3, QrCode, Star, Bell, Clock, Store, MapPinHouse } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Fonctionnalités — Olla",
  description: "Découvrez toutes les fonctionnalités d'Olla pour fidéliser vos clients.",
};

export default function FeaturesPage() {
  return (
    <>
      {/* Hero Section */}
      {/* <section className="relative bg-gradient-to-b from-white to-gray-50 overflow-hidden pt-8 pb-8"> */}
        {/* Decorative Elements */}
        {/* <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center  mx-auto">


            <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Tout ce qu'il vous faut pour <span className="text-primary">fidéliser vos clients</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Une solution complète, moderne et facile à utiliser pour gérer votre programme de fidélité en toute simplicité
            </p>
          </div>
        </div>
      </section> */}

      {/* Main Features Grid */}
      <section className="py-4 sm:py-6 lg:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-10 lg:mb-16">
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-2 leading-tight">
              Tout ce qu'il vous faut pour <span className="text-primary">fidéliser vos clients</span>
            </h1>
            <p className="text-xs sm:text-base lg:text-xl text-gray-600 leading-relaxed">
              Une solution complète, moderne et facile à utiliser pour gérer votre programme de fidélité en toute simplicité
            </p>
          </div>




          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8">

            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6">
                <Gift className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">Fidélité personnalisable</h3>
              <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base leading-snug sm:leading-relaxed">
                Choisissez les paliers, les récompenses, les conditions d'utilisation. Votre programme s'adapte à votre activité.
              </p>
            </div>

            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6">
                <Star className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">Avis Google intégrés</h3>
              <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base leading-snug sm:leading-relaxed">
                Vos clients peuvent vous un avis en un clic. Augmentez votre visibilité et votre réputation locale.              </p>
            </div>

            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6">
                <MapPinHouse className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">Réseau de commerce</h3>
              <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base leading-snug sm:leading-relaxed">
                Votre commerce apparaît dans Olla aux côtés de tous les autres membres du réseau. Les clients vous découvrent naturellement autour d'eux.
              </p>
            </div>

            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6">
                <Bell className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">Communiquez avec vos clients</h3>
              <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base leading-snug sm:leading-relaxed">
                Alertez vos clients au bon moment. Notifications push pour les nouvelles récompenses, offres spéciales et rappels.
              </p>
            </div>

            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">Statistiques en temps réel</h3>
              <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base leading-snug sm:leading-relaxed">
                Suivez vos visites, l'engagement, l'attribution des récompenses et les tendances en un coup d'œil.
              </p>
            </div>

            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">Configuration rapide</h3>
              <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base leading-snug sm:leading-relaxed">
                Lancez votre programme en moins de 5 minutes. Interface intuitive et assistance pour démarrer rapidement.
              </p>
            </div>

            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6">
                <QrCode className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">Scan NFC & QR Code</h3>
              <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base leading-snug sm:leading-relaxed">
                Vos clients cumulent des points instantanément avec un simple scan. Compatible NFC et QR code pour une expérience ultra-rapide.
              </p>
            </div>

            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">Multi-commerces</h3>
              <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base leading-snug sm:leading-relaxed">
                Gérez plusieurs points de vente depuis un seul tableau de bord. Centralisez toutes vos données et simplifiez la gestion.
              </p>
            </div>

            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6">
                <Shield className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">Sécurité maximale</h3>
              <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base leading-snug sm:leading-relaxed">
                Vos données et celles de vos clients sont chiffrées et protégées. QR codes éphémères pour une sécurité renforcée.
              </p>
            </div>







          </div>
        </div>
      </section>

      {/* Comment fonctionne la fidélité avec Olla */}
      <section className="hidden sm:block py-4 sm:py-8 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
            Comment fonctionne la fidélité avec Olla ?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-center">

            <div className="sm:col-span-2">

              <p className="text-[11px] sm:text-base lg:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                Une expérience simple, fluide et 100 % automatique.
              </p>

              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {/* Étape 1 */}
                <div>
                  <h3 className="font-bold text-gray-900 text-[11px] sm:text-sm lg:text-lg mb-1 sm:mb-1.5 lg:mb-2">
                    <span className="text-primary">1.</span> Le client découvre votre affiche
                  </h3>
                  <p className="text-gray-600 text-[10px] sm:text-xs lg:text-base leading-tight sm:leading-relaxed">
                    Une petite affiche NFC / QR code est placée à votre comptoir. Elle contient tout ce qu'il faut pour identifier votre commerce.
                  </p>
                </div>

                {/* Étape 2 */}
                <div>
                  <h3 className="font-bold text-gray-900 text-[11px] sm:text-sm lg:text-lg mb-1 sm:mb-1.5 lg:mb-2">
                    <span className="text-primary">2.</span> Il scanne ou approche son smartphone
                  </h3>
                  <p className="text-gray-600 text-[10px] sm:text-xs lg:text-base leading-tight sm:leading-relaxed">
                    En un geste, le client scanne le QR code ou approche son téléphone du sticker NFC. L'application reconnaît instantanément votre commerce.
                  </p>
                </div>

                {/* Étape 3 */}
                <div>
                  <h3 className="font-bold text-gray-900 text-[11px] sm:text-sm lg:text-lg mb-1 sm:mb-1.5 lg:mb-2">
                    <span className="text-primary">3.</span> Le point est ajouté automatiquement
                  </h3>
                  <p className="text-gray-600 text-[10px] sm:text-xs lg:text-base leading-tight sm:leading-relaxed">
                    Olla crédite directement 1 point sur le programme de fidélité du client. Aucun bouton, aucun terminal, aucune action à faire de votre côté.
                  </p>
                </div>

                {/* Étape 4 */}
                <div>
                  <h3 className="font-bold text-gray-900 text-[11px] sm:text-sm lg:text-lg mb-1 sm:mb-1.5 lg:mb-2">
                    <span className="text-primary">4.</span> La récompense se déclenche toute seule
                  </h3>
                  <p className="text-gray-600 text-[10px] sm:text-xs lg:text-base leading-tight sm:leading-relaxed">
                    Quand la jauge de fidélité est pleine, l'application génère un QR code que le commerçant scanne simplement pour valider la récompense. Le compteur se remet à zéro automatiquement.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-2xl lg:rounded-3xl overflow-hidden">
              <Image
                src="/icon.svg"
                alt="Affiche Olla Fidelite avec QR code et NFC"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-6 sm:py-10 lg:py-16 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
            Prêt à booster votre fidélisation ?
          </h2>
          <p className="text-xs sm:text-base lg:text-xl text-blue-100 mb-4 sm:mb-6 lg:mb-10 leading-relaxed">
            Rejoignez les commerces qui utilisent Olla pour fidéliser leurs clients et augmenter leurs ventes.
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white text-primary rounded-xl sm:rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm sm:text-base lg:text-lg"
          >
            <Store className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Espace pro</span>
          </a>
        </div>
      </section>
    </>
  );
}
