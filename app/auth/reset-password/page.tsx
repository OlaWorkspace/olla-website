"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { supabase } from "@/lib/supabase/clients/browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a un token de réinitialisation valide
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError("Lien de réinitialisation invalide ou expiré");
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!newPassword || !confirmPassword) {
        setError("Veuillez remplir tous les champs");
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess(true);

      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la réinitialisation");
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
            href="/auth/login"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>

          {/* Card */}
          <div className="border border-border rounded-2xl p-8 bg-white">
            <h1 className="text-3xl font-bold text-text mb-2">
              Réinitialiser le mot de passe
            </h1>
            <p className="text-text-light mb-8">
              Entrez votre nouveau mot de passe.
            </p>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-center font-medium">
                  Mot de passe réinitialisé avec succès ! Redirection vers la page de connexion...
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-text font-semibold mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50"
                    placeholder="Minimum 6 caractères"
                  />
                </div>

                <div>
                  <label className="block text-text font-semibold mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50"
                    placeholder="Ressaisissez le mot de passe"
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
                  {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
