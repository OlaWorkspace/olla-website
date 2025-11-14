"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/clients/browser";
import { Users, CreditCard, Building } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalSubscriptions: number;
  totalBusinesses: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSubscriptions: 0,
    totalBusinesses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersResult, subscriptionsResult, businessesResult] =
          await Promise.all([
            supabase.from("users").select("id", { count: "exact", head: true }),
            supabase
              .from("user_subscriptions")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("businesses")
              .select("id", { count: "exact", head: true }),
          ]);

        setStats({
          totalUsers: usersResult.count || 0,
          totalSubscriptions: subscriptionsResult.count || 0,
          totalBusinesses: businessesResult.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-slate-600">Chargement des statistiques...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Dashboard Administrateur
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Vue d'ensemble de la plateforme
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Utilisateurs
            </h3>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
          <p className="text-sm text-slate-600 mt-2">Utilisateurs inscrits</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Abonnements
            </h3>
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.totalSubscriptions}
          </p>
          <p className="text-sm text-slate-600 mt-2">Abonnements actifs</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Commerces</h3>
            <Building className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.totalBusinesses}
          </p>
          <p className="text-sm text-slate-600 mt-2">Commerces enregistrés</p>
        </div>
      </div>
    </div>
  );
}
