import Link from "next/link";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20 text-center">
      {/* Main Title */}
      <h1 className="text-5xl md:text-6xl font-bold text-text mb-6 leading-tight">
        Olla — La fidélité{" "}
        <span className="text-success">sans carte</span>.
      </h1>

      <p className="text-xl text-text-light max-w-3xl mx-auto mb-10 leading-relaxed">
        Un seul système pour tous vos commerces : NFC, QR, avis Google et
        récompenses.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-20">
        <Link
          href="/auth/login"
          className="px-8 py-4 bg-success text-white rounded-lg hover:bg-opacity-90 transition inline-flex items-center justify-center gap-2 font-semibold"
        >
          Essayer maintenant
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/marketing/features"
          className="px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition inline-flex items-center justify-center gap-2 font-semibold"
        >
          Découvrir les fonctionnalités
        </Link>
      </div>

      {/* Trust Banner */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-20 border border-border">
        <p className="text-text-light font-semibold mb-4">Confiance de</p>
        <div className="flex justify-center gap-8 flex-wrap items-center">
          <div className="text-2xl font-bold text-text-light">Partenaire 1</div>
          <div className="text-2xl font-bold text-text-light">Partenaire 2</div>
          <div className="text-2xl font-bold text-text-light">Partenaire 3</div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md transition">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <Zap className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-xl font-bold text-text mb-3">
            Scan NFC/QR
          </h3>
          <p className="text-text-light">
            Vos clients cumulent des points en 1 seconde.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md transition">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-xl font-bold text-text mb-3">
            Avis Google intégrés
          </h3>
          <p className="text-text-light">
            Boostez votre visibilité instantanément.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md transition">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <Zap className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-xl font-bold text-text mb-3">
            Récompenses automatiques
          </h3>
          <p className="text-text-light">
            Fidélisez sans effort.
          </p>
        </div>
      </div>
    </section>
  );
}
