"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Header from "@/components/common/Header";

export default function BecomeProPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white flex items-center">
        <div className="max-w-4xl mx-auto px-4 py-12 w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 leading-tight">
              Devenez professionnel Olla
            </h1>
            <p className="text-xl text-text-light max-w-2xl mx-auto">
              Fidélisez vos clients sans effort. Deux minutes pour commencer.
            </p>
          </div>

          {/* Two Options Grid */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Option 1: Guide complet */}
            <Link
              href="/auth/signup-guide"
              className="group border-2 border-border rounded-2xl p-8 md:p-10 hover:border-primary transition hover:bg-primary/5"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text mb-2">Lire le guide complet</h3>
                  <p className="text-sm text-text-light">
                    Vous voulez comprendre en détail comment fonctionne Olla avant de vous inscrire
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm text-text-light flex items-center gap-2">
                  ✓ Explications étape par étape
                </p>
                <p className="text-sm text-text-light flex items-center gap-2">
                  ✓ Cas d'usage réels
                </p>
                <p className="text-sm text-text-light flex items-center gap-2">
                  ✓ Questions fréquentes
                </p>
              </div>

              <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                Consulter le guide
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>

            {/* Option 2: S'inscrire directement */}
            <Link
              href="/auth/signup"
              className="group border-2 border-success rounded-2xl p-8 md:p-10 hover:border-opacity-80 transition bg-success/5 hover:bg-success/10"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-success/20 rounded-lg group-hover:bg-success/30 transition">
                  <ArrowRight className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text mb-2">Je suis prêt, créer mon compte</h3>
                  <p className="text-sm text-text-light">
                    Vous avez compris, inscrivez-vous immédiatement et découvrez le dashboard
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm text-text-light flex items-center gap-2">
                  ✓ Inscription en 2 minutes
                </p>
                <p className="text-sm text-text-light flex items-center gap-2">
                  ✓ Plan gratuit pour débuter
                </p>
                <p className="text-sm text-text-light flex items-center gap-2">
                  ✓ Aucune carte bancaire requise
                </p>
              </div>

              <div className="flex items-center gap-2 text-success font-semibold group-hover:gap-3 transition-all">
                Créer mon compte
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>

          {/* Trust signal */}
          <div className="mt-16 text-center pt-12 border-t border-border">
            <p className="text-sm text-text-light mb-4">Utilisé par les meilleurs commerces</p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <span className="text-xs font-semibold text-text px-3 py-1 bg-gray-50 rounded-full">
                🏪 Restaurants
              </span>
              <span className="text-xs font-semibold text-text px-3 py-1 bg-gray-50 rounded-full">
                💇 Coiffeurs
              </span>
              <span className="text-xs font-semibold text-text px-3 py-1 bg-gray-50 rounded-full">
                ☕ Cafés
              </span>
              <span className="text-xs font-semibold text-text px-3 py-1 bg-gray-50 rounded-full">
                🛍️ Boutiques
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
