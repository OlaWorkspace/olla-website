// components/onboarding/LoyaltySetup.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertCircle, Gift, Lightbulb, Info } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';
import { useOnboardingGuard } from '@/lib/hooks/useOnboardingGuard';
import { setOnboardingStatus } from '@/lib/utils/onboarding';
import { supabase } from '@/lib/supabase/clients/browser';

interface LoyaltyProgram {
  id: string;
  pointsRequired: number;
  rewardLabel: string;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

const SUGGESTED_POINTS = [1, 5, 10, 15, 20, 25, 30];

export default function LoyaltySetup() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { selectedPlan, businessData, setLoyaltyPrograms } = useOnboarding();
  const { callFunction } = useEdgeFunction();
  const { isChecking, isAuthorized } = useOnboardingGuard();

  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<number | null>(null);
  const [rewardInput, setRewardInput] = useState('');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const usedPoints = programs.map(p => p.pointsRequired);

  const handleAddProgram = () => {
    if (!selectedPoints) {
      showToast('error', 'Veuillez sélectionner un nombre de points');
      return;
    }
    if (!rewardInput.trim()) {
      showToast('error', 'Veuillez entrer une récompense');
      return;
    }

    const newProgram: LoyaltyProgram = {
      id: Date.now().toString(),
      pointsRequired: selectedPoints,
      rewardLabel: rewardInput.trim()
    };
    setPrograms([...programs, newProgram].sort((a, b) => a.pointsRequired - b.pointsRequired));
    setSelectedPoints(null);
    setRewardInput('');
    showToast('success', 'Programme ajouté avec succès!');
  };

  const removeProgram = (id: string) => {
    setPrograms(programs.filter(p => p.id !== id));
    showToast('success', 'Programme supprimé');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (programs.length === 0) {
        showToast('error', 'Vous devez créer au moins un programme de fidélité');
        setLoading(false);
        return;
      }

      // Vérifier qu'on a bien user et userProfile
      if (!user || !userProfile) {
        showToast('error', authLoading ? 'Chargement en cours, veuillez patienter...' : 'Utilisateur non authentifié');
        setLoading(false);
        return;
      }

      // Sauvegarder dans le contexte
      setLoyaltyPrograms(programs);

      // Vérifier si le business existe déjà
      const { data: professional } = await supabase
        .from('professionals')
        .select('business_id')
        .eq('user_id', userProfile.id)
        .single();

      let businessId: string;

      if (professional && professional.business_id) {
        // Le business existe déjà, on va juste ajouter les programmes
        businessId = professional.business_id;
        showToast('success', 'Création des programmes de fidélité...');
      } else {
        // Le business n'existe pas, il faut le créer d'abord
        if (!selectedPlan || !businessData) {
          showToast('error', 'Données manquantes. Veuillez recommencer l\'onboarding.');
          setLoading(false);
          return;
        }

        showToast('success', 'Création de votre espace...');

        const { data, error: completionError } = await callFunction(
          'web-complete-professional-onboarding',
          {
            userId: userProfile.id,
            authId: user.id,
            planSlug: selectedPlan.slug,
            businessData: businessData,
            loyaltyPrograms: programs
          }
        );

        if (completionError) {
          showToast('error', `Erreur: ${completionError}`);
          setLoading(false);
          return;
        }

        if (!data || !data.businessId) {
          showToast('error', 'Une erreur est survenue');
          setLoading(false);
          return;
        }

        businessId = data.businessId;
      }

      // Supprimer les anciens programmes de fidélité s'ils existent
      await supabase
        .from('loyalty_programs')
        .delete()
        .eq('business_id', businessId);

      // Créer les nouveaux programmes de fidélité
      const loyaltyData = programs.map(program => ({
        business_id: businessId,
        point_needed: program.pointsRequired,
        reward_label: program.rewardLabel
      }));

      const { error: loyaltyError } = await supabase
        .from('loyalty_programs')
        .insert(loyaltyData);

      if (loyaltyError) {
        showToast('error', `Erreur lors de la création des programmes: ${loyaltyError.message}`);
        setLoading(false);
        return;
      }

      // Marquer l'onboarding comme loyalty_setup (pour rediriger vers welcome)
      await supabase
        .from('users')
        .update({ onboarding_status: 'loyalty_setup' })
        .eq('id', userProfile.id);

      // Save status to localStorage for instant access on next visit
      setOnboardingStatus('loyalty_setup');

      showToast('success', 'Programmes créés avec succès!');

      // Rediriger vers la page Welcome
      setTimeout(() => {
        router.push('/onboarding/welcome');
      }, 1000);

    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Erreur inconnue');
      // Save to localStorage even if API fails
      setOnboardingStatus('loyalty_setup');
      setLoading(false);
    }
  };

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
          <h2 className="text-xs font-semibold text-text">Étape 3/3</h2>
          <span className="text-xs text-success font-semibold">{programs.length} programme{programs.length > 1 ? 's' : ''}</span>
        </div>
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-success transition-all duration-300"
            style={{ width: programs.length > 0 ? '100%' : '0%' }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-text leading-tight">
            Programmes de fidélité
          </h1>
        </div>
        <p className="text-text-light text-sm">
          Définissez les récompenses pour vos clients fidèles. Vous pourrez les modifier plus tard.
        </p>
      </div>

      {/* Info Card */}
      <div className="mb-6 p-4 bg-primary/5 border border-primary rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text mb-1">Système de paliers</p>
            <p className="text-xs text-text-light">
              • Les clients gagnent 1 point par scan{'\n'}
              • Ils peuvent choisir quelle récompense utiliser{'\n'}
              • Les points sont déduits lors de l'utilisation{'\n'}
              • Les points restants peuvent être gardés pour une plus grande récompense
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Création d'un nouveau programme */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-text mb-4">Ajouter un palier de récompense</h3>

          <div className="space-y-4">
            {/* Points Selection */}
            <div>
              <label className="block text-text font-semibold text-sm mb-2">
                Nombre de points requis <span className="text-error">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_POINTS.map((points) => {
                  const isUsed = usedPoints.includes(points);
                  const isSelected = selectedPoints === points;
                  return (
                    <button
                      key={points}
                      type="button"
                      onClick={() => !isUsed && setSelectedPoints(points)}
                      disabled={isUsed}
                      className={`
                        px-4 py-2 rounded-full font-semibold text-sm transition-all
                        ${isSelected
                          ? 'bg-primary text-white border-2 border-primary'
                          : isUsed
                          ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50'
                          : 'bg-background text-text border-2 border-border hover:border-primary'
                        }
                      `}
                    >
                      {points}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reward Input */}
            <div>
              <label className="block text-text font-semibold text-sm mb-2">
                Récompense <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={rewardInput}
                onChange={(e) => setRewardInput(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary transition"
                placeholder="Ex: 1 café gratuit, 20% de réduction..."
              />
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddProgram}
              disabled={!selectedPoints || !rewardInput.trim()}
              className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-300 text-white rounded-lg transition font-semibold disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Ajouter ce palier
            </button>
          </div>
        </div>

        {/* Liste des programmes créés */}
        {programs.length > 0 && (
          <div className="bg-white border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-text mb-4">Paliers créés ({programs.length})</h3>
            <div className="space-y-3">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-white px-3 py-1.5 rounded-lg font-bold text-sm min-w-[50px] text-center">
                      {program.pointsRequired} pts
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">{program.rewardLabel}</p>
                      <p className="text-xs text-text-light">
                        Récompense obtenue après {program.pointsRequired} scan{program.pointsRequired > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProgram(program.id)}
                    className="text-error hover:bg-error/10 p-2 rounded-lg transition"
                    title="Supprimer"
                  >
                    <AlertCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
          disabled={loading || authLoading || programs.length === 0}
          className="w-full px-6 py-3 bg-success hover:bg-opacity-90 disabled:bg-gray-300 text-white rounded-lg transition font-bold disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
        >
          {authLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Chargement...
            </>
          ) : loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Finalisation de votre inscription...
            </>
          ) : programs.length > 0 ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Terminer et accéder à mon espace
            </>
          ) : (
            'Créez au moins un palier pour continuer'
          )}
        </button>
      </form>
    </div>
  );
}
