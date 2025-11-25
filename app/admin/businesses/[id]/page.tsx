"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEdgeFunction } from "@/lib/supabase/hooks/useEdgeFunction";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Tag,
  Plus,
  QrCode,
  Radio,
  Copy,
  Check,
  Globe,
  MapPin,
  Clock,
  Users,
  Gift,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Send,
  X,
  Save,
} from "lucide-react";
import { BUSINESS_CATEGORIES } from "@/lib/constants";

interface Business {
  id: string;
  business_name: string;
  category: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  google_reviews_url?: string;
  point_limit: number;
  total_points_earned: number;
  total_rewards_redeemed: number;
  opening_hours?: any;
  latitude?: number;
  longitude?: number;
  active: boolean;
  created_at: string;
  gift?: string;
  tags: BusinessTag[];
  loyalty_programs: LoyaltyProgram[];
  subscription: BusinessSubscription | null;
  loyal_customers: LoyalCustomer[];
  professionals: Professional[];
  notifications_stats: NotificationStat[];
  owner: User | null;
}

interface BusinessTag {
  id: string;
  tag_type: "NFC" | "QRC";
  tag_identifier: string;
  created_at: string;
}

interface LoyaltyProgram {
  id: string;
  point_needed: number;
  reward_label: string;
  created_at: string;
  updated_at: string;
}

interface BusinessSubscription {
  id: string;
  status: string;
  started_at: string;
  expires_at?: string;
  payment_method: string;
  subscription_plans?: {
    name: string;
    slug: string;
    max_loyalty_programs?: number;
  };
}

interface LoyalCustomer {
  id: string;
  nb_points: number;
  total_points_earned: number;
  total_rewards_redeemed: number;
  last_scan_at?: string;
  users?: User;
}

interface Professional {
  id: string;
  users?: User;
}

interface NotificationStat {
  status: string;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
}

interface User {
  id: string;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_phone?: string;
}

const generateWebUrl = (businessId: string, tagId: string) => {
  return `https://www.ollafidelite.com/scan/${businessId}/${tagId}`;
};

export default function BusinessDetailPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;
  const { user, userProfile } = useAuth();
  const { callFunction } = useEdgeFunction();

  // State for business data
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  // Modal states
  const [showEditBusinessModal, setShowEditBusinessModal] = useState(false);
  const [showEditPointLimitModal, setShowEditPointLimitModal] = useState(false);
  const [showEditLoyaltyModal, setShowEditLoyaltyModal] = useState(false);
  const [showAddLoyaltyModal, setShowAddLoyaltyModal] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);

  // Edit form states
  const [editBusinessForm, setEditBusinessForm] = useState<any>(null);
  const [editPointLimit, setEditPointLimit] = useState<number>(0);
  const [editLoyaltyForm, setEditLoyaltyForm] = useState<any>(null);
  const [addLoyaltyForm, setAddLoyaltyForm] = useState({ point_needed: 0, reward_label: "" });

  // Tag form state
  const [newTag, setNewTag] = useState({ type: "NFC" as "NFC" | "QRC", identifier: "" });
  const [tagLoading, setTagLoading] = useState(false);
  const [copiedTagId, setCopiedTagId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinessData();
  }, [businessId]);

  // Initialize edit forms when business loads
  useEffect(() => {
    if (business) {
      setEditBusinessForm({
        business_name: business.business_name,
        category: business.category,
        formatted_address: business.formatted_address || "",
        formatted_phone_number: business.formatted_phone_number || "",
        website: business.website || "",
        google_reviews_url: business.google_reviews_url || "",
      });
      setEditPointLimit(business.point_limit);
    }
  }, [business]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const { data, error } = await callFunction("admin-get-businesses", { businessId });

      if (error) throw new Error(error);

      const businesses = data?.businesses || [];
      const targetBusiness = businesses[0];

      if (targetBusiness) {
        setBusiness(targetBusiness);
      } else {
        throw new Error("Business not found");
      }
    } catch (error) {
      console.error("Error fetching business:", error);
      alert("Erreur lors du chargement du commerce");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBusiness = async () => {
    if (!user || !userProfile) {
      alert("Non authentifié");
      return;
    }

    try {
      setEditLoading(true);
      const { data, error } = await callFunction("admin-update-business", {
        userId: userProfile.id,
        authId: user.id,
        businessId,
        businessData: {
          ...editBusinessForm,
          point_limit: parseInt(editPointLimit.toString()),
        },
      });

      if (error) throw new Error(error);

      alert("Commerce mis à jour avec succès!");
      setShowEditBusinessModal(false);
      setShowEditPointLimitModal(false);
      fetchBusinessData();
    } catch (error) {
      console.error("Error updating business:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : "Impossible de mettre à jour"}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditLoyaltyProgram = async (programId: string) => {
    if (!user || !userProfile) {
      alert("Non authentifié");
      return;
    }

    try {
      setEditLoading(true);
      const { data, error } = await callFunction("admin-manage-loyalty-programs", {
        userId: userProfile.id,
        authId: user.id,
        businessId,
        action: "update",
        programId,
        programData: editLoyaltyForm,
      });

      if (error) throw new Error(error);

      alert("Programme de fidélité mis à jour!");
      setShowEditLoyaltyModal(false);
      setEditLoyaltyForm(null);
      fetchBusinessData();
    } catch (error) {
      console.error("Error updating loyalty program:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : "Impossible de mettre à jour"}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddLoyaltyProgram = async () => {
    if (!user || !userProfile) {
      alert("Non authentifié");
      return;
    }

    try {
      setEditLoading(true);
      const { data, error } = await callFunction("admin-manage-loyalty-programs", {
        userId: userProfile.id,
        authId: user.id,
        businessId,
        action: "create",
        programData: addLoyaltyForm,
      });

      if (error) throw new Error(error);

      alert("Programme de fidélité créé!");
      setShowAddLoyaltyModal(false);
      setAddLoyaltyForm({ point_needed: 0, reward_label: "" });
      fetchBusinessData();
    } catch (error) {
      console.error("Error creating loyalty program:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : "Impossible de créer"}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteLoyaltyProgram = async (programId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce programme?")) return;

    if (!user || !userProfile) {
      alert("Non authentifié");
      return;
    }

    try {
      setEditLoading(true);
      const { data, error } = await callFunction("admin-manage-loyalty-programs", {
        userId: userProfile.id,
        authId: user.id,
        businessId,
        action: "delete",
        programId,
      });

      if (error) throw new Error(error);

      alert("Programme de fidélité supprimé!");
      fetchBusinessData();
    } catch (error) {
      console.error("Error deleting loyalty program:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : "Impossible de supprimer"}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.identifier.trim()) {
      alert("Veuillez entrer un identifiant");
      return;
    }

    try {
      setTagLoading(true);
      const { data, error } = await callFunction("admin-create-tag", {
        businessId,
        tagData: {
          tag_type: newTag.type,
          tag_identifier: newTag.identifier.toUpperCase().trim(),
        },
      });

      if (error) throw new Error(error);

      alert("Tag créé avec succès!");
      setNewTag({ type: "NFC", identifier: "" });
      setShowTagForm(false);
      fetchBusinessData();
    } catch (error) {
      console.error("Error creating tag:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : "Impossible de créer le tag"}`);
    } finally {
      setTagLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce tag?")) return;

    try {
      const { data, error } = await callFunction("admin-delete-tag", {
        tagId,
      });

      if (error) throw new Error(error);

      alert("Tag supprimé avec succès!");
      fetchBusinessData();
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : "Impossible de supprimer le tag"}`);
    }
  };

  const handleCopyTag = async (textToCopy: string, tagId: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedTagId(tagId);
      setToastMessage(`✅ Lien copié dans le presse-papiers`);
      setTimeout(() => {
        setCopiedTagId(null);
        setToastMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setToastMessage("❌ Impossible de copier le lien");
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const generateRandomIdentifier = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewTag((prev) => ({ ...prev, identifier: result }));
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

  const formatDateOnly = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 rounded-full border-t-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Commerce non trouvé</p>
      </div>
    );
  }

  const categoryData = BUSINESS_CATEGORIES[business.category as keyof typeof BUSINESS_CATEGORIES];
  const categoryIcon = categoryData?.icon || "🏪";
  const categoryLabel = categoryData?.label || business.category;

  const totalNotificationsSent = business.notifications_stats?.reduce((sum, stat) => sum + (stat.total_sent || 0), 0) || 0;
  const totalNotificationsDelivered = business.notifications_stats?.reduce((sum, stat) => sum + (stat.total_delivered || 0), 0) || 0;
  const totalNotificationsOpened = business.notifications_stats?.reduce((sum, stat) => sum + (stat.total_opened || 0), 0) || 0;

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Edit Business Modal */}
      {showEditBusinessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Éditer le commerce</h2>
              <button onClick={() => setShowEditBusinessModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom du commerce</label>
                <input
                  type="text"
                  value={editBusinessForm?.business_name || ""}
                  onChange={(e) => setEditBusinessForm({ ...editBusinessForm, business_name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                <select
                  value={editBusinessForm?.category || ""}
                  onChange={(e) => setEditBusinessForm({ ...editBusinessForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {Object.entries(BUSINESS_CATEGORIES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={editBusinessForm?.formatted_address || ""}
                  onChange={(e) => setEditBusinessForm({ ...editBusinessForm, formatted_address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={editBusinessForm?.formatted_phone_number || ""}
                  onChange={(e) => setEditBusinessForm({ ...editBusinessForm, formatted_phone_number: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Site web</label>
                <input
                  type="url"
                  value={editBusinessForm?.website || ""}
                  onChange={(e) => setEditBusinessForm({ ...editBusinessForm, website: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Google Reviews</label>
                <input
                  type="url"
                  value={editBusinessForm?.google_reviews_url || ""}
                  onChange={(e) => setEditBusinessForm({ ...editBusinessForm, google_reviews_url: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={() => setShowEditBusinessModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleEditBusiness}
                disabled={editLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {editLoading ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Point Limit Modal */}
      {showEditPointLimitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Limite de points</h2>
              <button onClick={() => setShowEditPointLimitModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Limite de points</label>
                <input
                  type="number"
                  value={editPointLimit}
                  onChange={(e) => setEditPointLimit(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={() => setShowEditPointLimitModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleEditBusiness}
                disabled={editLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition"
              >
                {editLoading ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Loyalty Program Modal */}
      {showAddLoyaltyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Ajouter un programme</h2>
              <button onClick={() => setShowAddLoyaltyModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Récompense</label>
                <input
                  type="text"
                  value={addLoyaltyForm.reward_label}
                  onChange={(e) => setAddLoyaltyForm({ ...addLoyaltyForm, reward_label: e.target.value })}
                  placeholder="Ex: Réduction 10%"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Points requis</label>
                <input
                  type="number"
                  value={addLoyaltyForm.point_needed}
                  onChange={(e) => setAddLoyaltyForm({ ...addLoyaltyForm, point_needed: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={() => setShowAddLoyaltyModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddLoyaltyProgram}
                disabled={editLoading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition"
              >
                {editLoading ? "Création..." : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Loyalty Program Modal */}
      {showEditLoyaltyModal && editLoyaltyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Éditer le programme</h2>
              <button onClick={() => setShowEditLoyaltyModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Récompense</label>
                <input
                  type="text"
                  value={editLoyaltyForm.reward_label}
                  onChange={(e) => setEditLoyaltyForm({ ...editLoyaltyForm, reward_label: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Points requis</label>
                <input
                  type="number"
                  value={editLoyaltyForm.point_needed}
                  onChange={(e) => setEditLoyaltyForm({ ...editLoyaltyForm, point_needed: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={() => setShowEditLoyaltyModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => handleEditLoyaltyProgram(editLoyaltyForm.id)}
                disabled={editLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition"
              >
                {editLoading ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/businesses" className="p-2 hover:bg-slate-100 rounded-lg transition">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-slate-900">Détails du commerce</h1>
          <p className="text-lg text-slate-600 mt-1">Consultez et gérez un commerce</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Info Card */}
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{categoryIcon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{business.business_name}</h2>
                  <p className="text-slate-600 mt-1">{categoryLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                    business.active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {business.active ? "Actif" : "Inactif"}
                </span>
                <button
                  onClick={() => setShowEditBusinessModal(true)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <Edit2 size={20} className="text-blue-600" />
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              {business.formatted_address && (
                <div>
                  <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
                    <MapPin size={16} />
                    Adresse
                  </p>
                  <p className="text-slate-900 mt-1">{business.formatted_address}</p>
                </div>
              )}

              {business.formatted_phone_number && (
                <div>
                  <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
                    <Phone size={16} />
                    Téléphone
                  </p>
                  <p className="text-slate-900 mt-1">{business.formatted_phone_number}</p>
                </div>
              )}

              {business.website && (
                <div>
                  <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
                    <Globe size={16} />
                    Site web
                  </p>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 mt-1"
                  >
                    {business.website}
                  </a>
                </div>
              )}

              {business.google_reviews_url && (
                <div>
                  <p className="text-sm text-slate-600 font-medium">Google Reviews</p>
                  <a
                    href={business.google_reviews_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 mt-1"
                  >
                    Voir les avis
                  </a>
                </div>
              )}

              {(business.latitude || business.longitude) && (
                <div>
                  <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
                    <MapPin size={16} />
                    Coordonnées GPS
                  </p>
                  <p className="text-slate-900 mt-1">
                    {business.latitude?.toFixed(4)}, {business.longitude?.toFixed(4)}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
                  <Calendar size={16} />
                  Créé le
                </p>
                <p className="text-slate-900 mt-1">{formatDate(business.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Loyalty Statistics Card */}
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={24} />
                Statistiques de fidélité
              </h3>
              <button
                onClick={() => setShowEditPointLimitModal(true)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <Edit2 size={20} className="text-blue-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 font-medium">Limite de points</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{business.point_limit}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-700 font-medium">Points gagnés (total)</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{business.total_points_earned}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-700 font-medium">Récompenses remboursées</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{business.total_rewards_redeemed}</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          {business.opening_hours && (
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock size={24} />
                Heures d'ouverture
              </h3>

              <div className="space-y-2">
                {Array.isArray(business.opening_hours?.weekday_text) ? (
                  business.opening_hours.weekday_text.map((day: string, idx: number) => (
                    <div key={idx} className="flex justify-between p-2 border-b border-slate-200">
                      <span className="text-slate-900">{day}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600">Aucune information d'horaire disponible</p>
                )}
              </div>
            </div>
          )}

          {/* Loyalty Programs */}
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Gift size={24} />
                Programmes de fidélité ({business.loyalty_programs?.length || 0})
              </h3>
              <button
                onClick={() => setShowAddLoyaltyModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
              >
                <Plus size={18} />
                Ajouter
              </button>
            </div>

            {business.loyalty_programs && business.loyalty_programs.length > 0 ? (
              <div className="space-y-4">
                {business.loyalty_programs.map((program) => (
                  <div key={program.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{program.reward_label}</p>
                        <p className="text-sm text-slate-600 mt-1">
                          Requis: <span className="font-semibold">{program.point_needed} points</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditLoyaltyForm(program);
                            setShowEditLoyaltyModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteLoyaltyProgram(program.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-600">Aucun programme de fidélité configuré</div>
            )}
          </div>

          {/* Tags Section */}
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Tag size={24} />
                Tags NFC/QR ({business.tags?.length || 0})
              </h3>
              <button
                onClick={() => setShowTagForm(!showTagForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                <Plus size={18} />
                Ajouter un tag
              </button>
            </div>

            {/* Add Tag Form */}
            {showTagForm && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Type de tag</label>
                    <div className="flex gap-4">
                      {(["NFC", "QRC"] as const).map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tag_type"
                            value={type}
                            checked={newTag.type === type}
                            onChange={(e) => setNewTag((prev) => ({ ...prev, type: e.target.value as "NFC" | "QRC" }))}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-slate-700">
                            {type === "NFC" ? (
                              <>
                                <Radio size={16} className="inline mr-1" /> Tag NFC
                              </>
                            ) : (
                              <>
                                <QrCode size={16} className="inline mr-1" /> QR Code
                              </>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Identifiant</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag.identifier}
                        onChange={(e) => setNewTag((prev) => ({ ...prev, identifier: e.target.value }))}
                        placeholder="Ex: NFC001"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        onClick={generateRandomIdentifier}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition"
                      >
                        Générer
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTagForm(false)}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-slate-50 transition"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={tagLoading}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition"
                    >
                      {tagLoading ? "Création..." : "Créer le tag"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tags List */}
            {business.tags && business.tags.length > 0 ? (
              <div className="space-y-6">
                {business.tags.map((tag) => {
                  const webUrl = generateWebUrl(businessId, tag.tag_identifier);
                  return (
                    <div key={tag.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          {tag.tag_type === "NFC" ? (
                            <Radio size={20} className="text-blue-600" />
                          ) : (
                            <QrCode size={20} className="text-purple-600" />
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{tag.tag_identifier}</p>
                            <p className="text-sm text-slate-600">{tag.tag_type === "NFC" ? "Tag NFC" : "QR Code"}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="p-4">
                        <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                          <Globe size={14} />
                          Lien
                        </p>
                        <button
                          onClick={() => handleCopyTag(webUrl, `url-${tag.id}-web`)}
                          className="w-full text-left p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition group"
                        >
                          <p className="text-xs text-slate-900 break-all font-mono">{webUrl}</p>
                          <div
                            className={`flex justify-end mt-1 transition ${
                              copiedTagId === `url-${tag.id}-web` ? "text-green-600" : "text-slate-600 group-hover:text-slate-700"
                            }`}
                          >
                            {copiedTagId === `url-${tag.id}-web` ? <Check size={16} /> : <Copy size={16} />}
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-600">Aucun tag. Créez le premier!</div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Info */}
          {business.owner && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users size={20} />
                Propriétaire
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Nom</p>
                  <p className="font-medium text-slate-900">
                    {business.owner.user_firstname} {business.owner.user_lastname}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Mail size={14} />
                    Email
                  </p>
                  <a href={`mailto:${business.owner.user_email}`} className="text-blue-600 hover:text-blue-700">
                    {business.owner.user_email}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Info */}
          {business.subscription && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Abonnement
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Plan</p>
                  <p className="font-medium text-slate-900">{business.subscription.subscription_plans?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Statut</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      business.subscription.status === "active"
                        ? "bg-green-100 text-green-800"
                        : business.subscription.status === "trialing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {business.subscription.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Commenced le</p>
                  <p className="text-sm text-slate-900">{formatDateOnly(business.subscription.started_at)}</p>
                </div>
                {business.subscription.expires_at && (
                  <div>
                    <p className="text-sm text-slate-600">Expire le</p>
                    <p className="text-sm text-slate-900">{formatDateOnly(business.subscription.expires_at)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600">Méthode de paiement</p>
                  <p className="text-sm text-slate-900 capitalize">{business.subscription.payment_method}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loyal Customers Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users size={20} />
              Clients loyaux
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-medium">Total clients</p>
                <p className="text-2xl font-bold text-blue-900">{business.loyal_customers?.length || 0}</p>
              </div>

              {business.loyal_customers && business.loyal_customers.length > 0 && (
                <>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700 font-medium">Points moyens</p>
                    <p className="text-2xl font-bold text-green-900">
                      {business.loyal_customers.length > 0
                        ? Math.round(
                            business.loyal_customers.reduce((sum, c) => sum + c.nb_points, 0) / business.loyal_customers.length
                          )
                        : 0}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-900 mb-2">Top 3 clients</p>
                    <div className="space-y-2">
                      {business.loyal_customers.slice(0, 3).map((customer) => (
                        <div key={customer.id} className="p-2 bg-slate-50 rounded text-sm">
                          <p className="font-medium text-slate-900">
                            {customer.users?.user_firstname} {customer.users?.user_lastname}
                          </p>
                          <p className="text-xs text-slate-600">{customer.nb_points} points</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Professionals */}
          {business.professionals && business.professionals.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users size={20} />
                Staff ({business.professionals.length})
              </h3>
              <div className="space-y-2">
                {business.professionals.map((prof) => (
                  <div key={prof.id} className="p-2 bg-slate-50 rounded">
                    <p className="font-medium text-slate-900 text-sm">
                      {prof.users?.user_firstname} {prof.users?.user_lastname}
                    </p>
                    <p className="text-xs text-slate-600">{prof.users?.user_email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Stats */}
          {totalNotificationsSent > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Send size={20} />
                Notifications
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700 font-medium">Total envoyées</p>
                  <p className="text-2xl font-bold text-blue-900">{totalNotificationsSent}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700 font-medium">Livrées</p>
                  <p className="text-2xl font-bold text-green-900">{totalNotificationsDelivered}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">Ouvertes</p>
                  <p className="text-2xl font-bold text-purple-900">{totalNotificationsOpened}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
