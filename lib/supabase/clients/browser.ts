import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Crée un client Supabase pour le navigateur avec persistance localStorage
 *
 * Configuration:
 * - persistSession: true - Les sessions sont automatiquement sauvegardées dans localStorage
 * - autoRefreshToken: true - Les tokens sont automatiquement rafraîchis
 * - detectSessionInUrl: true - Détecte les sessions dans l'URL (OAuth callbacks)
 * - storage: localStorage - Stockage explicite dans localStorage (plus de cookies)
 */
export const createClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    }
  );
};

/**
 * Instance singleton du client Supabase
 * Utilisée partout dans l'application pour éviter de créer plusieurs instances
 */
export const supabase = createClient();
