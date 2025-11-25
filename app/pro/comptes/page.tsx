'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';
import { supabase } from '@/lib/supabase/clients/browser';

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
  const { user, userProfile } = useAuth();
  const { callFunction } = useEdgeFunction();

  const [data, setData] = useState<ComptesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tous les rôles peuvent accéder à leur propre compte
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !userProfile) {
        setError('Utilisateur non authentifié');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: dashboardData, error: dashboardError } = await callFunction(
          'web-get-pro-dashboard',
          {
            userId: userProfile.id,
            authId: user.id,
          }
        );

        if (dashboardError) {
          throw new Error(dashboardError);
        }

        if (dashboardData) {
          setData(dashboardData);
          setFormData({
            firstName: dashboardData.user.firstName,
            lastName: dashboardData.user.lastName,
            email: dashboardData.user.email,
          });
        } else {
          setError('Aucune donnée retournée');
        }
      } catch (err) {
        console.error('❌ Error fetching comptes data:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userProfile]); // callFunction est stable grâce à useCallback

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError(null);
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    // Validation
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setPasswordSuccess(true);
      setPasswordData({ newPassword: '', confirmPassword: '' });

      // Fermer le modal après 2 secondes
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Erreur lors du changement de mot de passe');
    }
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

        {/* Sécurité */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sécurité</h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold px-6 py-3 rounded-lg transition w-full md:w-auto"
            >
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

      {/* Modal de changement de mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Changer le mot de passe</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ newPassword: '', confirmPassword: '' });
                  setPasswordError(null);
                  setPasswordSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {passwordSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-center font-medium">Mot de passe modifié avec succès !</p>
              </div>
            ) : (
              <>
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 text-sm">{passwordError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Minimum 6 caractères"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Ressaisissez le mot de passe"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPasswordData({ newPassword: '', confirmPassword: '' });
                        setPasswordError(null);
                      }}
                      className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold px-4 py-2 rounded-lg transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
