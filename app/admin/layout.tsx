'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/clients/browser';
import { LayoutDashboard, Users, Building2, CreditCard, LogOut, Menu, X, BarChart3 } from 'lucide-react';

const menuItems = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { label: 'Utilisateurs', href: '/admin/users', icon: Users },
  { label: 'Commerces', href: '/admin/businesses', icon: Building2 },
  { label: 'Abonnements', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Statistiques', href: '/admin/stats', icon: BarChart3 },
];

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
  const pathname = usePathname();
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
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full border-t-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Vérification des droits admin...</p>
        </div>
      </div>
    );
  }

  // Ne rien afficher si l'utilisateur n'est pas admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
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
        className={`w-64 bg-slate-900 text-white shadow-lg fixed right-0 lg:left-0 lg:right-auto top-0 min-h-screen z-40 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 mt-14 lg:mt-0">
          <h1 className="text-2xl font-bold">Olla Admin</h1>
          <p className="text-sm text-slate-400 mt-2">
            {userProfile?.user_firstname} {userProfile?.user_lastname}
          </p>
          <p className="text-xs text-slate-500 mt-1">Administrateur</p>
        </div>

        {/* Navigation */}
        <nav className="py-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700 bg-slate-900">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition font-semibold text-sm"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 lg:ml-64 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
        {children}
      </main>
    </div>
  );
}
