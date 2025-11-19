'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/clients/browser';
import { Settings, Users, CreditCard, LogOut, Menu, X } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white text-slate-900 rounded-lg shadow-lg hover:bg-slate-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg fixed left-0 top-0 h-screen z-40 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 mt-14 lg:mt-0">
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-sm text-slate-500 mt-1">
            {userProfile?.user_firstname} {userProfile?.user_lastname}
          </p>
        </div>

        <nav className="mt-6 pb-6">
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            <Settings className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/subscriptions"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            <CreditCard className="w-5 h-5" />
            <span>Subscriptions</span>
          </Link>

          <Link
            href="/admin/users"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            <Users className="w-5 h-5" />
            <span>Utilisateurs</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition w-full mt-6 text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 lg:ml-64 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
