"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, UserPlus, Mail, Lock } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { supabase } from "@/lib/supabase/clients/browser";
import { getOnboardingPath, setOnboardingStatus } from "@/lib/utils/onboarding";
import { OnboardingStatus } from "@/types";

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
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Utilisateur connecté, vérifier son rôle
          const { data: userData } = await supabase
            .from('users')
            .select('pro, admin, onboarding_status')
            .eq('auth_id', session.user.id)
            .single();

          if (userData) {
            if (userData.admin) {
              router.push('/admin');
            } else if (userData.pro) {
              // Sync onboarding status to localStorage
              const status = userData.onboarding_status as OnboardingStatus;
              setOnboardingStatus(status);

              // Gérer l'onboarding
              if (status !== 'completed') {
                router.push(getOnboardingPath(status));
              } else {
                router.push('/pro');
              }
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

      // Connexion directe côté client via localStorage
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!data.user) throw new Error('No user returned');

      console.log("✅ Connecté:", data.user.email);

      // Vérifier le rôle de l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('pro, admin, onboarding_status')
        .eq('auth_id', data.user.id)
        .single();

      if (userError) throw userError;

      // Vérifier que l'utilisateur est pro ou admin
      if (!userData.pro && !userData.admin) {
        await supabase.auth.signOut();
        throw new Error('Cet espace est réservé aux professionnels');
      }

      // Sync onboarding status to localStorage
      const status = userData.onboarding_status as OnboardingStatus;
      setOnboardingStatus(status);

      // Redirection basée sur le rôle et l'état d'onboarding
      if (userData.admin) {
        router.push('/admin');
      } else if (userData.pro) {
        if (status !== 'completed') {
          router.push(getOnboardingPath(status));
        } else {
          router.push('/pro');
        }
      }
    } catch (err) {
      console.error("❌ Erreur de connexion:", err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
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
      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-4 sm:py-6 lg:py-8 pb-8 sm:pb-12 lg:pb-16">
        <div className="w-full max-w-md">
          {/* Back Button */}

          {/* Card */}
          <div className="bg-white rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-1.5 lg:mb-2">
                Connectez vous
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Accédez à votre espace professionnel
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div>
                <label className="block text-gray-900 font-semibold mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-lg sm:rounded-2xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-primary text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold text-xs sm:text-sm lg:text-base hover:bg-secondary hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span>{loading ? "Connexion en cours..." : "Se connecter"}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 sm:my-6 lg:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-white text-gray-500">Pas encore inscrit ?</span>
              </div>
            </div>

            {/* Sign up CTA */}
            <Link
              href="/auth/signup"
              className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold text-xs sm:text-sm lg:text-base hover:bg-gray-100 hover:border-primary hover:text-primary transition-all duration-300"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              <span>Créer un compte professionnel</span>
            </Link>
            <div className="mt-3 sm:mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-primary hover:text-secondary text-xs sm:text-sm transition"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* <p className="text-center text-text-light text-xs sm:text-sm mt-4 sm:mt-6">
              Pas encore de compte ?{" "}
              <Link href="/auth/signup" className="text-primary hover:text-secondary font-semibold">
                S'inscrire
              </Link>
            </p> */}
          </div>
        </div>
      </main>

      {/* Modal Mot de passe oublié */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-xl font-bold text-text">Mot de passe oublié</h3>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                  setResetError(null);
                  setResetSuccess(false);
                }}
                className="text-text-light hover:text-text"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {resetSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <p className="text-green-800 text-center text-xs sm:text-sm">
                  Un email de réinitialisation a été envoyé à votre adresse. Vérifiez votre boîte de réception.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSuccess(false);
                  }}
                  className="w-full mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold text-xs sm:text-sm"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <p className="text-text-light mb-3 sm:mb-4 text-xs sm:text-sm">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                {resetError && (
                  <div className="p-2.5 sm:p-3 bg-error/10 border border-error text-error text-xs sm:text-sm rounded-lg mb-3 sm:mb-4">
                    {resetError}
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-text font-semibold mb-1.5 sm:mb-2 text-xs sm:text-sm">
                      Email
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      disabled={resetLoading}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50 text-xs sm:text-sm"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail("");
                        setResetError(null);
                      }}
                      className="flex-1 border border-border hover:bg-gray-50 text-text font-semibold px-3 sm:px-4 py-2 rounded-lg transition text-xs sm:text-sm"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 bg-primary hover:bg-secondary text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
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
