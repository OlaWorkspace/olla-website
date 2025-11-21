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

  // Cache keys
  const PROFILE_CACHE_KEY = 'olla_user_profile';
  const PROFILE_TIMESTAMP_KEY = 'olla_user_profile_timestamp';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    let initialLoadComplete = false;

    // Récupération initiale de la session depuis localStorage
    console.log('🔄 Initializing AuthContext...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('📦 Initial session:', !!session, 'error:', error);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        console.log('⚠️ No initial session found');
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
        console.log('🔐 Auth state changed:', event, 'hasSession:', !!session);

        // Ignorer tous les événements jusqu'à ce que le chargement initial soit terminé
        if (!initialLoadComplete) {
          console.log('⏭️ Skipping auth change - initial load not complete');
          return;
        }

        // Ignorer INITIAL_SESSION et SIGNED_IN si on a déjà un user
        if (event === 'INITIAL_SESSION' || (event === 'SIGNED_IN' && user)) {
          console.log('⏭️ Skipping redundant auth event');
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
          console.log('⚡ Using cached profile (age:', Math.round(age / 1000), 's)');
          const profile = JSON.parse(cachedProfile);
          setUserProfile(profile);
          setError(null);
          setLoading(false);

          // Refresh in background if cache is older than 1 minute
          if (age > 60 * 1000) {
            console.log('🔄 Refreshing profile in background...');
            refreshProfileInBackground(userId);
          }
          return;
        }
      }

      // 2. No valid cache, load from database
      console.log('📥 Loading user profile from database for:', userId);
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

      console.log('✅ User profile loaded:', data?.pro ? 'Pro' : 'User', data?.admin ? '(Admin)' : '');

      // Save to cache
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(PROFILE_TIMESTAMP_KEY, Date.now().toString());

      setUserProfile(data);
      setError(null);
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
      console.log('🔄 Manual profile refresh requested');
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
