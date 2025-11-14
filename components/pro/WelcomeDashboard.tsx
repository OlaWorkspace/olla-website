// components/pro/WelcomeDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Users, Gift, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/clients/browser';

interface Business {
  id: string;
  business_name: string;
}

interface SubscriptionPlan {
  name: string;
  slug: string;
}

interface Subscription {
  id: string;
  status: string;
  subscription_plans: SubscriptionPlan | null;
}

interface Dashboard {
  business: Business | null;
  subscription: Subscription | null;
  userFirstname: string;
}

/**
 * Dashboard d'accueil pour les professionnels
 * Utilise useAuth() pour récupérer les données utilisateur et l'instance singleton supabase
 */
export default function WelcomeDashboard() {
  const { user, userProfile } = useAuth();
  const [dashboard, setDashboard] = useState<Dashboard>({
    business: null,
    subscription: null,
    userFirstname: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user || !userProfile) {
        setLoading(false);
        return;
      }

      try {
        // Récupération du business via professionals
        const { data: professional } = await supabase
          .from('professionals')
          .select(`
            business_id,
            businesses (
              id,
              business_name
            )
          `)
          .eq('user_id', userProfile.id)
          .single();

        // Récupération de l'abonnement actif de l'utilisateur
        const { data: sub } = await supabase
          .from('user_subscriptions')
          .select(`
            *,
            subscription_plans (
              name,
              slug
            )
          `)
          .eq('user_id', userProfile.id)
          .eq('status', 'active')
          .single();

        setDashboard({
          business: (Array.isArray(professional?.businesses) ? professional.businesses[0] : professional?.businesses) || null,
          subscription: sub,
          userFirstname: userProfile.user_firstname || (userProfile as any).first_name || ''
        });
      } catch (error) {
        console.error('❌ Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border rounded-full border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-text-light">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-text mb-2">
              Bienvenue, {dashboard.userFirstname}! 👋
            </h1>
            <p className="text-text-light text-lg">
              Votre commerce <strong>{dashboard.business?.business_name}</strong> est actif
            </p>
          </div>
          {dashboard.subscription?.subscription_plans && (
            <div className="bg-white px-6 py-3 rounded-lg border border-primary">
              <p className="text-text-light text-sm mb-1">Plan actuel</p>
              <p className="text-primary font-bold text-lg">
                {dashboard.subscription.subscription_plans.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-text">
          📚 Comment ça marche ?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-lg">1</span>
            </div>
            <h3 className="font-bold text-text mb-2">Vos clients scannent</h3>
            <p className="text-text-light text-sm">
              Vos clients scannent un code QR ou une étiquette NFC pour entrer dans votre programme de fidélisation.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-secondary font-bold text-lg">2</span>
            </div>
            <h3 className="font-bold text-text mb-2">Ils gagnent des points</h3>
            <p className="text-text-light text-sm">
              À chaque achat, vos clients accumulent des points automatiquement. Gérez les règles de points facilement.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-success font-bold text-lg">3</span>
            </div>
            <h3 className="font-bold text-text mb-2">Ils réclament des récompenses</h3>
            <p className="text-text-light text-sm">
              Une fois le seuil atteint, vos clients peuvent réclamer leurs récompenses.
            </p>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="grid md:grid-cols-2 gap-6">
        <Link
          href="/pro/aide"
          className="bg-white border border-border rounded-xl p-6 hover:border-primary transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition">
              <Gift className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="font-bold text-text mb-2">Créer un programme</h3>
          <p className="text-text-light text-sm">
            Configurez votre premier programme de fidélisation en quelques minutes.
          </p>
          <p className="text-primary font-semibold text-sm mt-4">Commencer →</p>
        </Link>

        <Link
          href="/pro/aide"
          className="bg-white border border-border rounded-xl p-6 hover:border-secondary transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="font-bold text-text mb-2">Voir mes statistiques</h3>
          <p className="text-text-light text-sm">
            Analysez les performances de votre programme et l'engagement de vos clients.
          </p>
          <p className="text-secondary font-semibold text-sm mt-4">Analyser →</p>
        </Link>
      </section>

      {/* Stats Section */}
      <section className="bg-white border border-border rounded-xl p-8">
        <h2 className="text-2xl font-bold text-text mb-8">📊 Statistiques</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {/* Stat Card 1 */}
          <div className="text-center p-6 rounded-lg bg-gray-50">
            <div className="flex justify-center mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <p className="text-text-light text-sm mb-2">Clients inscrits</p>
            <p className="text-3xl font-bold text-text">0</p>
          </div>

          {/* Stat Card 2 */}
          <div className="text-center p-6 rounded-lg bg-gray-50">
            <div className="flex justify-center mb-3">
              <Gift className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-text-light text-sm mb-2">Points distribués</p>
            <p className="text-3xl font-bold text-text">0</p>
          </div>

          {/* Stat Card 3 */}
          <div className="text-center p-6 rounded-lg bg-gray-50">
            <div className="flex justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
            <p className="text-text-light text-sm mb-2">Récompenses utilisées</p>
            <p className="text-3xl font-bold text-text">0</p>
          </div>

          {/* Stat Card 4 */}
          <div className="text-center p-6 rounded-lg bg-gray-50">
            <div className="flex justify-center mb-3">
              <Settings className="w-6 h-6 text-info" />
            </div>
            <p className="text-text-light text-sm mb-2">Programmes actifs</p>
            <p className="text-3xl font-bold text-text">0</p>
          </div>
        </div>
      </section>

      {/* Get Started */}
      <section className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">Prêt à démarrer ?</h2>
        <p className="mb-6 text-white/90">
          Créez votre premier programme de fidélisation et commencez à fidéliser vos clients dès maintenant.
        </p>
        <Link
          href="/pro/aide"
          className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-opacity-90 transition"
        >
          Créer mon premier programme
        </Link>
      </section>
    </div>
  );
}
