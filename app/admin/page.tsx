"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/clients/browser";
import { Users, CreditCard, Building2, TrendingUp, Plus, ChevronRight } from "lucide-react";

interface Stats {
  totalUsers: number;
  proUsers: number;
  adminUsers: number;
  totalSubscriptions: number;
  totalBusinesses: number;
  activeBusinesses: number;
}

interface RecentUser {
  id: string;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  pro: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    proUsers: 0,
    adminUsers: 0,
    totalSubscriptions: 0,
    totalBusinesses: 0,
    activeBusinesses: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [usersResult, proUsersResult, adminUsersResult, subscriptionsResult, businessesResult, activeBusinessesResult, recentUsersResult] =
          await Promise.all([
            supabase.from("users").select("id", { count: "exact", head: true }),
            supabase.from("users").select("id", { count: "exact", head: true }).eq("pro", true),
            supabase.from("users").select("id", { count: "exact", head: true }).eq("admin", true),
            supabase.from("user_subscriptions").select("id", { count: "exact", head: true }),
            supabase.from("businesses").select("id", { count: "exact", head: true }),
            supabase.from("businesses").select("id", { count: "exact", head: true }).eq("active", true),
            supabase.from("users").select("id,user_firstname,user_lastname,user_email,pro,created_at").order("created_at", { ascending: false }).limit(5),
          ]);

        setStats({
          totalUsers: usersResult.count || 0,
          proUsers: proUsersResult.count || 0,
          adminUsers: adminUsersResult.count || 0,
          totalSubscriptions: subscriptionsResult.count || 0,
          totalBusinesses: businessesResult.count || 0,
          activeBusinesses: activeBusinessesResult.count || 0,
        });

        if (recentUsersResult.data) {
          setRecentUsers(recentUsersResult.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 rounded-full border-t-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, subtitle, color }: any) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Tableau de bord Admin</h1>
        <p className="text-lg text-slate-600 mt-2">Vue d'ensemble de la plateforme Olla</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Utilisateurs"
          value={stats.totalUsers}
          icon={Users}
          subtitle={`${stats.proUsers} professionnels, ${stats.adminUsers} admin`}
          color="#3B82F6"
        />
        <StatCard
          title="Commerces"
          value={stats.totalBusinesses}
          icon={Building2}
          subtitle={`${stats.activeBusinesses} actifs`}
          color="#10B981"
        />
        <StatCard
          title="Abonnements"
          value={stats.totalSubscriptions}
          icon={CreditCard}
          subtitle="Plans actifs"
          color="#8B5CF6"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Utilisateurs récents</h2>
            <Link href="/admin/users" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir tous
            </Link>
          </div>

          <div className="space-y-4">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      {user.user_firstname} {user.user_lastname}
                    </p>
                    <p className="text-sm text-slate-600">{user.user_email}</p>
                  </div>
                  {user.pro && (
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded">Pro</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-center py-4">Aucun utilisateur</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Actions rapides</h2>

          <div className="space-y-3">
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition group"
            >
              <div className="flex items-center gap-3">
                <Users size={20} className="text-blue-600" />
                <span className="font-medium text-slate-900">Gérer utilisateurs</span>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-600" />
            </Link>

            <Link
              href="/admin/businesses"
              className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition group"
            >
              <div className="flex items-center gap-3">
                <Building2 size={20} className="text-green-600" />
                <span className="font-medium text-slate-900">Gérer commerces</span>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-600" />
            </Link>

            <Link
              href="/admin/subscriptions"
              className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition group"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-purple-600" />
                <span className="font-medium text-slate-900">Gérer abonnements</span>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
        <div className="flex gap-4">
          <TrendingUp size={24} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Bienvenue dans l'interface d'administration</h3>
            <p className="text-sm text-blue-800">
              Utilisez les menus latéraux pour gérer les utilisateurs, commerces, abonnements et consultez les statistiques détaillées de votre plateforme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
