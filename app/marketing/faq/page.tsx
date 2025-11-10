import { type Metadata } from "next";
import { HelpCircle, MessageCircle, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ — Olla",
  description: "Questions fréquemment posées sur Olla.",
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Comment fonctionne le système de scan ?",
    answer:
      "Vos clients scannent un code NFC ou QR à chaque visite. Le scan est automatiquement enregistré dans leur profil et les points sont crédités instantanément.",
  },
  {
    question: "Mes clients ont-ils besoin d'une application ?",
    answer:
      "Non ! Le système fonctionne entièrement web. Les clients accèdent à leur profil via un lien simple, sans télécharger d'application.",
  },
  {
    question: "Comment gérer mes points et récompenses ?",
    answer:
      "Vous configurez les règles une fois dans le tableau de bord. Les points sont automatiquement appliqués, et les récompenses sont déclenchées quand les conditions sont remplies.",
  },
  {
    question: "Comment s'intègre l'avis Google ?",
    answer:
      "Olla se connecte à votre compte Google Business. Après une transaction, vos clients peuvent laisser un avis directement depuis leur profil.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui, 100%. Nous utilisons Supabase avec chiffrement end-to-end. Vos données et celles de vos clients sont protégées conformément aux normes RGPD.",
  },
  {
    question: "Puis-je gérer plusieurs commerces ?",
    answer:
      "Oui ! Le plan Pro permet de gérer plusieurs points de vente depuis un seul tableau de bord centralisé.",
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">

            <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 mb-2 leading-tight">
              Questions <span className="text-primary">fréquentes</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-7xl mx-auto leading-relaxed">
              Tout ce que vous devez savoir sur Olla pour démarrer en toute confiance
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300"
              >
                <summary className="flex justify-between items-center gap-4 p-8 cursor-pointer list-none">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform duration-300 flex-shrink-0" />
                </summary>
                <div className="px-8 pb-8 pt-0">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-7xl lg:text-5xl font-bold text-white mb-6">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
            </p>
            <a
              href="/marketing/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Nous contacter</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
