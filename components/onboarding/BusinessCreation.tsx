// components/onboarding/BusinessCreation.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';
import { useOnboardingGuard } from '@/lib/hooks/useOnboardingGuard';
import { setOnboardingStatus } from '@/lib/utils/onboarding';
import AddressAutocomplete from './AddressAutocomplete';
import { CATEGORY_OPTIONS, getCategoryKey, getCategoryDisplay } from '@/lib/constants';

interface FormData {
  businessName: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  website: string;
  category: string;
  openingHours: string;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export default function BusinessCreation() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { selectedPlan, setBusinessData } = useOnboarding();
  const { callFunction } = useEdgeFunction();
  const { isChecking, isAuthorized } = useOnboardingGuard();

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    address: '',
    latitude: null,
    longitude: null,
    phone: '',
    website: '',
    category: '',
    openingHours: ''
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Debug: Log authentication state
    console.log('🔍 BusinessCreation - Auth state:', {
      authLoading,
      hasUser: !!user,
      hasUserProfile: !!userProfile,
      userId: userProfile?.id,
      authId: user?.id
    });

    try {
      // Validation
      if (!formData.businessName.trim()) {
        showToast('error', 'Le nom du commerce est requis');
        setLoading(false);
        return;
      }

      if (!formData.address.trim()) {
        showToast('error', 'L\'adresse est requise');
        setLoading(false);
        return;
      }

      if (!formData.phone.trim()) {
        showToast('error', 'Le téléphone est requis');
        setLoading(false);
        return;
      }

      if (!formData.category) {
        showToast('error', 'La catégorie est requise');
        setLoading(false);
        return;
      }

      // Attendre que l'authentification soit chargée
      if (authLoading) {
        showToast('error', 'Chargement en cours, veuillez patienter...');
        setLoading(false);
        return;
      }

      if (!user || !userProfile) {
        showToast('error', 'Utilisateur non authentifié');
        setLoading(false);
        return;
      }

      // Vérifier qu'un plan a été sélectionné
      if (!selectedPlan) {
        showToast('error', 'Veuillez sélectionner un plan avant de créer votre commerce');
        setLoading(false);
        return;
      }

      // Sauvegarder les données du commerce dans le contexte
      setBusinessData(formData);

      // Préparer les données pour l'envoi API (sans les icônes, seulement la clé)
      const apiFormData = {
        ...formData,
        category: getCategoryKey(formData.category)
      };

      // Save progress to database
      const { error: saveError } = await callFunction('web-save-onboarding-progress', {
        userId: userProfile.id,
        authId: user.id,
        step: 'business_info',
        data: {
          businessData: apiFormData,
          selectedPlan: selectedPlan // Keep plan data in case they return
        }
      });

      if (saveError) {
        console.error('Error saving business data:', saveError);
        // Continue anyway - data is in context
      }

      // Save status to localStorage for instant access on next visit
      setOnboardingStatus('business_info');

      showToast('success', 'Informations enregistrées! Redirection...');
      setTimeout(() => {
        router.push('/onboarding/loyalty');
        router.refresh(); // Force Next.js to refetch and re-render
      }, 1500);

    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Erreur inconnue');
      // Save to localStorage even if API fails
      setOnboardingStatus('business_info');
      setLoading(false);
    }
  };

  // Calculate progress
  const filledFields = [
    formData.businessName,
    formData.address,
    formData.phone,
    formData.category
  ].filter(Boolean).length;
  const progressPercent = (filledFields / 4) * 100;

  // Show loader while checking authorization
  if (isChecking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border rounded-full border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-text-light">Vérification...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authorized (will redirect)
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-8 transition text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-semibold text-text">Étape 3/5</h2>
          <span className="text-xs text-text-light">{filledFields}/4</span>
        </div>
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-success transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text mb-2 leading-tight">
          Configurez votre commerce
        </h1>
        <p className="text-text-light text-sm">
          Quelques infos pour la confiance client.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="block text-text font-semibold text-sm mb-1.5 flex items-center gap-2">
              Nom du commerce <span className="text-error">*</span>
              {formData.businessName && <CheckCircle2 className="w-4 h-4 text-success" />}
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50 transition"
              placeholder="Ex: La Boutique du Centre"
              autoComplete="organization"
            />
            {!formData.businessName && (
              <p className="text-xs text-text-light mt-1 flex items-start gap-1.5">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Vrai nom = confiance client
              </p>
            )}
          </div>

          {/* Address with Autocomplete */}
          <div>
            <label className="block text-text font-semibold text-sm mb-1.5 flex items-center gap-2">
              Adresse <span className="text-error">*</span>
              {formData.address && <CheckCircle2 className="w-4 h-4 text-success" />}
            </label>
            <AddressAutocomplete
              value={formData.address}
              onSelectAddress={(address, latitude, longitude) => {
                setFormData(prev => ({ ...prev, address, latitude, longitude }));
              }}
              placeholder="Ex: 123 Rue de la Paix, 75000 Paris"
              disabled={loading}
            />
            {!formData.address && (
              <p className="text-xs text-text-light mt-1 flex items-start gap-1.5">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Visible sur votre fiche Olla
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-text font-semibold text-sm mb-1.5 flex items-center gap-2">
              Téléphone <span className="text-error">*</span>
              {formData.phone && <CheckCircle2 className="w-4 h-4 text-success" />}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50 transition"
              placeholder="Ex: 01 23 45 67 89"
              autoComplete="tel"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-text font-semibold text-sm mb-1.5 flex items-center gap-2">
              Votre secteur <span className="text-error">*</span>
              {formData.category && <CheckCircle2 className="w-4 h-4 text-success" />}
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50 transition"
            >
              <option value="">Sélectionner une catégorie</option>
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat.key} value={cat.key}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Website (Optional) */}
          <div className="pt-3 border-t border-border">
            <label className="block text-text font-semibold text-xs mb-1.5">
              Site web <span className="text-text-light">(optionnel)</span>
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50 transition"
              placeholder="https://monsite.fr"
              autoComplete="url"
            />
          </div>

          {/* Toast */}
          {toast && (
            <div
              className={`p-4 rounded-lg text-sm font-medium flex items-start gap-3 ${
                toast.type === 'success'
                  ? 'bg-success/10 text-success border border-success'
                  : 'bg-error/10 text-error border border-error'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              {toast.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || authLoading || !formData.businessName || !formData.address || !formData.phone || !formData.category}
            className="w-full px-6 py-2.5 bg-success hover:bg-opacity-90 disabled:bg-gray-300 text-white text-sm rounded-lg transition font-semibold disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {authLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Chargement...
              </>
            ) : loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : progressPercent === 100 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Créer mon commerce
              </>
            ) : (
              'Complétez tous les champs'
            )}
          </button>
        </form>
      </div>

      {/* Plan Info Card */}
      {selectedPlan && (
        <div className="mt-4 p-4 bg-primary/5 border border-primary rounded-lg">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-text-light">Plan</p>
              <p className="text-sm font-bold text-text">
                {selectedPlan.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-light">
                {selectedPlan.price_monthly === 0 ? (
                  'Gratuit'
                ) : (
                  <>
                    {(selectedPlan.price_monthly / 100).toFixed(2).replace('.', ',')}€/mois
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => router.back()}
                className="text-xs text-primary hover:text-secondary font-semibold"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
