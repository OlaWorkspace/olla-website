"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEdgeFunction } from "@/lib/supabase/hooks/useEdgeFunction";
import { ArrowLeft, Plus, X } from "lucide-react";
import { CATEGORY_OPTIONS } from "@/lib/constants";

interface CreateBusinessForm {
  business_name: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
  user_id: string;
  active: boolean;
}

interface User {
  id: string;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
}

export default function CreateBusinessPage() {
  const router = useRouter();
  const { callFunction } = useEdgeFunction();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateBusinessForm>({
    business_name: "",
    category: "commerce",
    address: "",
    phone: "",
    website: "",
    user_id: "",
    active: true,
  });

  useEffect(() => {
    fetchProfessionalUsers();
  }, []);

  const fetchProfessionalUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await callFunction("admin-get-users", {
        search: "",
        filter: "pro",
      });

      if (error) throw new Error(error);

      const proUsers = data?.users || [];
      setUsers(proUsers);
    } catch (error) {
      console.error("Error fetching professional users:", error);
      alert("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.business_name || !formData.category || !formData.user_id) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await callFunction("admin-create-business", {
        businessData: {
          business_name: formData.business_name,
          category: formData.category,
          formatted_address: formData.address || null,
          formatted_phone_number: formData.phone || null,
          website: formData.website || null,
        },
      });

      if (error) throw new Error(error);

      alert("Commerce créé avec succès!");
      router.push("/admin/businesses");
    } catch (error) {
      console.error("Error creating business:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : "Impossible de créer le commerce"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/businesses" className="p-2 hover:bg-slate-100 rounded-lg transition">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Créer un commerce</h1>
          <p className="text-lg text-slate-600 mt-1">Ajoutez un nouveau commerce à la plateforme</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <label htmlFor="business_name" className="block text-sm font-semibold text-slate-900 mb-2">
              Nom du commerce *
            </label>
            <input
              type="text"
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={handleInputChange}
              placeholder="Ex: Restaurant Au Bon Goût"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* User Selection */}
          <div>
            <label htmlFor="user_id" className="block text-sm font-semibold text-slate-900 mb-2">
              Propriétaire (Professionnel) *
            </label>
            {loading ? (
              <div className="text-slate-600">Chargement des utilisateurs...</div>
            ) : (
              <select
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Sélectionner un professionnel...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.user_firstname} {user.user_lastname} ({user.user_email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-slate-900 mb-2">
              Catégorie *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-slate-900 mb-2">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Ex: 123 Rue de la Paix, 75000 Paris"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Ex: +33 1 23 45 67 89"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-semibold text-slate-900 mb-2">
              Site web
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Ex: https://www.example.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="active" className="text-sm font-medium text-slate-900">
              Commerce actif
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <Link
              href="/admin/businesses"
              className="flex-1 px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-900 hover:bg-slate-50 transition text-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition"
            >
              {submitting ? "Création..." : "Créer le commerce"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
