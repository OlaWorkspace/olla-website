"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        setError("Veuillez remplir email et mot de passe.");
        setLoading(false);
        return;
      }

      // Appelle la route API pour faire la connexion côté serveur
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de la connexion");
        setLoading(false);
        return;
      }

      console.log("✅ Connecté:", data.user?.email);
      router.push("/pro");
    } catch (err) {
      console.error("Erreur:", err);
      setError("Une erreur s'est produite");
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          {/* Card */}
          <div className="border border-border rounded-2xl p-8 bg-white">
            <h1 className="text-3xl font-bold text-text mb-2">Se connecter</h1>
            <p className="text-text-light mb-8">
              Entrez vos identifiants pour accéder à votre espace.
            </p>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-text font-semibold mb-2">
                  Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-text font-semibold mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-3 bg-error/10 border border-error text-error text-sm rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p className="text-center text-text-light text-sm mt-6">
              Pas encore de compte ? Contactez l'administrateur.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
