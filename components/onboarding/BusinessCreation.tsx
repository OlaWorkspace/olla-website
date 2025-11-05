// components/onboarding/BusinessCreation.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseEdgeFunction } from '@/hooks/useSupabaseEdgeFunction';

const CATEGORIES = [
  'Commerce',
  'Restaurant',
  'Coiffure',
  'Beauté',
  'Sport',
  'Services'
];

interface FormData {
  businessName: string;
  address: string;
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
  const { user, userProfile } = useAuth();
  const { callFunction } = useSupabaseEdgeFunction();

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    address: '',
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

      if (!user || !userProfile) {
        showToast('error', 'Utilisateur non authentifié');
        setLoading(false);
        return;
      }

      // Tentative d'appel à l'Edge Function avec le plan "free" par défaut
      const { data, error } = await callFunction(
        'web-complete-professional-onboarding',
        {
          userId: userProfile.id,
          authId: user.id,
          planSlug: 'free',  // Plan par défaut pour les nouveaux utilisateurs
          businessData: {
            businessName: formData.businessName,
            address: formData.address,
            phone: formData.phone,
            website: formData.website || null,
            category: formData.category,
            openingHours: formData.openingHours
              ? (() => {
                  try {
                    return JSON.parse(formData.openingHours);
                  } catch {
                    return null;
                  }
                })()
              : null
          }
        }
      );

      if (error) {
        showToast('error', `Erreur: ${error}`);
        setLoading(false);
        return;
      }

      if (data && data.businessId) {
        showToast('success', 'Commerce créé avec succès! Redirection...');
        setTimeout(() => {
          router.push('/pro');
        }, 2000);
      } else {
        showToast('error', 'Une erreur est survenue');
        setLoading(false);
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Erreur inconnue');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-8 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">
          Créez votre business
        </h1>
        <p className="text-text-light">
          Renseignez les informations de votre commerce pour accéder à votre espace professionnel.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-border rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-text font-semibold mb-2">
              Nom du commerce <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50"
              placeholder="Ex: La Boutique du Centre"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-text font-semibold mb-2">
              Adresse <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50"
              placeholder="Ex: 123 Rue de la Paix, 75000 Paris"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-text font-semibold mb-2">
              Téléphone <span className="text-error">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50"
              placeholder="Ex: 01 23 45 67 89 ou +33 1 2345 67 89"
            />
            <p className="text-xs text-text-light mt-1">
              Format français ou international
            </p>
          </div>

          {/* Website */}
          <div>
            <label className="block text-text font-semibold mb-2">
              Site web <span className="text-text-light text-sm">(optionnel)</span>
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50"
              placeholder="Ex: https://monsite.fr"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-text font-semibold mb-2">
              Catégorie <span className="text-error">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50"
            >
              <option value="">Sélectionner une catégorie</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block text-text font-semibold mb-2">
              Horaires d'ouverture <span className="text-text-light text-sm">(optionnel, JSON)</span>
            </label>
            <textarea
              name="openingHours"
              value={formData.openingHours}
              onChange={handleInputChange}
              disabled={loading}
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-50 font-mono text-sm"
              placeholder={'{\n  "weekday_text": [\n    "Lundi: 08:00–19:00",\n    "Dimanche: Fermé"\n  ]\n}'}
            />
            <p className="text-xs text-text-light mt-1">
              Laissez vide pour utiliser les horaires par défaut
            </p>
          </div>

          {/* Toast */}
          {toast && (
            <div
              className={`p-4 rounded-lg text-sm font-medium ${
                toast.type === 'success'
                  ? 'bg-success/10 text-success border border-success'
                  : 'bg-error/10 text-error border border-error'
              }`}
            >
              {toast.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création en cours...' : 'Créer mon commerce'}
          </button>
        </form>
      </div>

      {/* Info */}
      <div className="mt-8 p-6 bg-info/10 border border-info rounded-lg text-center">
        <p className="text-info text-sm">
          <strong>Plan:</strong> Gratuit (Accès complet au platform)
        </p>
      </div>
    </div>
  );
}
