"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { createClient } from "@/lib/supabase/clients/browser";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmez votre mot de passe";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Erreur lors de l'inscription";
        if (errorMessage.includes('already registered') || errorMessage.includes('User already')) {
          setErrors(prev => ({ ...prev, email: 'Cet email est déjà enregistré' }));
        } else {
          setErrors(prev => ({ ...prev, email: errorMessage }));
        }
        setLoading(false);
        return;
      }

      // Connexion immédiate avec les identifiants
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      // Redirection vers onboarding/plan pour sélectionner le plan
      router.push("/onboarding/plan");

    } catch (error: any) {
      setErrors(prev => ({ ...prev, email: error.message || "Une erreur est survenue" }));
    } finally {
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
            <h1 className="text-3xl font-bold text-text mb-2">Devenir Pro</h1>
            <p className="text-text-light mb-8">
              Créez votre compte pour accéder à tous les outils de fidélisation.
            </p>

            {Object.keys(errors).some(key => errors[key as keyof FormErrors]) && (
              <div className="p-4 bg-error/10 border border-error text-error text-sm rounded-lg mb-6">
                {errors.email || errors.firstName || errors.lastName || errors.password || errors.confirmPassword}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Prénom et Nom sur la même ligne */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text font-semibold mb-2">
                    Prénom <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none disabled:bg-gray-50 ${
                      errors.firstName
                        ? "border-error focus:border-error"
                        : "border-border focus:border-primary"
                    }`}
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && (
                    <p className="text-error text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-text font-semibold mb-2">
                    Nom <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none disabled:bg-gray-50 ${
                      errors.lastName
                        ? "border-error focus:border-error"
                        : "border-border focus:border-primary"
                    }`}
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="text-error text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-text font-semibold mb-2">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none disabled:bg-gray-50 ${
                    errors.email
                      ? "border-error focus:border-error"
                      : "border-border focus:border-primary"
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-error text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-text font-semibold mb-2">
                  Mot de passe <span className="text-error">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none disabled:bg-gray-50 ${
                    errors.password
                      ? "border-error focus:border-error"
                      : "border-border focus:border-primary"
                  }`}
                  placeholder="••••••••"
                />
                {errors.password ? (
                  <p className="text-error text-xs mt-1">{errors.password}</p>
                ) : (
                  <p className="text-xs text-text-light mt-1">
                    Minimum 6 caractères
                  </p>
                )}
              </div>

              {/* Confirmer mot de passe */}
              <div>
                <label className="block text-text font-semibold mb-2">
                  Confirmer le mot de passe <span className="text-error">*</span>
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none disabled:bg-gray-50 ${
                    errors.confirmPassword
                      ? "border-error focus:border-error"
                      : "border-border focus:border-primary"
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-success text-white rounded-lg hover:bg-opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Inscription en cours..." : "Créer mon compte"}
              </button>
            </form>

            <p className="text-center text-text-light text-sm mt-6">
              Vous avez déjà un compte ?{" "}
              <Link href="/auth/login" className="text-primary hover:text-secondary transition font-semibold">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
