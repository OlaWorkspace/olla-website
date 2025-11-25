'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/clients/browser';
import { User } from '@supabase/supabase-js';
import type { User as UserProfile } from '@/types';

/**
 * Interface du contexte d'authentification
 */
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isPro: boolean;
  isAdmin: boolean;
  userRole: 'OWNER' | 'MANAGER' | 'STAFF' | null;
  currentBusinessId: string | null;
  setCurrentBusinessId: (businessId: string | null) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider d'authentification basé sur localStorage
 *
 * Gère automatiquement:
 * - La récupération de la session depuis localStorage
 * - L'écoute des changements d'authentification
 * - Le chargement du profil utilisateur depuis la table 'users'
 * - La mise à jour de l'état en temps réel
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'OWNER' | 'MANAGER' | 'STAFF' | null>(null);
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(null);

  // Cache keys
  const PROFILE_CACHE_KEY = 'olla_user_profile';
  const PROFILE_TIMESTAMP_KEY = 'olla_user_profile_timestamp';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    let initialLoadComplete = false;

    // Récupération initiale de la session depuis localStorage
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        // Clear cache on logout
        localStorage.removeItem(PROFILE_CACHE_KEY);
        localStorage.removeItem(PROFILE_TIMESTAMP_KEY);
        setLoading(false);
      }
      initialLoadComplete = true;
    });

    // Écoute des changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        // Ignorer tous les événements jusqu'à ce que le chargement initial soit terminé
        if (!initialLoadComplete) {
          return;
        }

        // Ignorer INITIAL_SESSION et SIGNED_IN si on a déjà un user
        if (event === 'INITIAL_SESSION' || (event === 'SIGNED_IN' && user)) {
          return;
        }

        // Handle logout event explicitly
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          setUserRole(null);
          setCurrentBusinessId(null);
          // Clear cache on logout
          localStorage.removeItem(PROFILE_CACHE_KEY);
          localStorage.removeItem(PROFILE_TIMESTAMP_KEY);
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);

        if (session?.user) {
          setLoading(true);
          await loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          // Clear cache on logout
          localStorage.removeItem(PROFILE_CACHE_KEY);
          localStorage.removeItem(PROFILE_TIMESTAMP_KEY);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Charge le profil utilisateur depuis cache ou Supabase
   */
  const loadUserProfile = async (userId: string) => {
    try {
      // 1. Check cache first
      const cachedProfile = localStorage.getItem(PROFILE_CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(PROFILE_TIMESTAMP_KEY);

      if (cachedProfile && cachedTimestamp) {
        const age = Date.now() - parseInt(cachedTimestamp);
        if (age < CACHE_DURATION) {
          const profile = JSON.parse(cachedProfile);
          setUserProfile(profile);
          setError(null);
          setLoading(false);

          // Refresh in background if cache is older than 1 minute
          if (age > 60 * 1000) {
            refreshProfileInBackground(userId);
          }
          return;
        }
      }

      // 2. No valid cache, load from database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) {
        console.error('❌ Error loading user profile:', error);
        setError(error.message);
        setUserProfile(null);
        return;
      }


      // Save to cache
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(PROFILE_TIMESTAMP_KEY, Date.now().toString());

      setUserProfile(data);
      setError(null);

      // Load business and role from edge function
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/web-get-auth-user`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                userId: data.id,
                authId: userId,
              }),
            }
          );

          if (response.ok) {
            const result = await response.json();
            if (result.data?.businessId) {
              setCurrentBusinessId(result.data.businessId);
              setUserRole(result.data.role || null);
            }
          } else {
          }
        }
      } catch (err) {
      }
    } catch (err) {
      console.error('❌ Exception loading user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh profile in background without blocking UI
   */
  const refreshProfileInBackground = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (!error && data) {
        localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(PROFILE_TIMESTAMP_KEY, Date.now().toString());
        setUserProfile(data);

        // Also refresh business info from edge function
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/web-get-auth-user`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                  userId: data.id,
                  authId: (await supabase.auth.getUser()).data.user?.id,
                }),
              }
            );

            if (response.ok) {
              const result = await response.json();
              if (result.data?.businessId) {
                setCurrentBusinessId(result.data.businessId);
                setUserRole(result.data.role || null);
              }
            }
          }
        } catch (err) {
        }
      }
    } catch (err) {
      console.error('⚠️ Background refresh failed:', err);
    }
  };


  /**
   * Public function to refresh profile (call after creating/updating data)
   */
  const refreshProfile = async () => {
    if (user) {
      // Invalidate cache
      localStorage.removeItem(PROFILE_CACHE_KEY);
      localStorage.removeItem(PROFILE_TIMESTAMP_KEY);
      // Reload profile
      await loadUserProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        isAuthenticated: !!user,
        isPro: userProfile?.pro || false,
        isAdmin: userProfile?.admin || false,
        userRole,
        currentBusinessId,
        setCurrentBusinessId,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook pour accéder au contexte d'authentification
 *
 * @throws {Error} Si utilisé en dehors du AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
