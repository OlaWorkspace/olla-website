'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/pro/Sidebar';

/**
 * Layout protégé pour l'espace professionnel
 * Vérifie que l'utilisateur est connecté et a le statut "pro"
 */
export default function ProLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (!userProfile?.pro) {
        router.push('/');
      }
    }
  }, [user, userProfile, loading, router]);

  // Si pas pro/pas connecté: afficher rien (redirection en background)
  if (!loading && (!user || !userProfile?.pro)) {
    return null;
  }

  // Pendant le loading, afficher une page blanche (loading ultra rapide grâce au cache)
  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-0 lg:ml-64 bg-slate-50">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
