"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { createClient } from "@/lib/supabase/clients/browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Utilisateur connecté, vérifier son rôle
          const { data: userData } = await supabase
            .from('users')
            .select('pro, admin')
            .eq('auth_id', user.id)
            .single();

          if (userData) {
            if (userData.admin) {
              router.push('/admin');
            } else if (userData.pro) {
              router.push('/pro');
            } else {
              router.push('/');
            }
          }
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

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

      // Rediriger vers l'espace admin si l'utilisateur est admin
      if (data.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/pro");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Une erreur s'est produite");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);

    try {
      if (!resetEmail) {
        setResetError("Veuillez entrer votre adresse email");
        setResetLoading(false);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setResetSuccess(true);
      setResetEmail("");
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Erreur lors de l'envoi de l'email");
    } finally {
      setResetLoading(false);
    }
  };

  // Afficher un écran de chargement pendant la vérification
  if (checkingSession) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border rounded-full border-t-primary animate-spin mx-auto mb-4" />
            <p className="text-text-light">Vérification de la session...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-primary hover:text-secondary text-sm transition"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <p className="text-center text-text-light text-sm mt-6">
              Pas encore de compte ?{" "}
              <Link href="/auth/signup" className="text-primary hover:text-secondary font-semibold">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Modal Mot de passe oublié */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text">Mot de passe oublié</h3>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                  setResetError(null);
                  setResetSuccess(false);
                }}
                className="text-text-light hover:text-text"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {resetSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-center">
                  Un email de réinitialisation a été envoyé à votre adresse. Vérifiez votre boîte de réception.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSuccess(false);
                  }}
                  className="w-full mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <p className="text-text-light mb-4">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                {resetError && (
                  <div className="p-3 bg-error/10 border border-error text-error text-sm rounded-lg mb-4">
                    {resetError}
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-text font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      disabled={resetLoading}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail("");
                        setResetError(null);
                      }}
                      className="flex-1 border border-border hover:bg-gray-50 text-text font-semibold px-4 py-2 rounded-lg transition"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 bg-primary hover:bg-secondary text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resetLoading ? "Envoi..." : "Envoyer"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
