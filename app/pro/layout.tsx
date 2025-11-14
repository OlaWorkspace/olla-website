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

  // Ne rien afficher si l'utilisateur n'est pas autorisé
  if (!user || !userProfile?.pro) {
    return null;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
