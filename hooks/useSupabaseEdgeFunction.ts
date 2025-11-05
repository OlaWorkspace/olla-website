// hooks/useSupabaseEdgeFunction.ts
'use client';

import { createClient } from '@/lib/supabase-client';

export function useSupabaseEdgeFunction() {
  const supabase = createClient();

  const callFunction = async <T = any>(
    functionName: string,
    payload: Record<string, any>
  ): Promise<{ data: T | null; error: string | null }> => {
    try {
      // Get the auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Build the function URL
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/${functionName}`;

      // Make the request with fetch (more reliable than supabase.functions.invoke)
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      // Parse response
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
  };

  return { callFunction };
}
