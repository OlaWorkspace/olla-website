"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/clients/browser";
import { Search, ChevronRight, Users, Shield, Briefcase } from "lucide-react";

interface User {
  id: string;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  pro: boolean;
  admin: boolean;
  created_at: string;
}

type FilterType = "all" | "pro" | "client" | "admin";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filterType]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.user_firstname?.toLowerCase().includes(query) ||
          user.user_lastname?.toLowerCase().includes(query) ||
          user.user_email?.toLowerCase().includes(query)
      );
    }

    // Filter by type
    switch (filterType) {
      case "pro":
        filtered = filtered.filter((user) => user.pro && !user.admin);
        break;
      case "client":
        filtered = filtered.filter((user) => !user.pro && !user.admin);
        break;
      case "admin":
        filtered = filtered.filter((user) => user.admin);
        break;
      default:
        break;
    }

    setFilteredUsers(filtered);
  };

  const getUserBadge = (user: User) => {
    if (user.admin) {
      return { text: "Admin", bg: "bg-red-100", text_color: "text-red-800" };
    }
    if (user.pro) {
      return { text: "Professionnel", bg: "bg-purple-100", text_color: "text-purple-800" };
    }
    return { text: "Client", bg: "bg-green-100", text_color: "text-green-800" };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Gestion des utilisateurs</h1>
        <p className="text-lg text-slate-600 mt-2">Gérez et consultez tous les utilisateurs de la plateforme</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "all" as FilterType, label: "Tous", count: users.length },
              { value: "client" as FilterType, label: "Clients", count: users.filter((u) => !u.pro && !u.admin).length },
              { value: "pro" as FilterType, label: "Professionnels", count: users.filter((u) => u.pro && !u.admin).length },
              { value: "admin" as FilterType, label: "Admins", count: users.filter((u) => u.admin).length },
            ]
          ).map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {filter.label} <span className="text-sm ml-1">({filter.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-slate-200 rounded-full border-t-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-slate-600">Chargement des utilisateurs...</p>
            </div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nom</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Inscrit</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => {
                  const badge = getUserBadge(user);
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="font-semibold text-blue-600">
                              {user.user_firstname[0]}
                              {user.user_lastname[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {user.user_firstname} {user.user_lastname}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.user_email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text_color}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(user.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          Détails
                          <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">Aucun utilisateur trouvé</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700 font-medium">Clients</p>
            <p className="text-2xl font-bold text-green-900">{users.filter((u) => !u.pro && !u.admin).length}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-700 font-medium">Professionnels</p>
            <p className="text-2xl font-bold text-purple-900">{users.filter((u) => u.pro && !u.admin).length}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-700 font-medium">Administrateurs</p>
            <p className="text-2xl font-bold text-red-900">{users.filter((u) => u.admin).length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
