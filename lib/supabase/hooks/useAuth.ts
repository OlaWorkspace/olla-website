'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/clients/browser';
import { User } from '@supabase/supabase-js';
import type { User as UserProfile } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser || null);

        if (authUser) {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', authUser.id)
            .single();

          if (profileError) {
            setError(profileError.message);
          } else {
            setUserProfile(profile);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user,
    isPro: userProfile?.pro || false
  };
}
