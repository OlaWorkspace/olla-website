export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white pb-12 sm:pb-16 lg:pb-20">
      {/* Hero Section */}
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Politique de confidentialite
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Olla Fidelite
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12"> */}

            {/* 1. Introduction */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Olla Fidelite est une application qui permet aux utilisateurs de regrouper leurs cartes de fidelite et de cumuler des points chez les commerces partenaires.
                </p>
                <p>
                  La protection des donnees personnelles est essentielle. Cette politique explique quelles informations sont collectees, comment elles sont utilisees et les droits dont vous disposez.
                </p>
              </div>
            </div>

            {/* 2. Donnees collectees */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Donnees collectees</h2>
              <p className="text-gray-700 mb-4">
                Nous collectons uniquement les informations necessaires au fonctionnement du service.
              </p>

              {/* 2.1 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Identifiants techniques</h3>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                  <li>Identifiant interne utilisateur (non nominatif)</li>
                  <li>Identifiant du commerce</li>
                  <li>Horodatage des scans</li>
                </ul>
              </div>

              {/* 2.2 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Donnees d&apos;usage</h3>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                  <li>Points de fidelite</li>
                  <li>Historique des passages</li>
                  <li>Recompenses obtenues</li>
                </ul>
              </div>

              {/* 2.3 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Donnees facultatives</h3>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                  <li>Avis laisses sur Google (via un lien externe, non gere par Olla)</li>
                </ul>
              </div>

              <p className="text-gray-700 font-medium mt-4">
                Nous ne collectons jamais vos contacts, photos, fichiers, localisation GPS ni aucune donnee sensible.
              </p>
            </div>

            {/* 3. Utilisation des donnees */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation des donnees</h2>
              <p className="text-gray-700 mb-2">Les donnees collectees sont utilisees pour :</p>
              <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                <li>Gerer vos points, cartes et recompenses</li>
                <li>Afficher votre historique d&apos;utilisation</li>
                <li>Produire des statistiques globales anonymisees pour les commercants</li>
                <li>Ameliorer le fonctionnement et la qualite du service</li>
              </ul>
              <p className="text-gray-700 font-medium mt-4">
                Nous ne revendons jamais vos donnees a des tiers.
              </p>
            </div>

            {/* 4. Partage des donnees */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Partage des donnees</h2>
              <p className="text-gray-700 mb-2">Vos informations ne sont partagees qu&apos;avec :</p>
              <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                <li>Les commercants partenaires, uniquement dans le cadre de la gestion de leurs programmes de fidelite</li>
                <li>Google, si vous choisissez de laisser un avis via un lien externe securise</li>
              </ul>
              <p className="text-gray-700 font-medium mt-4">
                Aucune donnee nominative n&apos;est transmise aux commercants.
              </p>
            </div>

            {/* 5. Vos droits (RGPD) */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Vos droits (RGPD)</h2>
              <p className="text-gray-700 mb-2">
                Conformement au Reglement General sur la Protection des Donnees (RGPD), vous pouvez a tout moment :
              </p>
              <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                <li>Demander l&apos;acces a vos donnees</li>
                <li>Demander leur rectification ou leur suppression</li>
                <li>Demander leur portabilite</li>
                <li>Limiter ou vous opposer a leur traitement</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Pour exercer vos droits : <span className="font-medium text-primary">support@olla.app</span>
              </p>
            </div>

            {/* 6. Conservation des donnees */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Conservation des donnees</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Vos donnees sont conservees tant que votre compte est actif.
                </p>
                <p>
                  En cas de suppression du compte, elles sont definitivement supprimees sous 30 jours.
                </p>
              </div>
            </div>

            {/* 7. Modifications */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifications</h2>
              <p className="text-gray-700 leading-relaxed">
                Cette politique peut etre mise a jour. La version la plus recente est toujours disponible sur l&apos;application et sur notre site.
              </p>
            </div>

            {/* 8. Contact */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact</h2>
              <p className="text-gray-700 mb-3">
                Pour toute question liee a la confidentialite ou a la gestion de vos donnees :
              </p>
              <p className="text-lg text-primary font-medium">
                support@olla.app
              </p>
              <p className="text-sm text-gray-500 mt-6">
                Derniere mise a jour : octobre 2025
              </p>
            </div>

          {/* </div> */}
        </div>
      </section>
    </main>
  );
}
