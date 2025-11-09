"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, UserPlus, Mail, Lock } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

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
      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8 pb-16 ">
        <div className="w-full max-w-md">
          {/* Back Button */}

          {/* Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-10">
            <div className="text-center mb-8">

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Connectez vous
              </h1>
              <p className="text-gray-600">
                Accédez à votre espace professionnel
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-2xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-secondary hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                <LogIn className="w-5 h-5" />
                <span>{loading ? "Connexion en cours..." : "Se connecter"}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Pas encore inscrit ?</span>
              </div>
            </div>

            {/* Sign up CTA */}
            <Link
              href="/auth/signup"
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-100 hover:border-primary hover:text-primary transition-all duration-300"
            >
              <UserPlus className="w-5 h-5" />
              <span>Créer un compte professionnel</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
