"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, Mail, Lock, User, CheckCircle2, CreditCard, Building2, Gift } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { supabase } from "@/lib/supabase/clients/browser";
import { useEdgeFunction } from "@/lib/supabase/hooks/useEdgeFunction";
import { getOnboardingStatus, getOnboardingPath, setOnboardingStatus } from "@/lib/utils/onboarding";

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
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get('token');
  const { callFunction } = useEdgeFunction();

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
      // Déterminer si on crée un compte pro ou normal selon la présence du token
      const signUpData: any = {
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      };

      // Si pas de token, on crée un compte pro
      if (!invitationToken) {
        signUpData.options.data.pro = true;
      }

      // Inscription directe côté client via localStorage
      const { data, error: signUpError } = await supabase.auth.signUp(signUpData);

      if (signUpError) {
        console.error('❌ Signup error:', signUpError);
        if (signUpError.message.includes('already registered') || signUpError.message.includes('User already')) {
          setErrors(prev => ({ ...prev, email: 'Cet email est déjà enregistré' }));
        } else {
          setErrors(prev => ({ ...prev, email: signUpError.message }));
        }
        setLoading(false);
        return;
      }

      if (!data.user) {
        setErrors(prev => ({ ...prev, email: 'Erreur lors de la création du compte' }));
        setLoading(false);
        return;
      }

      console.log('✅ Inscription réussie:', data.user.email);

      // Connexion immédiate avec les identifiants (si email confirmation n'est pas requise)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.log('⚠️ Auto sign-in failed (email confirmation may be required):', signInError);
        // Si la confirmation email est requise, rediriger vers une page d'information
        setErrors(prev => ({
          ...prev,
          email: 'Compte créé ! Vérifiez votre email pour confirmer votre inscription.'
        }));
        setLoading(false);
        return;
      }

      // Si un token d'invitation est présent
      if (invitationToken) {
        try {
          console.log('📨 Accepting invitation with token...');

          // Attendre que le record users soit créé en base (trigger)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Récupérer le record users créé par le trigger
          const { data: userRecord, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('auth_id', data.user.id)
            .single();

          if (userError || !userRecord) {
            throw new Error('Impossible de récupérer le profil utilisateur');
          }

          const { data: acceptData, error: acceptError } = await callFunction(
            'accept-staff-invitation',
            {
              token: invitationToken,
              userId: userRecord.id,
              authId: data.user.id,
            }
          );

          if (acceptError) {
            throw new Error(acceptError);
          }

          if (acceptData?.data?.businessId) {
            console.log('✅ Invitation accepted, redirecting to dashboard');
            // Sync onboarding status to localStorage for staff members
            setOnboardingStatus('completed');
            router.push(`/pro/dashboard?businessId=${acceptData.data.businessId}`);
            return;
          }
        } catch (inviteErr) {
          console.error('❌ Error accepting invitation:', inviteErr);
          setErrors(prev => ({
            ...prev,
            email: inviteErr instanceof Error ? inviteErr.message : 'Erreur lors de l\'acceptation de l\'invitation'
          }));
          setLoading(false);
          return;
        }
      }

      // Flux normal (sans token d'invitation)
      // Check if user has an existing onboarding status and redirect accordingly
      const onboardingStatus = getOnboardingStatus();
      const redirectPath = getOnboardingPath(onboardingStatus);

      console.log('📍 Redirecting to:', redirectPath, '(status:', onboardingStatus, ')');
      router.push(redirectPath);

    } catch (error: any) {
      console.error('❌ Exception during signup:', error);
      setErrors(prev => ({ ...prev, email: error.message || "Une erreur est survenue" }));
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Container Principal */}
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 lg:py-12">

          {/* Grid: 2 colonnes sur desktop, 1 sur mobile */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-start">

            {/* COLONNE GAUCHE: Bénéfices et contexte - Cachée sur mobile */}
            <div className="hidden md:flex flex-col justify-center md:sticky md:top-8 md:pr-8 lg:pr-12">
              {/* En-tête avec titre allégé */}
              <div className="mb-12 lg:mb-8">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-2 leading-tight">
                  Fidélisez vos clients <span className="text-primary">sans effort</span>
                </h1>
                <p className="text-base lg:text-lg text-gray-500 leading-relaxed">
                  En 4 étapes simples
                </p>
              </div>

              {/* Processus d'inscription simplifié */}
              <div className="space-y-6 lg:space-y-8">
                {/* <div className="flex items-center gap-3 mb-6 lg:mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
                  <h2 className="text-base lg:text-lg font-semibold text-gray-400 uppercase tracking-wider">
                    En 4 étapes simples
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-l from-primary/20 to-transparent"></div>
                </div> */}

                {/* Étape 1 */}
                <div className="flex gap-4 group hover:translate-x-1 transition-transform duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <p className="text-xl lg:text-3xl font-bold text-gray-900 text-primary">
                        1
                      </p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base lg:text-lg mb-2">
                      Informations personnelles
                    </h3>
                    <p className="text-gray-500 text-sm lg:text-base leading-relaxed">
                      Créez votre espace en quelques clics
                    </p>
                  </div>
                </div>

                {/* Étape 2 */}
                <div className="flex gap-4 group hover:translate-x-1 transition-transform duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <p className="text-xl lg:text-3xl font-bold text-gray-900 text-primary">
                        2
                      </p>                    
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base lg:text-lg mb-2">
                      Formule d'abonnement
                    </h3>
                    <p className="text-gray-500 text-sm lg:text-base leading-relaxed">
                      Choisissez le plan adapté à vos besoins
                    </p>
                  </div>
                </div>

                {/* Étape 3 */}
                <div className="flex gap-4 group hover:translate-x-1 transition-transform duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <p className="text-xl lg:text-3xl font-bold text-gray-900 text-primary">
                        3
                      </p>                    
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base lg:text-lg mb-2">
                      Informations du commerce
                    </h3>
                    <p className="text-gray-500 text-sm lg:text-base leading-relaxed">
                      Présentez votre établissement
                    </p>
                  </div>
                </div>

                {/* Étape 4 */}
                <div className="flex gap-4 group hover:translate-x-1 transition-transform duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <p className="text-xl lg:text-3xl font-bold text-gray-900 text-primary">
                        4
                      </p>                    
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base lg:text-lg mb-2">
                      Programme de fidélité
                    </h3>
                    <p className="text-gray-500 text-sm lg:text-base leading-relaxed">
                      Définissez vos récompenses
                    </p>
                  </div>
                </div>
              </div>

              {/* Stat ou Trust Signal - Visible sur desktop */}
              <div className="hidden md:block mt-8 pt-6 lg:pt-8 border-t border-gray-200">
                <p className="text-xl lg:text-3xl font-bold text-gray-900">
                  Faites partie du réseau <span className="text-primary">Olla Fidelite</span>
                </p>
                <p className="text-sm lg:text-base text-gray-500 mt-2">
                  Apparaissez sur la carte aux côtés des autres commerces et laissez les clients vous découvrir naturellement.
                </p>
              </div>
            </div>

            {/* COLONNE DROITE: Formulaire */}
            <div>
              <div className="bg-white rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6 lg:p-8 xl:p-10">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-1.5 lg:mb-2">Créer mon compte</h2>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-8">
                  En 3 minutes
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
                  href={invitationToken ? `/auth/login?token=${invitationToken}` : "/auth/login"}
                  className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold text-xs sm:text-sm lg:text-base hover:bg-gray-100 hover:border-primary hover:text-primary transition-all duration-300"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>

          {/* Processus d'inscription - Visible uniquement sur mobile */}
          <div className="md:hidden mt-8 sm:mt-12">
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">
                Créez votre compte en quelques minutes
              </h2>

              {/* Étape 1 */}
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">
                  <span className="text-primary">1.</span> Renseignez vos informations personnelles
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Saisissez votre identifiant, mot de passe, prénom et nom pour créer votre espace sécurisé.
                </p>
              </div>

              {/* Étape 2 */}
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">
                  <span className="text-primary">2.</span> Choisissez votre formule d'abonnement
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sélectionnez le plan qui correspond le mieux à vos besoins et à la taille de votre commerce.
                </p>
              </div>

              {/* Étape 3 */}
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">
                  <span className="text-primary">3.</span> Complétez les informations de votre établissement
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Indiquez le nom du commerce, son adresse, son numéro de téléphone et son secteur d'activité.
                </p>
              </div>

              {/* Étape 4 */}
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">
                  <span className="text-primary">4.</span> Configurez votre programme de fidélité
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Définissez le nombre de points nécessaires, les récompenses offertes et les éventuels paliers pour vos clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
