// components/onboarding/WelcomeKit.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertCircle, Package, Truck, Smartphone, CreditCard, Gift, Zap } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';
import { clearOnboardingStatus } from '@/lib/utils/onboarding';
import { supabase } from '@/lib/supabase/clients/browser';

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export default function WelcomeKit() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { selectedPlan, businessData, loyaltyPrograms } = useOnboarding();
  const { callFunction } = useEdgeFunction();

  const [loading, setLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false); // Prevent double click
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleComplete = async () => {
    // Prevent double submission
    if (isCompleting || loading) {
      return;
    }

    setIsCompleting(true);
    setLoading(true);

    try {
      if (!user || !userProfile) {
        showToast('error', 'Utilisateur non authentifié');
        setLoading(false);
        setIsCompleting(false);
        return;
      }

      console.log('🎯 WelcomeKit - Starting onboarding completion...');

      // Check if business already exists first
      const { count } = await supabase
        .from('professionals')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userProfile.id);

      if (count && count > 0) {
        console.log('✅ WelcomeKit - Business already exists, updating status and redirecting');

        // Update onboarding status to completed
        await supabase
          .from('users')
          .update({ onboarding_status: 'completed', onboarding_data: null })
          .eq('id', userProfile.id);

        // Clear localStorage since onboarding is completed
        clearOnboardingStatus();

        showToast('success', 'Redirection vers votre espace...');

        // Force hard redirect to bypass middleware cache
        window.location.href = '/pro';
        return;
      }

      // Vérifier que toutes les étapes sont complétées (ordre d'onboarding)
      if (!selectedPlan || !businessData) {
        showToast('error', 'Vous devez compléter les étapes précédentes');
        setTimeout(() => {
          if (!selectedPlan) {
            router.push('/onboarding/plan');
          } else if (!businessData) {
            router.push('/onboarding/business');
          }
        }, 2000);
        setLoading(false);
        setIsCompleting(false);
        return;
      }

      // Appel à l'Edge Function avec toutes les données
      const result = await callFunction(
        'web-complete-professional-onboarding',
        {
          userId: userProfile.id,
          authId: user.id,
          planSlug: selectedPlan.slug,
          businessData: businessData,
          loyaltyPrograms: loyaltyPrograms || []
        }
      );

      console.log('📦 WelcomeKit - Function result:', result);

      if (result.error) {
        console.error('❌ WelcomeKit - Error:', result.error);

        // If business already exists, just redirect to dashboard
        if (result.error.toLowerCase().includes('already has a business')) {
          console.log('✅ WelcomeKit - Business already exists, redirecting to /pro');
          showToast('success', 'Redirection vers votre espace...');
          router.push('/pro');
          return;
        }

        showToast('error', `Erreur: ${result.error}`);
        setLoading(false);
        setIsCompleting(false);
        return;
      }

      if (result.data && result.data.businessId) {
        console.log('✅ WelcomeKit - Success! Redirecting to /pro');
        // Clear localStorage since onboarding is completed
        clearOnboardingStatus();
        showToast('success', 'Inscription terminée! Redirection...');
        // Redirect immediately without delay
        router.push('/pro');
      } else {
        console.log('⚠️ WelcomeKit - No businessId in response');
        showToast('error', 'Une erreur est survenue');
        setLoading(false);
        setIsCompleting(false);
      }
    } catch (err) {
      console.error('❌ WelcomeKit - Exception:', err);
      showToast('error', err instanceof Error ? err.message : 'Erreur inconnue');
      setLoading(false);
      setIsCompleting(false);
    }
  };

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
          <h2 className="text-xs font-semibold text-text">Étape 5/5</h2>
          <span className="text-xs text-success font-semibold">Presque terminé !</span>
        </div>
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-success transition-all duration-300 w-full" />
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-success" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-text mb-2 leading-tight">
          Votre kit arrive bientôt !
        </h1>
        <p className="text-text-light text-sm">
          Tout est prêt ! Il ne reste plus qu'à attendre votre plaque Olla.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-border rounded-2xl p-6 mb-4">
        {/* Delivery Info */}
        <div className="flex items-start gap-4 p-4 bg-success/5 border border-success rounded-lg mb-6">
          <Truck className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-text mb-1">
              Livraison en 3-6 jours ouvrés
            </h3>
            <p className="text-xs text-text-light">
              Votre plaque Olla avec QR code et NFC sera envoyée à l'adresse de votre commerce.
              Vous recevrez un email de confirmation avec le suivi.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text mb-4">Ce que vous recevrez :</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Plaque Olla avec QR Code & NFC</p>
                <p className="text-xs text-text-light">
                  À afficher dans votre commerce pour que vos clients puissent scanner
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Guide d'installation</p>
                <p className="text-xs text-text-light">
                  Instructions simples pour installer et optimiser votre plaque
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-bold text-text mb-4">Comment ça fonctionne ?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-success">1</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Le client scanne</p>
                <p className="text-xs text-text-light">
                  Avec son smartphone (QR code) ou en approchant sa carte (NFC)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-success">2</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Il collecte un point</p>
                <p className="text-xs text-text-light">
                  Automatiquement ajouté à son compte de fidélité
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-success">3</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Il gagne des récompenses</p>
                <p className="text-xs text-text-light">
                  Dès qu'il atteint le nombre de points requis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Zap className="w-6 h-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-text mb-1">
              En attendant, vous pouvez :
            </h3>
            <ul className="text-xs text-text-light space-y-1">
              <li>✓ Accéder à votre tableau de bord professionnel</li>
              <li>✓ Modifier vos programmes de fidélité</li>
              <li>✓ Personnaliser les paramètres de votre commerce</li>
              <li>✓ Consulter les statistiques en temps réel</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`p-4 rounded-lg text-sm font-medium flex items-start gap-3 mb-4 ${
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

      {/* Complete Button */}
      <button
        onClick={handleComplete}
        disabled={loading}
        className="w-full px-6 py-3.5 bg-success hover:bg-opacity-90 disabled:bg-gray-300 text-white rounded-lg transition font-bold disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Finalisation...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Accéder à mon tableau de bord
          </>
        )}
      </button>

      <p className="text-center text-xs text-text-light mt-4">
        Vous recevrez un email de confirmation dès l'expédition de votre plaque
      </p>
    </div>
  );
}
