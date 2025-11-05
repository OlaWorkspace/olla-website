import { ChevronDown } from "lucide-react";

export default function AidePage() {
  const faqs = [
    {
      question: "Comment créer mon premier commerce ?",
      answer:
        "Accédez à la page Shop depuis la barre latérale, cliquez sur 'Ajouter un commerce' et remplissez les informations de base de votre entreprise.",
    },
    {
      question: "Comment ajouter des produits ?",
      answer:
        "Depuis la page Shop, cliquez sur 'Ajouter un produit', puis configurez le nom, la description, le prix et les paramètres de fidélité.",
    },
    {
      question: "Quel est le coût de la plateforme ?",
      answer:
        "Consultez la page Abonnements pour voir tous nos plans tarifaires. Vous pouvez commencer avec le plan Starter et évoluer selon vos besoins.",
    },
    {
      question: "Comment gérer les clients ?",
      answer:
        "Les clients sont automatiquement créés lors de leur première interaction avec votre code de fidélité (NFC/QR). Vous pouvez les gérer depuis votre dashboard.",
    },
    {
      question: "Comment accorder des récompenses ?",
      answer:
        "Configurez les règles de récompense dans les paramètres de votre commerce. Les clients accumulent automatiquement les points selon leurs achats.",
    },
    {
      question: "Quel support est proposé ?",
      answer:
        "Nous proposons un support email pour le plan Starter, prioritaire pour le plan Professional, et 24/7 pour le plan Enterprise.",
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Aide
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Trouvez les réponses à vos questions
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group bg-white rounded-lg shadow cursor-pointer"
          >
            <summary className="flex items-center justify-between p-6 font-semibold text-slate-900">
              {faq.question}
              <ChevronDown size={20} className="group-open:rotate-180 transition" />
            </summary>
            <div className="px-6 pb-6 pt-0 text-slate-600 border-t border-slate-200">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Besoin de plus d'aide ?</h2>
        <p className="text-slate-700 mb-4">
          Consultez notre documentation complète ou contactez notre équipe de support.
        </p>
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition">
            Voir la documentation
          </button>
          <button className="border border-blue-600 hover:bg-blue-50 text-blue-600 font-semibold px-6 py-2 rounded-lg transition">
            Contacter le support
          </button>
        </div>
      </div>
    </div>
  );
}
