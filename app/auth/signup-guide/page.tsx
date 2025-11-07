"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Zap, TrendingUp, Smartphone, Gauge, Gift, BarChart3 } from "lucide-react";
import Header from "@/components/common/Header";

export default function SignupGuidePage() {
  const steps = [
    {
      number: "1",
      title: "Inscrivez-vous en 2 minutes",
      description: "Email, nom et mot de passe. C'est tout ce que nous demandons pour commencer.",
      icon: <Smartphone className="w-6 h-6" />,
      details: ["Accès immédiat au dashboard", "Sans carte bancaire"]
    },
    {
      number: "2",
      title: "Configurez votre commerce",
      description: "Ajoutez votre nom, votre adresse et votre branche d'activité. Configuration facile en 3 clics.",
      icon: <Gauge className="w-6 h-6" />,
      details: ["Choix du secteur (restaurant, coiffeur, etc.)", "Logo et couleurs personnalisés"]
    },
    {
      number: "3",
      title: "Choisissez votre plan",
      description: "Starter (gratuit), Pro ou Premium. Payez seulement pour ce dont vous avez besoin.",
      icon: <Gift className="w-6 h-6" />,
      details: ["Plan Starter : jusqu'à 100 clients", "Plans Pro/Premium : illimités avec plus de stats"]
    },
    {
      number: "4",
      title: "Paramétrez votre programme",
      description: "Points nécessaires, récompenses, notifications. Vous contrôlez tout.",
      icon: <TrendingUp className="w-6 h-6" />,
      details: ["10 points = 1 café offert (par exemple)", "Notifications automatiques aux clients"]
    },
    {
      number: "5",
      title: "Activez NFC ou QR code",
      description: "Distribuez des stickers NFC ou affichez un QR code. Vos clients scannent et gagnent des points.",
      icon: <Zap className="w-6 h-6" />,
      details: ["Impression du matériel marketing inclus", "Scans instantanés, aucun délai"]
    },
    {
      number: "6",
      title: "Suivez vos résultats",
      description: "Dashboard en temps réel : passages, points collectés, récompenses données. Tout est automatisé.",
      icon: <BarChart3 className="w-6 h-6" />,
      details: ["Stats simples pour débuter", "Stats avancées en plan Pro/Premium"]
    }
  ];

  const benefits = [
    {
      title: "Pour vos clients",
      items: [
        "Un seul app pour toutes les fidélités",
        "Points gagnés instantanément",
        "Récompenses claires et attrayantes",
        "Avis Google proposés automatiquement"
      ]
    },
    {
      title: "Pour votre commerce",
      items: [
        "Fidélisation réelle et mesurable",
        "Avis Google augmentés (+40% en moyenne)",
        "Clients qui reviennent plus souvent",
        "Zéro intervention technique"
      ]
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text hover:text-primary mb-12 transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>

          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 leading-tight">
              De zéro à héros en 6 étapes
            </h1>
            <p className="text-lg text-text-light max-w-2xl">
              Comment passer de l'inscription à vos premiers clients fidélisés. Guide complet A-Z.
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="mb-20">
            {steps.map((step, index) => (
              <div key={index} className="mb-12 md:mb-16 flex gap-6 md:gap-10">
                {/* Ligne verticale */}
                {index !== steps.length - 1 && (
                  <div className="hidden md:block relative">
                    <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-border"></div>
                  </div>
                )}

                {/* Dernière étape sans ligne */}
                {index === steps.length - 1 && (
                  <div className="hidden md:block">
                    <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center font-bold flex-shrink-0">
                      {step.number}
                    </div>
                  </div>
                )}

                {/* Mobile: numéro en haut */}
                <div className="md:hidden">
                  <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step.number}
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 pb-8 md:pb-0">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-success p-3 bg-success/10 rounded-lg hidden sm:block">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-text mb-2">
                        {step.title}
                      </h3>
                      <p className="text-text-light mb-4">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text">
                            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bénéfices section */}
          <div className="grid md:grid-cols-2 gap-12 mb-20 py-12 border-t border-b border-border">
            {benefits.map((benefit, index) => (
              <div key={index}>
                <h3 className="text-2xl font-bold text-text mb-6">
                  {benefit.title}
                </h3>
                <ul className="space-y-3">
                  {benefit.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ Mini */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-text mb-10">Questions fréquentes</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-text mb-2">Combien ça coûte vraiment ?</h4>
                <p className="text-text-light">
                  Le plan Starter est gratuit jusqu'à 100 clients. Pro à 29€/mois pour illimité + stats avancées. Premium à 99€/mois avec support prioritaire et parrainage.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-text mb-2">Comment mes clients commencent ?</h4>
                <p className="text-text-light">
                  Ils téléchargent Olla, scannent votre NFC ou QR code en magasin, et gagnent leurs premiers points immédiatement.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-text mb-2">Je dois avoir du matériel special ?</h4>
                <p className="text-text-light">
                  Non. Soit vous affichez un QR code (gratuit), soit vous utilisez des stickers NFC (quelques euros à imprimer). Tout fonctionne avec des smartphones normaux.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-text mb-2">Et après l'inscription ?</h4>
                <p className="text-text-light">
                  Vous êtes directement dans le dashboard. Configurez votre premier programme en 5 minutes, imprimez/affichez votre QR code, et commencez à fidéliser dès demain.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-success/10 border border-success rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-text mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-lg text-text-light mb-8 max-w-2xl mx-auto">
              L'inscription prend 2 minutes. Installation gratuite en Starter. Aucun engagement.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-3 bg-success hover:bg-opacity-90 text-white rounded-lg transition font-semibold text-lg"
            >
              Créer mon compte maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
