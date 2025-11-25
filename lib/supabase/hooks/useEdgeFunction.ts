'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase/clients/browser';

/**
 * Hook pour appeler les Supabase Edge Functions
 *
 * Récupère automatiquement le token d'accès depuis la session localStorage
 * et l'envoie dans le header Authorization
 *
 * @example
 * ```tsx
 * const { callFunction } = useEdgeFunction();
 *
 * const { data, error } = await callFunction('my-function', {
 *   param1: 'value1',
 *   param2: 'value2'
 * });
 * ```
 */
export function useEdgeFunction() {
  const callFunction = useCallback(async <T = any>(
    functionName: string,
    payload: Record<string, any>,
    options?: { requireAuth?: boolean }
  ): Promise<{ data: T | null; error: string | null }> => {
    try {
      const requireAuth = options?.requireAuth !== false; // default: true

      let token: string | null = null;

      if (requireAuth) {
        // Récupération du token depuis localStorage via getSession()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        console.log('🔍 Session debug:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          hasToken: !!session?.access_token,
          sessionError: sessionError,
          userId: session?.user?.id,
          tokenPrefix: session?.access_token ? session.access_token.substring(0, 20) + '...' : 'none'
        });

        token = session?.access_token || null;

        if (!token) {
          console.error('❌ No access token found - user not authenticated');
          return {
            data: null,
            error: 'Non authentifié - veuillez vous reconnecter'
          };
        }
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/${functionName}`;

      console.log(`🚀 Calling Edge Function: ${functionName}`, {
        url: functionUrl,
        hasToken: !!token,
        requireAuth,
        payload
      });

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error(`❌ Edge Function ${functionName} failed:`, responseData);
        return {
          data: null,
          error: responseData?.error || `Function call failed with status ${response.status}`
        };
      }

      if (responseData?.error) {
        console.error(`❌ Edge Function ${functionName} returned error:`, responseData.error);
        return {
          data: null,
          error: responseData.error
        };
      }

      console.log(`✅ Edge Function ${functionName} succeeded`);
      return {
        data: responseData?.data || responseData,
        error: null
      };
    } catch (err) {
      console.error(`❌ Exception calling Edge Function ${functionName}:`, err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  }, []); // Mémorisé - ne change jamais

  return { callFunction };
}
