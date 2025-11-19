"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEdgeFunction } from "@/lib/supabase/hooks/useEdgeFunction";
import { ArrowLeft, Shield, TrendingUp, TrendingDown, Mail, CalendarDays, User, AlertCircle } from "lucide-react";
import Link from "next/link";

interface UserDetail {
  id: string;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_phone?: string;
  pro: boolean;
  admin: boolean;
  created_at: string;
  onboarding_status?: string;
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { callFunction } = useEdgeFunction();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await callFunction("admin-get-user", {
        userId,
      });

      if (fetchError) {
        throw new Error(fetchError);
      }

      if (data?.user) {
        setUser(data.user);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error fetching user";
      console.error("Error fetching user:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async () => {
    if (!user || user.pro) return;

    if (!confirm(`Promouvoir ${user.user_firstname} ${user.user_lastname} en professionnel ?`)) return;

    try {
      setActionLoading(true);
      const response = await fetch("/api/admin/users/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      alert("Utilisateur promu avec succès!");
      fetchUser();
    } catch (error) {
      console.error("Error promoting user:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : "Impossible de promouvoir l'utilisateur"}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDemoteUser = async () => {
    if (!user || !user.pro || user.admin) return;

    if (!confirm(`Rétrograder ${user.user_firstname} ${user.user_lastname} en client ?`)) return;

    try {
      setActionLoading(true);
      const response = await fetch("/api/admin/users/demote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      alert("Utilisateur rétrogradé avec succès!");
      fetchUser();
    } catch (error) {
      console.error("Error demoting user:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : "Impossible de rétrograder l'utilisateur"}`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 rounded-full border-t-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!user && !error) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Utilisateur non trouvé</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <Link href="/admin/users" className="text-blue-600 hover:underline">
          Retour à la liste des utilisateurs
        </Link>
      </div>
    );
  }

  const userBadge = user.admin ? "Admin" : user.pro ? "Professionnel" : "Client";
  const badgeColor = user.admin ? "bg-red-100 text-red-800" : user.pro ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users" className="p-2 hover:bg-slate-100 rounded-lg transition">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Détails utilisateur</h1>
          <p className="text-lg text-slate-600 mt-1">Consultez et gérez les informations utilisateur</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {user.user_firstname[0]}
                    {user.user_lastname[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {user.user_firstname} {user.user_lastname}
                  </h2>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${badgeColor} mt-2`}>
                    {userBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium text-slate-900">{user.user_email}</p>
                </div>
              </div>

              {user.user_phone && (
                <div className="flex items-start gap-3">
                  <User size={20} className="text-slate-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600">Téléphone</p>
                    <p className="font-medium text-slate-900">{user.user_phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <CalendarDays size={20} className="text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Inscrit le</p>
                  <p className="font-medium text-slate-900">{formatDate(user.created_at)}</p>
                </div>
              </div>

              {user.onboarding_status && (
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-slate-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600">Statut onboarding</p>
                    <p className="font-medium text-slate-900 capitalize">{user.onboarding_status}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Actions</h3>

            {user.admin ? (
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <Shield size={20} className="text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">Administrateur</p>
                  <p className="text-sm text-red-800">Cet utilisateur est administrateur et ne peut pas être modifié.</p>
                </div>
              </div>
            ) : user.pro ? (
              <button
                onClick={handleDemoteUser}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition"
              >
                <TrendingDown size={20} />
                {actionLoading ? "Traitement..." : "Rétrograder en Client"}
              </button>
            ) : (
              <button
                onClick={handlePromoteUser}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition"
              >
                <TrendingUp size={20} />
                {actionLoading ? "Traitement..." : "Promouvoir en Professionnel"}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-slate-900 mb-4">Informations</h3>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">ID Utilisateur</p>
                <p className="font-mono text-sm text-slate-900 break-all">{user.id}</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-sm font-medium text-blue-900">
                  {user.pro ? "Compte Professionnel" : "Compte Client"}
                </p>
              </div>

              {user.admin && (
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <p className="text-sm font-medium text-red-900">Accès Admin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
