'use client';

import { createClient } from '@/lib/supabase/clients/browser';

export function useEdgeFunction() {
  const supabase = createClient();

  const callFunction = async <T = any>(
    functionName: string,
    payload: Record<string, any>
  ): Promise<{ data: T | null; error: string | null }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/${functionName}`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
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
  };

  return { callFunction };
}
