"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useEdgeFunction } from "@/lib/supabase/hooks/useEdgeFunction";
import { Search, ChevronRight, Building2, Plus, MapPin, User } from "lucide-react";
import { BUSINESS_CATEGORIES } from "@/lib/constants";

interface Business {
  id: string;
  business_name: string;
  category: string;
  address?: string;
  user_id: string;
  active: boolean;
  created_at: string;
  users?: { user_firstname: string; user_lastname: string };
}

type SortType = "newest" | "oldest" | "name";

export default function BusinessesAdminPage() {
  const { callFunction } = useEdgeFunction();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<SortType>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    filterAndSortBusinesses();
  }, [businesses, searchQuery, sortType]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await callFunction("admin-get-businesses", {});

      if (fetchError) {
        throw new Error(fetchError);
      }

      setBusinesses(data?.businesses || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error fetching businesses";
      console.error("Error fetching businesses:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBusinesses = () => {
    let filtered = businesses;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (business) =>
          business.business_name?.toLowerCase().includes(query) ||
          business.address?.toLowerCase().includes(query) ||
          BUSINESS_CATEGORIES[business.category as keyof typeof BUSINESS_CATEGORIES]?.label
            ?.toLowerCase()
            .includes(query)
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortType) {
      case "name":
        sorted.sort((a, b) => a.business_name.localeCompare(b.business_name));
        break;
      case "oldest":
        sorted.reverse();
        break;
      case "newest":
      default:
        break;
    }

    setFilteredBusinesses(sorted);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = BUSINESS_CATEGORIES[category as keyof typeof BUSINESS_CATEGORIES];
    return categoryData?.icon || "🏪";
  };

  const getCategoryLabel = (category: string) => {
    const categoryData = BUSINESS_CATEGORIES[category as keyof typeof BUSINESS_CATEGORIES];
    return categoryData?.label || category;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Gestion des commerces</h1>
          <p className="text-lg text-slate-600 mt-2">Gérez tous les commerces inscrits</p>
        </div>
        <Link
          href="/admin/businesses/create"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          <Plus size={20} />
          Nouveau commerce
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, adresse ou catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "newest" as SortType, label: "Plus récent" },
              { value: "oldest" as SortType, label: "Plus ancien" },
              { value: "name" as SortType, label: "Alphabétique" },
            ]
          ).map((sort) => (
            <button
              key={sort.value}
              onClick={() => setSortType(sort.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                sortType === sort.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>

      {/* Businesses Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-slate-200 rounded-full border-t-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-slate-600">Chargement des commerces...</p>
            </div>
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Link
                key={business.id}
                href={`/admin/businesses/${business.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition group"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-3xl mt-1">{getCategoryIcon(business.category)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition truncate">
                          {business.business_name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">{getCategoryLabel(business.category)}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 transition flex-shrink-0" />
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    {business.address && (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="truncate">{business.address}</span>
                      </div>
                    )}

                    {business.users && (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <User size={16} className="mt-0.5 flex-shrink-0" />
                        <span>
                          {(business.users as any).user_firstname} {(business.users as any).user_lastname}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        business.active
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {business.active ? "Actif" : "Inactif"}
                    </span>
                    <span className="text-xs text-slate-500">{formatDate(business.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
            <div className="text-center">
              <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">Aucun commerce trouvé</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700 font-medium">Commerces actifs</p>
            <p className="text-2xl font-bold text-green-900">{businesses.filter((b) => b.active).length}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-700 font-medium">Total commerces</p>
            <p className="text-2xl font-bold text-slate-900">{businesses.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
