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
      <section className="py-4 sm:py-6 lg:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">

            <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-2 leading-tight">
              Questions <span className="text-primary">fréquentes</span>
            </h1>
            <p className="text-xs sm:text-base lg:text-xl text-gray-600 max-w-7xl mx-auto leading-relaxed">
              Tout ce que vous devez savoir sur Olla pour démarrer en toute confiance
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300"
              >
                <summary className="flex justify-between items-center gap-2 sm:gap-3 lg:gap-4 p-3 sm:p-5 lg:p-8 cursor-pointer list-none">
                  <h3 className="text-xs sm:text-base lg:text-lg font-bold text-gray-900 flex-1">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-primary group-open:rotate-180 transition-transform duration-300 flex-shrink-0" />
                </summary>
                <div className="px-3 sm:px-5 lg:px-8 pb-3 sm:pb-5 lg:pb-8 pt-0">
                  <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base leading-snug sm:leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-6 sm:py-10 lg:py-16 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-xs sm:text-base lg:text-xl text-blue-100 mb-4 sm:mb-6 lg:mb-10 leading-relaxed">
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
            </p>
            <a
              href="/marketing/contact"
              className="inline-flex items-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3.5 lg:py-5 bg-white text-primary rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm lg:text-lg"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              <span>Nous contacter</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
