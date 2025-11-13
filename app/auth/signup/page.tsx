"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Zap, TrendingUp, UserPlus, Mail, Lock, User } from "lucide-react";
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
      <main className="min-h-screen">
        {/* Container Principal */}
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 lg:py-12">

          {/* Grid: 2 colonnes sur desktop, 1 sur mobile */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-start">

            {/* COLONNE GAUCHE: Bénéfices et contexte - Cachée sur mobile */}
            <div className="hidden md:flex flex-col justify-center md:sticky md:top-8">
              <div className="mb-8 lg:mb-12">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 lg:mb-4 leading-tight">
                  Fidélisez vos clients <span className="text-primary">sans effort</span>
                </h1>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                  Une seule solution. Programme de fidélité automatique, avis Google et suivi en temps réel.
                </p>
              </div>

              {/* 3 Bénéfices Clés */}
              <div className="space-y-4 lg:space-y-6">
                <div className="flex gap-3 lg:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-0.5 lg:mb-1">Installation express</h3>
                    <p className="text-gray-600 text-sm lg:text-base">Un scan, un point. Simple, immédiat.</p>
                  </div>
                </div>

                <div className="flex gap-3 lg:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-0.5 lg:mb-1">Automatisé</h3>
                    <p className="text-gray-600 text-sm lg:text-base">Récompenses et avis gérés automatiquement.</p>
                  </div>
                </div>

                <div className="flex gap-3 lg:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-0.5 lg:mb-1">Impact concret</h3>
                    <p className="text-gray-600 text-sm lg:text-base">Plus de visites, plus d'habitués. Ça se voit dans les chiffres.</p>
                  </div>
                </div>
              </div>

              {/* Stat ou Trust Signal */}
              <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
                <p className="text-xl lg:text-2xl font-bold text-gray-900">Faites partie du réseau <span className="text-primary">Olla Fidelite</span> </p>
                <p className="text-xs lg:text-sm text-gray-500 mt-2">Apparaissez sur la carte aux côtés des autres commerces et laissez les clients vous découvrir naturellement.</p>
              </div>
            </div>

            {/* COLONNE DROITE: Formulaire */}
            <div>
              <div className="bg-white rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6 lg:p-8 xl:p-10">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-1.5 lg:mb-2">Créer mon compte</h2>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-8">
                  Gratuit, sans engagement • 2 minutes
                </p>

                {Object.keys(errors).some(key => errors[key as keyof FormErrors]) && (
                  <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-lg sm:rounded-2xl mb-4 sm:mb-6">
                    {errors.email || errors.firstName || errors.lastName || errors.password || errors.confirmPassword}
                  </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4 lg:space-y-5">
                  {/* Prénom et Nom - En colonne sur mobile, en ligne sur desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base">
                        Prénom
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => updateFormData("firstName", e.target.value)}
                          disabled={loading}
                          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 border rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                            errors.firstName
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200 focus:border-primary focus:ring-primary/20"
                          }`}
                          placeholder="Jean"
                          autoComplete="given-name"
                          required
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-600 text-xs mt-1 sm:mt-1.5">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-900 font-semibold mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base">
                        Nom
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => updateFormData("lastName", e.target.value)}
                          disabled={loading}
                          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 border rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                            errors.lastName
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200 focus:border-primary focus:ring-primary/20"
                          }`}
                          placeholder="Dupont"
                          autoComplete="family-name"
                          required
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-600 text-xs mt-1 sm:mt-1.5">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base">
                      Email professionnel
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        disabled={loading}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 border rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                          errors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-200 focus:border-primary focus:ring-primary/20"
                        }`}
                        placeholder="votre@email.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1 sm:mt-1.5">{errors.email}</p>
                    )}
                  </div>

                  {/* Mot de passe */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        disabled={loading}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 border rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                          errors.password
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-200 focus:border-primary focus:ring-primary/20"
                        }`}
                        placeholder="Minimum 6 caractères"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-xs mt-1 sm:mt-1.5">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirmer mot de passe */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        disabled={loading}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 border rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                          errors.confirmPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-200 focus:border-primary focus:ring-primary/20"
                        }`}
                        placeholder="Confirmez votre mot de passe"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-xs mt-1 sm:mt-1.5">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-primary text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold text-xs sm:text-sm lg:text-base hover:bg-secondary hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none mt-4 sm:mt-5 lg:mt-6"
                  >
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span>{loading ? "Création en cours..." : "Créer mon compte professionnel"}</span>
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-4 sm:my-6 lg:my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="px-3 sm:px-4 bg-white text-gray-500">Déjà inscrit ?</span>
                  </div>
                </div>

                {/* Login Link */}
                <Link
                  href="/auth/login"
                  className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold text-xs sm:text-sm lg:text-base hover:bg-gray-100 hover:border-primary hover:text-primary transition-all duration-300"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
