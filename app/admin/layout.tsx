'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/clients/browser';
import { Settings, Users, CreditCard, LogOut } from 'lucide-react';

/**
 * Layout protégé pour l'espace admin
 * Vérifie que l'utilisateur est connecté et a le statut "admin"
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, userProfile, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (!isAdmin) {
        router.push('/pro');
      }
    }
  }, [user, isAdmin, loading, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  // Afficher un écran de chargement pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Ne rien afficher si l'utilisateur n'est pas admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-sm text-slate-500 mt-1">
            {userProfile?.user_firstname} {userProfile?.user_lastname}
          </p>
        </div>

        <nav className="mt-6">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            <Settings className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/subscriptions"
            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            <CreditCard className="w-5 h-5" />
            <span>Subscriptions</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            <Users className="w-5 h-5" />
            <span>Utilisateurs</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition w-full mt-6"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
