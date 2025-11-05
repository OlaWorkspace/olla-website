import Hero from "@/components/hero";
import Section from "@/components/section";
import FeatureCard from "@/components/feature-card";
import { Zap, CheckCircle, Award } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Detailed Features Section */}
      <Section className="bg-gray-50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text mb-4">
            Pourquoi Olla ?
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Les meilleures fonctionnalités pour transformer vos clients en
            fidèles ambassadeurs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-success" />}
            title="Scan Instantané"
            description="NFC ou QR code. Vos clients gagnent des points en moins d'une seconde, sans friction."
          />
          <FeatureCard
            icon={<CheckCircle className="w-6 h-6 text-success" />}
            title="Avis Intégrés"
            description="Connectez automatiquement à Google. Boostez votre visibilité et votre réputation."
          />
          <FeatureCard
            icon={<Award className="w-6 h-6 text-success" />}
            title="Récompenses Smart"
            description="Système automatisé de récompenses. Vos clients restent engagés sans effort."
          />
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="text-center">
        <div className="bg-primary text-white rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">Prêt à fidéliser vos clients ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les commerces qui utilisent Olla pour transformer leurs
            clients en fidèles.
          </p>
          <a
            href="/login"
            className="inline-block px-8 py-4 bg-success text-white rounded-lg hover:bg-opacity-90 transition font-semibold"
          >
            Essayer maintenant
          </a>
        </div>
      </Section>
    </>
  );
}
