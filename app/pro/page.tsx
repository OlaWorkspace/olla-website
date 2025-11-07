'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/clients/browser';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isPro: boolean;
  };
  subscription: {
    id: string;
    status: string;
    startedAt: string;
    expiresAt: string;
    plan: {
      id: string;
      name: string;
      slug: string;
      description: string;
      price_monthly: number;
      features: string[];
      max_loyalty_programs: number | null;
    };
  } | null;
  plan: {
    slug: string;
    name: string;
  };
  businesses: Array<{
    id: string;
    name: string;
    category: string;
    address: string;
    active: boolean;
    pointLimit: number;
    totalPointsEarned: number;
    totalRewardsRedeemed: number;
  }>;
  stats: {
    activeBusinesses: number;
    totalClients: number | string;
    totalPointsEarned: number | string;
    totalRewardsRedeemed: number | string;
    rewardsRate: number | null;
    topPerformingBusiness: any;
    topClients?: Array<{
      name: string;
      points: number;
    }>;
    peakHours?: Array<{
      hour: number;
      count: number;
    }>;
    avgPointsPerVisit?: number;
    pointsDistributionLast7Days?: Array<{
      date: string;
      points: number;
      rewards: number;
    }>;
    newClientsThisMonth?: number;
    returningClientsRate?: number;
    isBlurred: boolean;
    totalStats: {
      activeBusinesses: number;
    };
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setError('User not authenticated');
          return;
        }

        const { data: dbUser, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', authUser.id)
          .single();

        if (userError || !dbUser) {
          setError('Failed to fetch user data');
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          setError('No access token available');
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/web-get-pro-dashboard`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              userId: dbUser.id,
              authId: authUser.id,
              businessId: selectedBusinessId,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch dashboard data (${response.status})`);
        }

        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [selectedBusinessId]);

  // Sélectionner automatiquement le premier commerce au chargement (il n'y en aura qu'un)
  useEffect(() => {
    if (data?.businesses && data.businesses.length > 0) {
      setSelectedBusinessId(data.businesses[0].id);
    }
  }, [data?.businesses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Chargement...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error || 'Erreur lors du chargement'}</p>
      </div>
    );
  }

  const isBlurred = data.stats.isBlurred;
  const hasEnoughData = !isBlurred && data.stats.topClients && data.stats.topClients.length > 0;

  // Formatter les dates pour le graphique
  const formattedChartData = data.stats.pointsDistributionLast7Days?.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          Vue d'ensemble
        </h1>
        <p className="text-sm text-slate-600">
          {data.businesses[0]?.name || 'Votre activité'}
        </p>
      </div>

      {/* Upgrade Banner for Free Plan */}
      {data.plan.slug === 'free' && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Débloquez toutes les statistiques</h3>
              <p className="text-sm text-slate-700 mb-4">
                Accédez aux analyses détaillées, graphiques d'évolution et insights pour développer votre activité.
              </p>
              <Link
                href="/pro/abonnements"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
              >
                Voir les offres
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Clients totaux</p>
          <p className={`text-3xl font-semibold ${isBlurred ? 'text-slate-300' : 'text-slate-900'}`}>
            {isBlurred && data.stats.totalClients !== 0 ? '•••' : data.stats.totalClients}
          </p>
          {data.stats.newClientsThisMonth !== undefined && !isBlurred && (
            <p className="text-xs text-emerald-600 mt-2">+{data.stats.newClientsThisMonth} ce mois</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Points distribués</p>
          <p className={`text-3xl font-semibold ${isBlurred ? 'text-slate-300' : 'text-slate-900'}`}>
            {isBlurred ? '•••' : data.stats.totalPointsEarned}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Récompenses utilisées</p>
          <p className={`text-3xl font-semibold ${isBlurred ? 'text-slate-300' : 'text-slate-900'}`}>
            {isBlurred ? '•••' : data.stats.totalRewardsRedeemed}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Taux de fidélité</p>
          <p className={`text-3xl font-semibold ${isBlurred ? 'text-slate-300' : 'text-slate-900'}`}>
            {isBlurred ? '•••' : `${data.stats.returningClientsRate || 0}%`}
          </p>
          {!isBlurred && (
            <p className="text-xs text-slate-500 mt-2">Clients récurrents</p>
          )}
        </div>
      </div>

      {/* Graphiques - Toujours affichés avec état vide si pas de données */}
      {!isBlurred && (
        <>
          {/* Graphique d'évolution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <h3 className="text-sm font-semibold text-slate-900 mb-6">Évolution des 7 derniers jours</h3>
            {formattedChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={2} name="Points distribués" />
                  <Line type="monotone" dataKey="rewards" stroke="#10b981" strokeWidth={2} name="Récompenses utilisées" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Pas encore disponible</p>
                  <p className="text-xs text-slate-500">Il n'y a pas assez de clients pour afficher ce graphique</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Top Clients */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Clients les plus fidèles</h3>
              {data.stats.topClients && data.stats.topClients.length > 0 ? (
                <div className="space-y-3">
                  {data.stats.topClients.map((client, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <span className="text-xs font-semibold text-slate-600">{idx + 1}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700">{client.name}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{client.points} pts</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Pas encore disponible</p>
                  <p className="text-xs text-slate-500">Il n'y a pas assez de clients</p>
                </div>
              )}
            </div>

            {/* Heures d'affluence */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Heures de forte affluence</h3>
              {data.stats.peakHours && data.stats.peakHours.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.stats.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(hour) => `${hour}h`}
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      labelFormatter={(hour) => `${hour}h00 - ${hour + 1}h00`}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Pas encore disponible</p>
                    <p className="text-xs text-slate-500">Il n'y a pas assez de clients</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
