export default function CguPage() {
  return (
    <main className="min-h-screen bg-white pb-12 sm:pb-16 lg:pb-20">
      {/* Hero Section */}
      <section className=" ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Conditions Generales d&apos;Utilisation (CGU)
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Olla Fidelite
          </p>
        </div>
      {/* </section>

      <section className="py-8 sm:py-12"> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

            {/* 1. Introduction */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Bienvenue sur Olla Fidelite.
                </p>
                <p>
                  En utilisant l&apos;application ou les services associes, vous acceptez les presentes Conditions Generales d&apos;Utilisation et reconnaissez avoir pris connaissance de notre Politique de confidentialite.
                </p>
                <p>
                  Ces documents expliquent les regles d&apos;utilisation de la plateforme, vos responsabilites en tant qu&apos;utilisateur, ainsi que la maniere dont nous traitons et protegeons vos donnees personnelles.
                </p>
              </div>
            </div>

            {/* 2. CGU */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Conditions Generales d&apos;Utilisation</h2>

              {/* 2.1 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Objet</h3>
                <div className="space-y-3 text-gray-700 leading-relaxed">
                  <p>
                    Olla Fidelite permet de regrouper et gerer l&apos;ensemble de vos programmes de fidelite a l&apos;aide de stickers NFC et QR codes.
                  </p>
                  <p>
                    Le systeme enregistre vos passages chez les commercants partenaires et vous permet d&apos;obtenir les recompenses qu&apos;ils proposent.
                  </p>
                </div>
              </div>

              {/* 2.2 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Acces et utilisation</h3>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                  <li>La creation d&apos;un compte personnel est obligatoire pour utiliser l&apos;application.</li>
                  <li>Vous etes responsable de la confidentialite de vos identifiants et de l&apos;activite realisee depuis votre compte.</li>
                  <li>L&apos;usage de l&apos;application doit rester strictement personnel et non frauduleux.</li>
                </ul>
              </div>

              {/* 2.3 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Programmes de fidelite et recompenses</h3>
                <div className="space-y-3 text-gray-700 leading-relaxed">
                  <p>
                    Chaque commerce definit librement son programme de fidelite : nombre de points, regles d&apos;obtention, recompenses.
                  </p>
                  <p>
                    Olla Fidelite fournit uniquement la technologie permettant d&apos;automatiser ces programmes et ne garantit pas la disponibilite, la valeur ou la qualite des recompenses proposees par les commercants.
                  </p>
                </div>
              </div>

              {/* 2.4 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Limitations de responsabilite</h3>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                  <li>Olla Fidelite n&apos;est pas responsable des interruptions de service liees a des problemes techniques, de maintenance, ou a des perturbations reseau.</li>
                  <li>Olla Fidelite n&apos;est pas responsable du contenu des avis Google ni des offres ou informations communiquees par les commercants partenaires.</li>
                </ul>
              </div>

              {/* 2.5 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.5 Modifications et resiliation</h3>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                  <li>Nous pouvons mettre a jour les CGU a tout moment, avec information prealable aux utilisateurs.</li>
                  <li>Vous pouvez supprimer votre compte a tout moment depuis l&apos;application ou en nous contactant par email.</li>
                </ul>
              </div>
            </div>

            {/* 3. Politique de confidentialite */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Politique de confidentialite</h2>

              {/* 3.1 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Donnees collectees</h3>
                <p className="text-gray-700 mb-2">Nous collectons uniquement les informations necessaires au fonctionnement du service :</p>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                  <li><span className="font-medium">Identifiants de compte :</span> nom, prenom, e-mail</li>
                  <li><span className="font-medium">Donnees d&apos;utilisation :</span> passages, points cumules, commerces visites, recompenses obtenues</li>
                  <li><span className="font-medium">Informations techniques :</span> modele d&apos;appareil, systeme d&apos;exploitation, journaux techniques</li>
                </ul>
              </div>

              {/* 3.2 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Finalite du traitement</h3>
                <p className="text-gray-700 mb-2">Vos donnees sont utilisees pour :</p>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                  <li>Gerer vos programmes de fidelite</li>
                  <li>Assurer le bon fonctionnement et la securite de l&apos;application</li>
                  <li>Produire des statistiques anonymisees pour les commercants partenaires</li>
                </ul>
              </div>

              {/* 3.3 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Partage des donnees</h3>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                  <li>Nous ne revendons jamais vos donnees.</li>
                  <li>Les commercants n&apos;ont acces qu&apos;a des statistiques globales, jamais nominatives.</li>
                  <li>Les avis Google sont envoyes directement sur les services de Google ; Olla n&apos;a pas acces a leur contenu.</li>
                </ul>
              </div>

              {/* 3.4 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Duree de conservation</h3>
                <div className="space-y-2 text-gray-700 leading-relaxed">
                  <p>
                    Les donnees sont conservees tant que votre compte est actif.
                  </p>
                  <p>
                    Vous pouvez demander leur suppression definitive en contactant notre support.
                  </p>
                </div>
              </div>

              {/* 3.5 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.5 Securite</h3>
                <p className="text-gray-700 leading-relaxed">
                  Nous appliquons des mesures de securite techniques et organisationnelles : chiffrement, gestion stricte des acces, serveurs proteges.
                </p>
              </div>

              {/* 3.6 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.6 Vos droits (RGPD)</h3>
                <p className="text-gray-700 mb-2">Vous pouvez, a tout moment :</p>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside ml-2">
                  <li>Acceder a vos donnees</li>
                  <li>Les modifier ou les supprimer</li>
                  <li>Limiter ou vous opposer a leur traitement</li>
                  <li>Demander leur portabilite</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  Vous pouvez exercer ces droits en nous contactant.
                </p>
              </div>
            </div>

            {/* 4. Contact */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Contact</h2>
              <p className="text-gray-700 mb-3">
                Pour toute question concernant les CGU ou la Politique de confidentialite :
              </p>
              <p className="text-lg text-primary font-medium">
                support@ollafidelite.com
              </p>
              <p className="text-sm text-gray-500 mt-6">
                Derniere mise a jour : octobre 2025
              </p>
            </div>


        </div>
      </section>
    </main>
  );
}
