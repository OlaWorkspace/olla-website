'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/clients/browser';
import { clearOnboardingStatus } from '@/lib/utils/onboarding';

/**
 * Hook centralisé pour la déconnexion
 * Gère le nettoyage complet : cache localStorage, session Supabase, redirection
 *
 * Amélioration: Nettoie le cache même si Supabase signOut échoue (session déjà expirée)
 */
export function useLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async (redirectTo: string = '/auth/login') => {
    setLoading(true);
    setError(null);

    try {
      // Clear onboarding status from localStorage
      clearOnboardingStatus();

      // Clear user profile cache (use same keys as AuthContext)
      localStorage.removeItem('olla_user_profile');
      localStorage.removeItem('olla_user_profile_timestamp');

      // Essayer de rafraîchir la session avant logout
      // Cela évite l'erreur 403 si le token a expiré
      try {
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.warn('⚠️ Could not refresh session before logout:', refreshError);
        }
      } catch (refreshErr) {
        console.warn('⚠️ Refresh session failed (expected if already expired):', refreshErr);
      }

      // Invalidate Supabase session
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.warn('⚠️ Warning signing out (session may already be expired):', signOutError);
      }

      // Redirect to login
      router.push(redirectTo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la déconnexion';
      console.error('❌ Error during logout cleanup:', err);
      setError(errorMessage);
      // Toujours rediriger même en cas d'erreur (le cache est déjà nettoyé)
      router.push(redirectTo);
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { logout, loading, error };
}
