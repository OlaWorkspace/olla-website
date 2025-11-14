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

  useEffect(() => {
    // Récupération initiale de la session depuis localStorage
    console.log('🔄 Initializing AuthContext...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('📦 Initial session:', !!session, 'error:', error);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        console.log('⚠️ No initial session found');
        setLoading(false);
      }
    });

    // Écoute des changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, 'hasSession:', !!session);

        // Si c'est un événement initial, ne rien faire (déjà géré par getSession)
        if (event === 'INITIAL_SESSION') {
          return;
        }

        setUser(session?.user ?? null);

        if (session?.user) {
          setLoading(true); // Important : activer le loading avant de charger le profil
          await loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Charge le profil utilisateur depuis la table 'users'
   */
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('📥 Loading user profile for:', userId);
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
