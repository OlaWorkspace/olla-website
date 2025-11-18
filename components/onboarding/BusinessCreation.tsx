// components/onboarding/BusinessCreation.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, Lightbulb, Info } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';
import { setOnboardingStatus } from '@/lib/utils/onboarding';
import AddressAutocomplete from './AddressAutocomplete';
import OpeningHoursInput from './OpeningHoursInput';
import { CATEGORY_OPTIONS, getCategoryKey, getCategoryDisplay } from '@/lib/constants';
import { formatPhoneNumber, displayPhoneNumber } from '@/lib/utils/phoneValidation';

interface FormData {
  businessName: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  website: string;
  category: string;
  openingHours: any;
  googleReviewLink: string;
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

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    address: '',
    latitude: null,
    longitude: null,
    phone: '',
    website: '',
    category: '',
    openingHours: null,
    googleReviewLink: ''
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showGoogleHelp, setShowGoogleHelp] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, phone: value }));

    // Valider le téléphone en temps réel si l'utilisateur a commencé à taper
    if (value.trim().length > 0) {
      const validation = formatPhoneNumber(value);
      if (!validation.isValid) {
        setPhoneError(validation.error || 'Format invalide');
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  };

  const handlePhoneBlur = () => {
    // Formater automatiquement au blur
    if (formData.phone.trim().length > 0) {
      const validation = formatPhoneNumber(formData.phone);
      if (validation.isValid) {
        setFormData(prev => ({ ...prev, phone: validation.formatted }));
        setPhoneError('');
      }
    }
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

      // Valider le format du téléphone
      const phoneValidation = formatPhoneNumber(formData.phone);
      if (!phoneValidation.isValid) {
        showToast('error', phoneValidation.error || 'Le format du téléphone est invalide');
        setPhoneError(phoneValidation.error || 'Format invalide');
        setLoading(false);
        return;
      }

      // Utiliser le numéro formaté pour l'envoi
      const formattedPhone = phoneValidation.formatted;

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

      // Vérifier qu'un plan a été sélectionné (ordre d'onboarding)
      if (!selectedPlan) {
        showToast('error', 'Vous devez d\'abord sélectionner un plan');
        setTimeout(() => {
          router.push('/onboarding/plan');
        }, 2000);
        setLoading(false);
        return;
      }

      // Sauvegarder les données du commerce dans le contexte (avec le numéro formaté)
      const formDataWithFormattedPhone = {
        ...formData,
        phone: formattedPhone
      };
      setBusinessData(formDataWithFormattedPhone);

      // Préparer les données pour l'envoi API (sans les icônes, seulement la clé)
      const apiFormData = {
        ...formDataWithFormattedPhone,
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
      }, 1500);

    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Erreur inconnue');
      // Save to localStorage even if API fails
      setOnboardingStatus('business_info');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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
              {formData.phone && !phoneError && <CheckCircle2 className="w-4 h-4 text-success" />}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none disabled:bg-gray-50 transition ${
                phoneError ? 'border-error focus:border-error' : 'border-border focus:border-primary'
              }`}
              placeholder="Ex: 0123456789"
              autoComplete="tel"
            />
            {phoneError && (
              <p className="text-xs text-error mt-1 flex items-start gap-1.5">
                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                {phoneError}
              </p>
            )}
            {!phoneError && !formData.phone && (
              <p className="text-xs text-text-light mt-1 flex items-start gap-1.5">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Formats acceptés : 0123456789 ou +33 1 23 45 67 89
              </p>
            )}
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

          {/* Google Review Link (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-text font-semibold text-xs">
                Lien avis Google <span className="text-text-light">(optionnel)</span>
              </label>
              <button
                type="button"
                onClick={() => setShowGoogleHelp(!showGoogleHelp)}
                className="flex items-center gap-1 text-xs text-primary hover:text-secondary transition font-medium"
              >
                <Info className="w-3.5 h-3.5" />
                Comment trouver mon lien ?
              </button>
            </div>

            {showGoogleHelp && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-text space-y-2">
                <p className="font-semibold text-primary">Comment obtenir votre lien d'avis Google :</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Ouvrez <strong>Google Maps</strong> et recherchez votre établissement</li>
                  <li>Cliquez sur le nom de votre établissement</li>
                  <li>Faites défiler jusqu'à la section <strong>"Avis"</strong></li>
                  <li>Cliquez sur <strong>"Partager un avis"</strong></li>
                  <li>Copiez le lien qui apparaît (format : g.page/...)</li>
                </ol>
                <p className="text-text-light italic mt-2">
                  💡 Astuce : Ce lien permettra à vos clients de laisser un avis en un clic !
                </p>
              </div>
            )}

            <input
              type="url"
              name="googleReviewLink"
              value={formData.googleReviewLink}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50 transition"
              placeholder="https://g.page/votre-etablissement/review"
              autoComplete="off"
            />
            {!formData.googleReviewLink && !showGoogleHelp && (
              <p className="text-xs text-text-light mt-1 flex items-start gap-1.5">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Permet à vos clients de laisser des avis facilement
              </p>
            )}
          </div>

          {/* Opening Hours (Optional) */}
          <div>
            <label className="block text-text font-semibold text-xs mb-1.5">
              Horaires d'ouverture <span className="text-text-light">(optionnel)</span>
            </label>
            <OpeningHoursInput
              value={formData.openingHours}
              onChange={(hours) => setFormData(prev => ({ ...prev, openingHours: hours }))}
              disabled={loading}
            />
            {!formData.openingHours && (
              <p className="text-xs text-text-light mt-1 flex items-start gap-1.5">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Par défaut : 9h-18h du lundi au vendredi
              </p>
            )}
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
            disabled={loading || authLoading || !formData.businessName || !formData.address || !formData.phone || !formData.category || phoneError !== ''}
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
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Créer mon commerce
              </>
            )}
          </button>

          {/* Info message */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-text-light text-center">
              <Info className="w-3.5 h-3.5 inline mr-1" />
              Vous pourrez modifier toutes ces informations dans votre espace professionnel
            </p>
          </div>
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
