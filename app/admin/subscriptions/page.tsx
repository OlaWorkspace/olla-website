"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/clients/browser";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  features: string[];
  max_loyalty_programs: number | null;
  is_active: boolean;
  display_order: number;
  promotion_enabled: boolean;
  promotion_label: string | null;
  promotion_months_free: number;
  promotion_quantity_limit: number | null;
  promotion_quantity_used: number;
  promotion_start_date: string | null;
  promotion_end_date: string | null;
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price_monthly: 0,
    features: [] as string[],
    max_loyalty_programs: null as number | null,
    is_active: true,
    display_order: 0,
    promotion_enabled: false,
    promotion_label: "",
    promotion_months_free: 0,
    promotion_quantity_limit: null as number | null,
    promotion_start_date: "",
    promotion_end_date: "",
  });
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('No access token');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-get-subscription-plans`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch plans');
      }

      setPlans(result.plans || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? null
            : parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('No access token');
      }

      const dataToSave = {
        ...formData,
        features: formData.features.length > 0 ? formData.features : [],
        promotion_start_date: formData.promotion_start_date || null,
        promotion_end_date: formData.promotion_end_date || null,
      };

      const endpoint = editingPlan
        ? 'admin-update-subscription-plan'
        : 'admin-create-subscription-plan';

      const body = editingPlan
        ? { planId: editingPlan.id, ...dataToSave }
        : dataToSave;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save plan');
      }

      setShowModal(false);
      setEditingPlan(null);
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("Erreur lors de la sauvegarde: " + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || "",
      price_monthly: plan.price_monthly,
      features: plan.features || [],
      max_loyalty_programs: plan.max_loyalty_programs,
      is_active: plan.is_active,
      display_order: plan.display_order,
      promotion_enabled: plan.promotion_enabled || false,
      promotion_label: plan.promotion_label || "",
      promotion_months_free: plan.promotion_months_free || 0,
      promotion_quantity_limit: plan.promotion_quantity_limit,
      promotion_start_date: plan.promotion_start_date || "",
      promotion_end_date: plan.promotion_end_date || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce plan ?")) return;

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('No access token');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-delete-subscription-plan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ planId: id }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete plan');
      }

      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Erreur lors de la suppression: " + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price_monthly: 0,
      features: [],
      max_loyalty_programs: null,
      is_active: true,
      display_order: 0,
      promotion_enabled: false,
      promotion_label: "",
      promotion_months_free: 0,
      promotion_quantity_limit: null,
      promotion_start_date: "",
      promotion_end_date: "",
    });
    setNewFeature("");
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleEditFeature = (index: number, newValue: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? newValue : f)),
    }));
  };

  if (loading) {
    return <div className="text-slate-600">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Gestion des Abonnements
          </h1>
          <p className="text-lg text-slate-600">
            Créez et gérez les plans d'abonnement et promotions
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPlan(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Nouveau Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500">{plan.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {plan.promotion_enabled && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-900 text-sm">
                    {plan.promotion_label || "Promotion active"}
                  </span>
                </div>
                <p className="text-xs text-green-700">
                  {plan.promotion_months_free} mois gratuits
                </p>
                {plan.promotion_quantity_limit && (
                  <p className="text-xs text-green-700">
                    {plan.promotion_quantity_used}/{plan.promotion_quantity_limit}{" "}
                    utilisés
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              {plan.promotion_enabled && plan.promotion_months_free > 0 ? (
                <>
                  <p className="text-3xl font-bold text-slate-900">
                    0,00€
                    <span className="text-sm font-normal text-slate-600">/mois</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    pendant {plan.promotion_months_free} mois
                  </p>
                  <p className="text-xs text-slate-500 line-through">
                    Puis {(plan.price_monthly / 100).toFixed(2)}€/mois
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-slate-900">
                    {(plan.price_monthly / 100).toFixed(2)}€
                    <span className="text-sm font-normal text-slate-600">/mois</span>
                  </p>
                  <p className="text-xs text-slate-500">{plan.price_monthly} centimes</p>
                </>
              )}
            </div>

            {plan.description && (
              <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
            )}

            <div className="space-y-2 mb-4">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  plan.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {plan.is_active ? "Actif" : "Inactif"}
              </span>
              <span className="text-xs text-slate-500">
                Ordre: {plan.display_order}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              {editingPlan ? "Modifier le plan" : "Nouveau plan"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom du plan *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    pattern="[a-z0-9_-]+"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Gestion des features */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Caractéristiques (Features)
                </label>
                <div className="space-y-2 mb-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleEditFeature(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Ajouter une caractéristique..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Prix mensuel (centimes)
                  </label>
                  <input
                    type="number"
                    name="price_monthly"
                    value={formData.price_monthly}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="ex: 1990 pour 19.90€"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {formData.price_monthly > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      = {(formData.price_monthly / 100).toFixed(2)}€/mois
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Programmes max
                  </label>
                  <input
                    type="number"
                    name="max_loyalty_programs"
                    value={formData.max_loyalty_programs || ""}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                  Plan actif
                </label>
              </div>

              {/* Section Promotion */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    name="promotion_enabled"
                    id="promotion_enabled"
                    checked={formData.promotion_enabled}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="promotion_enabled"
                    className="text-sm font-bold text-slate-900"
                  >
                    Activer une promotion
                  </label>
                </div>

                {formData.promotion_enabled && (
                  <div className="space-y-4 bg-green-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Libellé de la promotion
                      </label>
                      <input
                        type="text"
                        name="promotion_label"
                        value={formData.promotion_label}
                        onChange={handleInputChange}
                        placeholder="Offre de lancement"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Mois gratuits
                        </label>
                        <input
                          type="number"
                          name="promotion_months_free"
                          value={formData.promotion_months_free}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Quantité limite (optionnel)
                        </label>
                        <input
                          type="number"
                          name="promotion_quantity_limit"
                          value={formData.promotion_quantity_limit || ""}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="Illimité"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Date de début
                        </label>
                        <input
                          type="date"
                          name="promotion_start_date"
                          value={formData.promotion_start_date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          name="promotion_end_date"
                          value={formData.promotion_end_date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPlan(null);
                    resetForm();
                  }}
                  className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold px-4 py-2 rounded-lg transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  {editingPlan ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
