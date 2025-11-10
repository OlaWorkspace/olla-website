import Section from "@/components/marketing/Section";
import FeatureCard from "@/components/marketing/FeatureCard";
import { type Metadata } from "next";
import { Zap, CheckCircle, Award, BarChart3, Share2, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Fonctionnalités — Olla",
  description: "Découvrez toutes les fonctionnalités d'Olla pour fidéliser vos clients.",
};

export default function FeaturesPage() {
  return (
    <>
      <Section>
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-text mb-4">
            Des fonctionnalités puissantes
          </h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            Tout ce qu'il faut pour gérer la fidélité de vos clients en un
            seul endroit.
          </p>
        </div>
      </Section>

      {/* Core Features */}
      <Section className="bg-gray-50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text mb-4">Fonctionnalités principales</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-success" />}
            title="Scan NFC/QR"
            description="Système de points instantané. Vos clients cumulent des points en 1 seconde."
          />
          <FeatureCard
            icon={<CheckCircle className="w-6 h-6 text-success" />}
            title="Avis Google"
            description="Intégration automatique avec Google. Boostez votre visibilité."
          />
          <FeatureCard
            icon={<Award className="w-6 h-6 text-success" />}
            title="Récompenses"
            description="Système automatisé de récompenses personnalisées."
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-success" />}
            title="Analytics"
            description="Suivi en temps réel de vos données. Comprenez vos clients."
          />
          <FeatureCard
            icon={<Share2 className="w-6 h-6 text-success" />}
            title="Multi-commerces"
            description="Gérez plusieurs points de vente depuis un seul tableau de bord."
          />
          <FeatureCard
            icon={<Lock className="w-6 h-6 text-success" />}
            title="Sécurité"
            description="Vos données et celles de vos clients sont protégées."
          />
        </div>
      </Section>

      {/* Detailed Sections */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-text mb-4">
              Système de points flexible
            </h2>
            <p className="text-text-light mb-4">
              Personnalisez le système de points selon vos besoins. Configurez
              les seuils, les récompenses, et les périodes de validité.
            </p>
            <ul className="space-y-2 text-text">
              <li>✓ Points personnalisables</li>
              <li>✓ Récompenses variables</li>
              <li>✓ Conditions flexibles</li>
            </ul>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8 h-64 flex items-center justify-center">
            <p className="text-text-light">Visuel ici</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-100 rounded-2xl p-8 h-64 flex items-center justify-center">
            <p className="text-text-light">Visuel ici</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-text mb-4">
              Tableau de bord intuitif
            </h2>
            <p className="text-text-light mb-4">
              Accédez à toutes vos données en un coup d'œil. Suivi des clients,
              des transactions, des tendances.
            </p>
            <ul className="space-y-2 text-text">
              <li>✓ Vue d'ensemble claire</li>
              <li>✓ Rapports détaillés</li>
              <li>✓ Exportations faciles</li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
