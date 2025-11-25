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
    options?: { requireAuth?: boolean; method?: 'POST' | 'PATCH' | 'DELETE' }
  ): Promise<{ data: T | null; error: string | null }> => {
    try {
      const requireAuth = options?.requireAuth !== false; // default: true

      let token: string | null = null;

      if (requireAuth) {
        // Récupération du token depuis localStorage via getSession()
        const { data: { session } } = await supabase.auth.getSession();

        token = session?.access_token || null;

        if (!token) {
          return {
            data: null,
            error: 'Non authentifié - veuillez vous reconnecter'
          };
        }
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/${functionName}`;
      const httpMethod = options?.method || 'POST';

      const response = await fetch(functionUrl, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: responseData?.error || `Function call failed with status ${response.status}`
        };
      }

      if (responseData?.error) {
        return {
          data: null,
          error: responseData.error
        };
      }

      return {
        data: responseData?.data || responseData,
        error: null
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  }, []); // Mémorisé - ne change jamais

  return { callFunction };
}
