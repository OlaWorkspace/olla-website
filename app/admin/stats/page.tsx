"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/clients/browser";
import { TrendingUp, Users, Building2, CreditCard, Calendar, DollarSign, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

interface Stats {
  totalUsers: number;
  newUsersThisMonth: number;
  proUsers: number;
  totalBusinesses: number;
  activeBusinesses: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalTags: number;
  nfcTags: number;
  qrTags: number;
  revenue?: number;
}

interface MonthlyData {
  month: string;
  users: number;
  businesses: number;
  subscriptions: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    newUsersThisMonth: 0,
    proUsers: 0,
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    totalTags: 0,
    nfcTags: 0,
    qrTags: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch all counts
      const [
        usersResult,
        proUsersResult,
        businessesResult,
        activeBusinessesResult,
        subscriptionsResult,
        activeSubscriptionsResult,
        tagsResult,
        nfcTagsResult,
        qrTagsResult,
      ] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id", { count: "exact", head: true }).eq("pro", true),
        supabase.from("businesses").select("id", { count: "exact", head: true }),
        supabase.from("businesses").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("user_subscriptions").select("id", { count: "exact", head: true }),
        supabase
          .from("user_subscriptions")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase.from("business_tags").select("id", { count: "exact", head: true }),
        supabase.from("business_tags").select("id", { count: "exact", head: true }).eq("tag_type", "NFC"),
        supabase.from("business_tags").select("id", { count: "exact", head: true }).eq("tag_type", "QRC"),
      ]);

      // Get new users this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsersResult = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .gte("created_at", firstDayOfMonth.toISOString());

      setStats({
        totalUsers: usersResult.count || 0,
        newUsersThisMonth: newUsersResult.count || 0,
        proUsers: proUsersResult.count || 0,
        totalBusinesses: businessesResult.count || 0,
        activeBusinesses: activeBusinessesResult.count || 0,
        totalSubscriptions: subscriptionsResult.count || 0,
        activeSubscriptions: activeSubscriptionsResult.count || 0,
        totalTags: tagsResult.count || 0,
        nfcTags: nfcTagsResult.count || 0,
        qrTags: qrTagsResult.count || 0,
      });

      // Generate mock monthly data (in production, you'd fetch this from your database)
      generateMonthlyData();
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = () => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"];
    const data = months.map((month, index) => ({
      month,
      users: Math.floor(Math.random() * 100) + 50 + index * 20,
      businesses: Math.floor(Math.random() * 80) + 30 + index * 15,
      subscriptions: Math.floor(Math.random() * 60) + 20 + index * 10,
    }));
    setMonthlyData(data);
  };

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

  const StatCard = ({ title, value, icon: Icon, subtitle, color, trend }: any) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && <p className="text-xs text-green-600 font-semibold mt-1">↑ {trend}</p>}
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
        <h1 className="text-4xl font-bold text-slate-900">Statistiques</h1>
        <p className="text-lg text-slate-600 mt-2">Analyse complète de la plateforme</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Utilisateurs"
          value={stats.totalUsers}
          icon={Users}
          subtitle={`+${stats.newUsersThisMonth} ce mois`}
          color="#3B82F6"
          trend={`${stats.proUsers} pro`}
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
          subtitle={`${stats.activeSubscriptions} actifs`}
          color="#8B5CF6"
        />
        <StatCard
          title="Tags"
          value={stats.totalTags}
          icon={Activity}
          subtitle={`${stats.nfcTags} NFC, ${stats.qrTags} QR`}
          color="#F59E0B"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Croissance (6 derniers mois)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" name="Utilisateurs" />
              <Line type="monotone" dataKey="businesses" stroke="#10B981" name="Commerces" />
              <Line type="monotone" dataKey="subscriptions" stroke="#8B5CF6" name="Abonnements" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Distribution des inscriptions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#3B82F6" name="Utilisateurs" />
              <Bar dataKey="businesses" fill="#10B981" name="Commerces" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Répartition utilisateurs
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Clients</span>
                <span className="text-sm font-semibold text-slate-900">
                  {stats.totalUsers - stats.proUsers}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${((stats.totalUsers - stats.proUsers) / stats.totalUsers) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Professionnels</span>
                <span className="text-sm font-semibold text-slate-900">{stats.proUsers}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${(stats.proUsers / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-green-600" />
            États des commerces
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-700 font-medium">Actifs</p>
              <p className="text-2xl font-bold text-green-900">{stats.activeBusinesses}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-700 font-medium">Inactifs</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalBusinesses - stats.activeBusinesses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-purple-600" />
            Abonnements
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-700 font-medium">Actifs</p>
              <p className="text-2xl font-bold text-purple-900">{stats.activeSubscriptions}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-700 font-medium">Total</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalSubscriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-amber-600" />
            Tags actifs
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">NFC</p>
              <p className="text-2xl font-bold text-blue-900">{stats.nfcTags}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-700 font-medium">QR Code</p>
              <p className="text-2xl font-bold text-purple-900">{stats.qrTags}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
