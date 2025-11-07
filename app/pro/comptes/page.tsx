'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/clients/browser';

interface ComptesData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isPro: boolean;
  };
  subscription: {
    plan: {
      name: string;
      slug: string;
    };
  } | null;
  businesses: Array<{
    id: string;
    name: string;
    category: string;
    address: string;
    active: boolean;
  }>;
}

export default function ComptesPage() {
  const [data, setData] = useState<ComptesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setError('User not authenticated');
          return;
        }

        // Récupérer l'utilisateur depuis la base de données pour obtenir le userId
        const { data: dbUser, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', authUser.id)
          .single();

        if (userError || !dbUser) {
          setError('Failed to fetch user data');
          return;
        }

        // Récupérer le token de session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          setError('No access token available');
          return;
        }

        // Récupérer les données du dashboard (qui contient le profil)
        console.log('Fetching comptes data for user:', dbUser.id);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/web-get-pro-dashboard`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              userId: dbUser.id,
              authId: authUser.id,
            }),
          }
        );

        console.log('Comptes response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Comptes error response:', errorData);
          throw new Error(errorData.error || `Failed to fetch data (${response.status})`);
        }

        const result = await response.json();
        if (result.success) {
          const dashboardData = result.data;
          setData(dashboardData);
          setFormData({
            firstName: dashboardData.user.firstName,
            lastName: dashboardData.user.lastName,
            email: dashboardData.user.email,
          });
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Chargement des comptes...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error || 'Erreur lors du chargement'}</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    // À implémenter : sauvegarder le profil via une edge function
    console.log('Saving profile:', formData);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Comptes
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Gérez votre profil et les accès utilisateurs
      </p>

      <div className="space-y-6">
        {/* Profil utilisateur */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Mon profil</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Votre prénom"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">L'email ne peut pas être modifié</p>
            </div>

            {/* Statut de l'utilisateur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Type de compte</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {data.user.isPro ? 'Professionnel' : 'Personnel'}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Plan actuel</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {data.subscription?.plan.name || 'Gratuit'}
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition mt-6"
            >
              Sauvegarder les modifications
            </button>
          </div>
        </div>

        {/* Commerces associés */}
        {data.businesses.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Commerces associés</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {data.businesses.length}
              </span>
            </div>
            <div className="space-y-3">
              {data.businesses.map((business) => (
                <div
                  key={business.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{business.name}</p>
                    <p className="text-sm text-slate-600">{business.category}</p>
                    {business.address && (
                      <p className="text-xs text-slate-500 mt-1">{business.address}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        business.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {business.active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Utilisateurs de l'équipe */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Équipe</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!data.subscription || data.subscription.plan.slug === 'free'}
              title={!data.subscription || data.subscription.plan.slug === 'free' ? 'Upgrade pour ajouter des utilisateurs' : ''}
            >
              Ajouter un utilisateur
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-slate-500">Aucun utilisateur supplémentaire</p>
            {!data.subscription || data.subscription.plan.slug === 'free' && (
              <p className="text-xs text-slate-400 mt-2">Upgrade votre plan pour inviter d'autres utilisateurs</p>
            )}
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sécurité</h2>
          <div className="space-y-4">
            <button className="border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold px-6 py-3 rounded-lg transition w-full md:w-auto">
              Changer le mot de passe
            </button>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">Sessions actives</p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Session actuelle</p>
                    <p className="text-sm text-slate-600">Navigateur web</p>
                  </div>
                  <span className="text-xs font-medium text-green-600">Actif</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Données et confidentialité */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Données et confidentialité</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <p className="font-medium text-slate-900">Télécharger mes données</p>
              <p className="text-sm text-slate-600">Obtenir une copie de toutes vos données</p>
            </button>
            <button className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 transition">
              <p className="font-medium text-red-900">Supprimer mon compte</p>
              <p className="text-sm text-red-600">Supprimer définitivement votre compte et ses données</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
