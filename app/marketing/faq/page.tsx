import Section from "@/components/marketing/Section";
import { type Metadata } from "next";

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
      <Section>
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-text mb-4">
            Questions fréquentes
          </h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur Olla.
          </p>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-border rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer"
              >
                <summary className="flex justify-between items-center font-semibold text-text">
                  {faq.question}
                  <span className="text-success group-open:rotate-180 transition">
                    ▼
                  </span>
                </summary>
                <p className="text-text-light mt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center bg-gray-50 rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-text mb-4">
            Vous n'avez pas trouvé votre réponse ?
          </h3>
          <p className="text-text-light mb-6">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter.
          </p>
          <a
            href="/marketing/contact"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
          >
            Nous contacter
          </a>
        </div>
      </Section>
    </>
  );
}
