"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Zap, TrendingUp } from "lucide-react";
import Header from "@/components/common/Header";
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
      <main className="min-h-screen bg-white">
        {/* Container Principal */}
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text hover:text-primary mb-8 transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>

          {/* Grid: 2 colonnes sur desktop, 1 sur mobile */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-stretch">

            {/* COLONNE GAUCHE: Bénéfices et contexte */}
            <div className="flex flex-col justify-center">
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 leading-tight">
                  Fidélisez vos clients sans effort
                </h1>
                <p className="text-base md:text-lg text-text-light leading-relaxed">
                  Un seul système. NFC, QR codes, avis Google et récompenses automatisées.
                </p>
              </div>

              {/* 3 Bénéfices Clés */}
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Zap className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text text-base mb-1">Simple & rapide</h3>
                    <p className="text-sm text-text-light">Points en une seconde avec NFC ou QR code</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text text-base mb-1">Automatisé</h3>
                    <p className="text-sm text-text-light">Récompenses et avis Google sans intervention</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text text-base mb-1">Résultats</h3>
                    <p className="text-sm text-text-light">Fidélisation réelle mesurable</p>
                  </div>
                </div>
              </div>

              {/* Stat ou Trust Signal */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-text-light mb-2">Pour les pros</p>
                <p className="text-2xl font-bold text-text">Zéro config technique</p>
              </div>
            </div>

            {/* COLONNE DROITE: Formulaire */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-text mb-2">Créer mon compte</h2>
                <p className="text-text-light text-sm mb-6">
                  Gratuit, 2 minutes
                </p>

                {Object.keys(errors).some(key => errors[key as keyof FormErrors]) && (
                  <div className="p-4 bg-error/10 border border-error text-error text-sm rounded-lg mb-6">
                    {errors.email || errors.firstName || errors.lastName || errors.password || errors.confirmPassword}
                  </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Prénom et Nom */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        disabled={loading}
                        className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none transition disabled:bg-white ${
                          errors.firstName
                            ? "border-error focus:border-error"
                            : "border-border focus:border-primary"
                        }`}
                        placeholder="Prénom"
                        autoComplete="given-name"
                      />
                      {errors.firstName && (
                        <p className="text-error text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        disabled={loading}
                        className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none transition disabled:bg-white ${
                          errors.lastName
                            ? "border-error focus:border-error"
                            : "border-border focus:border-primary"
                        }`}
                        placeholder="Nom"
                        autoComplete="family-name"
                      />
                      {errors.lastName && (
                        <p className="text-error text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      disabled={loading}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none transition disabled:bg-white ${
                        errors.email
                          ? "border-error focus:border-error"
                          : "border-border focus:border-primary"
                      }`}
                      placeholder="votre@email.com"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="text-error text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Mot de passe */}
                  <div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      disabled={loading}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none transition disabled:bg-white ${
                        errors.password
                          ? "border-error focus:border-error"
                          : "border-border focus:border-primary"
                      }`}
                      placeholder="Min. 6 caractères"
                      autoComplete="new-password"
                    />
                    {errors.password && (
                      <p className="text-error text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirmer mot de passe */}
                  <div>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      disabled={loading}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none transition disabled:bg-white ${
                        errors.confirmPassword
                          ? "border-error focus:border-error"
                          : "border-border focus:border-primary"
                      }`}
                      placeholder="Confirmer"
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-success hover:bg-opacity-90 text-white rounded-lg transition font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? "Création..." : "Créer mon compte"}
                  </button>
                </form>

                <p className="text-center text-text-light text-sm mt-6">
                  Vous avez un compte ?{" "}
                  <Link href="/auth/login" className="text-primary hover:text-secondary transition font-semibold">
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
