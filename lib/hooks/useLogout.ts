'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/clients/browser';
import { clearOnboardingStatus } from '@/lib/utils/onboarding';

/**
 * Hook centralisé pour la déconnexion
 * Gère le nettoyage complet : cache localStorage, session Supabase, redirection
 *
 * Stratégie:
 * 1. Vider d'abord TOUS les localStorage locaux
 * 2. Rafraîchir la session si possible
 * 3. Appeler signOut() sur Supabase
 * 4. Forcer le nettoyage complet du localStorage encore une fois
 * 5. Rediriger
 */
export function useLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearAllAuthStorage = useCallback(() => {
    // Clear onboarding status
    clearOnboardingStatus();

    // Clear user profile cache
    localStorage.removeItem('olla_user_profile');
    localStorage.removeItem('olla_user_profile_timestamp');

    // Clear ALL Supabase-related keys (multiple passes to ensure cleanup)
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.startsWith('supabase') || key.startsWith('SUPABASE'))) {
        keysToRemove.push(key);
      }
    }

    // Remove all identified keys
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`Failed to remove key ${key}:`, e);
      }
    });

    // Second pass to catch any remaining keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.startsWith('supabase') || key.startsWith('SUPABASE'))) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Failed to remove key ${key} on second pass:`, e);
        }
      }
    }
  }, []);

  const logout = useCallback(async (redirectTo: string = '/auth/login') => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Clear local storage first (before any async operations)
      clearAllAuthStorage();
      console.log('✅ Local storage cleared');

      // Step 2: Try to refresh session to ensure token is valid
      try {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.warn('⚠️ Could not refresh session before logout:', refreshError);
        } else {
          console.log('✅ Session refreshed before logout');
        }
      } catch (refreshErr) {
        console.warn('⚠️ Refresh session failed (expected if already expired):', refreshErr);
      }

      // Step 3: Call Supabase signOut
      try {
        await supabase.auth.signOut();
        console.log('✅ Supabase signOut successful');
      } catch (signOutError) {
        console.warn('⚠️ Warning signing out (session may already be expired):', signOutError);
      }

      // Step 4: Force final cleanup of any remaining Supabase keys
      clearAllAuthStorage();
      console.log('✅ Final localStorage cleanup completed');

      // Step 5: Redirect to login
      router.push(redirectTo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la déconnexion';
      console.error('❌ Error during logout cleanup:', err);
      setError(errorMessage);
      // Clear storage one more time and redirect anyway
      clearAllAuthStorage();
      router.push(redirectTo);
    } finally {
      setLoading(false);
    }
  }, [router, clearAllAuthStorage]);

  return { logout, loading, error };
}
