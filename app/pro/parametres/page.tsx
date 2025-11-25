'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';
import Link from 'next/link';
import { CATEGORY_OPTIONS, getCategoryKey, getCategoryDisplay } from '@/lib/constants';

interface Business {
  id: string;
  business_name: string;
  formatted_address: string;
  formatted_phone_number: string;
  website: string;
  opening_hours: any;
  category: string;
  gift: string;
  point_limit: number;
  google_reviews_url: string;
}

interface LoyaltyProgram {
  id: string;
  business_id: string;
  point_needed: number;
  reward_label: string;
  created_at: string;
  updated_at: string;
}

interface PlanInfo {
  slug: string;
  name: string;
  maxPrograms: number | null;
}

/**
 * Page de gestion des paramètres pour les professionnels
 * Utilise useAuth() et useEdgeFunction() pour toutes les opérations
 * Accès: OWNER et MANAGER uniquement
 */
export default function ParametresPage() {
  const { user, userProfile, userRole, loading: authLoading } = useAuth();
  const { callFunction } = useEdgeFunction();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // Vérifier l'accès - STAFF n'a pas accès
  useEffect(() => {
    if (!authLoading && userRole === 'STAFF') {
      console.log('❌ Access denied - redirecting to dashboard');
      router.push('/pro');
    }
  }, [userRole, authLoading, router]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [canAddMore, setCanAddMore] = useState(false);
  const [pageUserRole, setPageUserRole] = useState<'OWNER' | 'MANAGER' | 'STAFF'>('STAFF');

  const [editingBusiness, setEditingBusiness] = useState(false);
  const [editingProgram, setEditingProgram] = useState<string | null>(null);
  const [creatingProgram, setCreatingProgram] = useState(false);

  const [businessForm, setBusinessForm] = useState<Partial<Business>>({});
  const [programForm, setProgramForm] = useState({ point_needed: 10, reward_label: '' });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user && userProfile) {
      fetchData();
    }
  }, [user, userProfile]);

  const fetchData = async () => {
    if (!user || !userProfile) return;

    try {
      setLoading(true);
      setError(null);

      // 🆕 Récupérer le rôle et vérifier les droits
      const { data: staffData } = await callFunction('get-staff-dashboard', {
        userId: userProfile.id,
        authId: user.id,
        businessId: userProfile.default_business_id,
      });

      if (staffData?.userRole) {
        setPageUserRole(staffData.userRole);
        // STAFF ne peut pas accéder aux paramètres
        if (staffData.userRole === 'STAFF') {
          setError('Le personnel ne peut pas accéder aux paramètres');
          setLoading(false);
          return;
        }
      }

      // Récupérer le commerce via l'edge function
      const { data: businessData, error: businessError } = await callFunction(
        'web-get-business-info',
        {
          userId: userProfile.id,
          authId: user.id,
        }
      );

      if (businessError) {
        setError(businessError);
        return;
      }

      if (!businessData || !businessData.business) {
        setError('Aucun commerce trouvé');
        return;
      }

      const retrievedBusiness = businessData.business;
      const retrievedBusinessId = businessData.businessId;

      setBusiness(retrievedBusiness);
      setBusinessId(retrievedBusinessId);
      setBusinessForm(retrievedBusiness);

      // Récupérer les programmes de fidélité
      const { data: programsData, error: programsError } = await callFunction(
        'web-manage-loyalty-programs',
        {
          userId: userProfile.id,
          authId: user.id,
          businessId: retrievedBusinessId,
          action: 'list',
        }
      );

      if (programsError) {
        console.error('❌ Error fetching programs:', programsError);
        return;
      }

      if (programsData) {
        setPrograms(programsData.programs || []);
        setPlanInfo({
          slug: programsData.planSlug,
          name: programsData.planSlug === 'free' ? 'Gratuit' : programsData.planSlug,
          maxPrograms: programsData.maxPrograms
        });
        setCanAddMore(programsData.canAddMore);
      }
    } catch (err) {
      console.error('❌ Error in fetchData:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBusiness = async () => {
    if (!user || !userProfile || !business || !businessId) return;

    try {
      setError(null);
      setSuccess(null);

      // Préparer les données pour l'envoi API (convertir la catégorie en clé sans icône)
      const updatesWithCleanCategory = {
        ...businessForm,
        category: getCategoryKey(businessForm.category || '')
      };

      const { data: updateData, error: updateError } = await callFunction(
        'web-update-business',
        {
          userId: userProfile.id,
          authId: user.id,
          businessId: businessId,
          updates: updatesWithCleanCategory,
        }
      );

      if (updateError) {
        throw new Error(updateError);
      }

      if (updateData && updateData.business) {
        setBusiness(updateData.business);
        setEditingBusiness(false);
        setSuccess('Commerce mis à jour avec succès');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('❌ Error updating business:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const handleCreateProgram = async () => {
    if (!user || !userProfile || !businessId) return;

    if (!programForm.reward_label || programForm.point_needed <= 0) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const { data: createData, error: createError } = await callFunction(
        'web-manage-loyalty-programs',
        {
          userId: userProfile.id,
          authId: user.id,
          businessId: businessId,
          action: 'create',
          programData: programForm,
        }
      );

      if (createError) {
        if (createError.includes('PLAN_LIMIT_REACHED')) {
          setError(createError);
        } else {
          throw new Error(createError);
        }
        return;
      }

      if (createData) {
        await fetchData();
        setCreatingProgram(false);
        setProgramForm({ point_needed: 10, reward_label: '' });
        setSuccess('Programme créé avec succès');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('❌ Error creating program:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const handleUpdateProgram = async (programId: string) => {
    if (!user || !userProfile || !businessId) return;

    try {
      setError(null);
      setSuccess(null);

      const { data: updateData, error: updateError } = await callFunction(
        'web-manage-loyalty-programs',
        {
          userId: userProfile.id,
          authId: user.id,
          businessId: businessId,
          action: 'update',
          programId,
          programData: programForm,
        }
      );

      if (updateError) {
        throw new Error(updateError);
      }

      if (updateData) {
        await fetchData();
        setEditingProgram(null);
        setProgramForm({ point_needed: 10, reward_label: '' });
        setSuccess('Programme mis à jour avec succès');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('❌ Error updating program:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) return;
    if (!user || !userProfile || !businessId) return;

    try {
      setError(null);
      setSuccess(null);

      const { data: deleteData, error: deleteError } = await callFunction(
        'web-manage-loyalty-programs',
        {
          userId: userProfile.id,
          authId: user.id,
          businessId: businessId,
          action: 'delete',
          programId,
        }
      );

      if (deleteError) {
        throw new Error(deleteError);
      }

      if (deleteData) {
        await fetchData();
        setSuccess('Programme supprimé avec succès');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('❌ Error deleting program:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Aucun commerce trouvé'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Paramètres
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Gérez votre commerce et optimisez votre présence en ligne
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Section Conseils & Liens utiles */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Conseils pour optimiser votre visibilité
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Google Reviews */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Avis Google
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Les avis positifs améliorent votre visibilité et rassurent vos clients
            </p>
            {business.google_reviews_url ? (
              <a
                href={business.google_reviews_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Voir mes avis Google
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <div className="text-sm">
                <p className="text-slate-600 mb-2">Lien non configuré</p>
                <a
                  href="https://support.google.com/business/answer/7035772"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Comment obtenir mon lien ?
                </a>
              </div>
            )}
          </div>

          {/* Fiche Google My Business */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Google My Business
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Assurez-vous que vos infos sont à jour sur Google Maps
            </p>
            <a
              href="https://business.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Gérer ma fiche
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Réseaux sociaux */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              Réseaux sociaux
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Soyez actif sur les réseaux pour fidéliser vos clients
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/business" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/business" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              QR Code & NFC
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Facilitez la collecte de points avec nos solutions
            </p>
            <Link href="/pro/aide" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Commander mes outils →
            </Link>
          </div>
        </div>
      </div>

      {/* Section Commerce */}
      <div className="bg-white rounded-lg shadow border border-slate-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Informations du commerce</h2>
          {!editingBusiness ? (
            <button
              onClick={() => setEditingBusiness(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Modifier
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleUpdateBusiness}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Enregistrer
              </button>
              <button
                onClick={() => {
                  setEditingBusiness(false);
                  setBusinessForm(business);
                }}
                className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold px-4 py-2 rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nom du commerce</label>
            {editingBusiness ? (
              <input
                type="text"
                value={businessForm.business_name || ''}
                onChange={(e) => setBusinessForm({ ...businessForm, business_name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-slate-900 py-2">{business.business_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
            {editingBusiness ? (
              <select
                value={businessForm.category || ''}
                onChange={(e) => setBusinessForm({ ...businessForm, category: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une catégorie</option>
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat.key} value={cat.key}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-slate-900 py-2">{getCategoryDisplay(business.category)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
            {editingBusiness ? (
              <input
                type="text"
                value={businessForm.formatted_address || ''}
                onChange={(e) => setBusinessForm({ ...businessForm, formatted_address: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-slate-900 py-2">{business.formatted_address || 'Non renseignée'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
            {editingBusiness ? (
              <input
                type="text"
                value={businessForm.formatted_phone_number || ''}
                onChange={(e) => setBusinessForm({ ...businessForm, formatted_phone_number: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-slate-900 py-2">{business.formatted_phone_number || 'Non renseigné'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Site web</label>
            {editingBusiness ? (
              <input
                type="text"
                value={businessForm.website || ''}
                onChange={(e) => setBusinessForm({ ...businessForm, website: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-slate-900 py-2">{business.website || 'Non renseigné'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Lien avis Google
              <span className="text-xs text-slate-500 ml-2">(pour les conseils ci-dessus)</span>
            </label>
            {editingBusiness ? (
              <input
                type="text"
                value={businessForm.google_reviews_url || ''}
                onChange={(e) => setBusinessForm({ ...businessForm, google_reviews_url: e.target.value })}
                placeholder="https://g.page/..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-slate-900 py-2">{business.google_reviews_url || 'Non renseigné'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Points par visite</label>
            {editingBusiness ? (
              <input
                type="number"
                value={businessForm.point_limit || 0}
                onChange={(e) => setBusinessForm({ ...businessForm, point_limit: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-slate-900 py-2">{business.point_limit} points</p>
            )}
          </div>
        </div>
      </div>

      {/* Section Programmes de Fidélité */}
      <div className="bg-white rounded-lg shadow border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Programmes de Fidélité</h2>
            {planInfo && (
              <p className="text-sm text-slate-600 mt-1">
                Plan {planInfo.name} - {programs.length} / {planInfo.maxPrograms || '∞'} programme(s)
              </p>
            )}
          </div>
          {canAddMore && !creatingProgram && (
            <button
              onClick={() => setCreatingProgram(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Ajouter un programme
            </button>
          )}
          {!canAddMore && planInfo?.slug === 'free' && (
            <div className="text-right">
              <p className="text-sm text-orange-600 mb-2">Limite atteinte</p>
              <Link
                href="/pro/abonnements"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
              >
                Passer au Premium
              </Link>
            </div>
          )}
        </div>

        {/* Formulaire de création */}
        {creatingProgram && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Nouveau programme</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Points nécessaires</label>
                <input
                  type="number"
                  min="1"
                  value={programForm.point_needed}
                  onChange={(e) => setProgramForm({ ...programForm, point_needed: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Récompense</label>
                <input
                  type="text"
                  value={programForm.reward_label}
                  onChange={(e) => setProgramForm({ ...programForm, reward_label: e.target.value })}
                  placeholder="Ex: Café offert"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateProgram}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Créer
              </button>
              <button
                onClick={() => {
                  setCreatingProgram(false);
                  setProgramForm({ point_needed: 10, reward_label: '' });
                }}
                className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold px-4 py-2 rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste des programmes */}
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">Vous n'avez pas encore de programme de fidélité</p>
            {canAddMore && (
              <button
                onClick={() => setCreatingProgram(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Créer mon premier programme
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {programs.map((program) => (
              <div key={program.id} className="border border-slate-200 rounded-lg p-6">
                {editingProgram === program.id ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Points nécessaires</label>
                        <input
                          type="number"
                          min="1"
                          value={programForm.point_needed}
                          onChange={(e) => setProgramForm({ ...programForm, point_needed: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Récompense</label>
                        <input
                          type="text"
                          value={programForm.reward_label}
                          onChange={(e) => setProgramForm({ ...programForm, reward_label: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateProgram(program.id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => {
                          setEditingProgram(null);
                          setProgramForm({ point_needed: 10, reward_label: '' });
                        }}
                        className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{program.reward_label}</p>
                      <p className="text-sm text-slate-600">{program.point_needed} points nécessaires</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProgram(program.id);
                          setProgramForm({
                            point_needed: program.point_needed,
                            reward_label: program.reward_label
                          });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProgram(program.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
