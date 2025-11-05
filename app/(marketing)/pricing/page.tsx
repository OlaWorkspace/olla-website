import Section from "@/components/section";
import { type Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Tarifs — Olla",
  description: "Plans de tarification simples et transparents pour votre commerce.",
};

export default function PricingPage() {
  return (
    <>
      <Section>
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-text mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            Commencez gratuitement. Évoluez selon vos besoins.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="border-2 border-border rounded-2xl p-8 hover:shadow-md transition">
            <h3 className="text-2xl font-bold text-text mb-2">Gratuit</h3>
            <p className="text-text-light mb-6">Beta — Accès illimité</p>

            <div className="mb-8">
              <p className="text-4xl font-bold text-primary mb-2">0€</p>
              <p className="text-text-light">Jusqu'à 1000 scans/mois</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text">Scan NFC/QR illimité</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text">Jusqu'à 1000 clients</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text">Support email</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text">Dashboard basique</span>
              </li>
            </ul>

            <Link
              href="/login"
              className="w-full block text-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
            >
              Se connecter
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-primary rounded-2xl p-8 hover:shadow-md transition relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-success text-white px-4 py-1 rounded-full text-sm font-semibold">
              À venir
            </div>

            <h3 className="text-2xl font-bold text-text mb-2">Pro</h3>
            <p className="text-text-light mb-6">Pour les commerces en croissance</p>

            <div className="mb-8">
              <p className="text-4xl font-bold text-primary mb-2">À définir</p>
              <p className="text-text-light">Scans illimités</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text">Tout du plan Gratuit</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text">Statistiques avancées</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text">Exports et rapports</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text">Multi-commerces</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text">Support prioritaire</span>
              </li>
            </ul>

            <button
              disabled
              className="w-full px-6 py-3 bg-gray-200 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
            >
              Bientôt disponible
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-text mb-4">Questions sur les tarifs ?</h3>
          <p className="text-text-light mb-6">
            Consultez notre FAQ ou contactez notre équipe
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/faq"
              className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-semibold"
            >
              Voir la FAQ
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
