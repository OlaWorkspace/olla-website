"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useEdgeFunction } from "@/lib/supabase/hooks/useEdgeFunction";
import { ArrowLeft, Edit2, Trash2, Tag, Plus, QrCode, Radio, Copy, Check, Globe } from "lucide-react";
import { BUSINESS_CATEGORIES } from "@/lib/constants";

interface Business {
  id: string;
  business_name: string;
  category: string;
  address?: string;
  phone?: string;
  website?: string;
  user_id: string;
  active: boolean;
  created_at: string;
}

interface BusinessTag {
  id: string;
  tag_type: "NFC" | "QRC";
  tag_identifier: string;
  created_at: string;
  business_id?: string;
}

interface User {
  user_firstname: string;
  user_lastname: string;
  user_email: string;
}

const generateWebUrl = (businessId: string, tagId: string) => {
  return `https://www.ollafidelite.com/scan/${businessId}/${tagId}`;
};

export default function BusinessDetailPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;
  const { callFunction } = useEdgeFunction();

  const [business, setBusiness] = useState<Business | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [tags, setTags] = useState<BusinessTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTagForm, setShowTagForm] = useState(false);
  const [newTag, setNewTag] = useState({ type: "NFC" as "NFC" | "QRC", identifier: "" });
  const [tagLoading, setTagLoading] = useState(false);
  const [copiedTagId, setCopiedTagId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinessData();
  }, [businessId]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const { data, error } = await callFunction("admin-get-businesses", {});

      if (error) throw new Error(error);

      const businesses = data?.businesses || [];
      const targetBusiness = businesses.find((b: any) => b.id === businessId);

      if (targetBusiness) {
        setBusiness(targetBusiness);

        // Extract tags from business data
        if (targetBusiness.tags) {
          setTags(targetBusiness.tags);
        }

        // Find owner from the users list - you may need to fetch users separately
        // For now, we'll extract owner from business data if available
        if (targetBusiness.users) {
          setOwner(targetBusiness.users);
        }
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
      // Note: Check if admin-delete-tag exists, otherwise you may need to use a different approach
      // For now, this assumes an admin-delete-tag Edge Function exists
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
      // Reset the copied state after 2 seconds
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

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {toastMessage}
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
        {/* Main Info */}
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
              <span
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  business.active
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {business.active ? "Actif" : "Inactif"}
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              {business.address && (
                <div>
                  <p className="text-sm text-slate-600 font-medium">Adresse</p>
                  <p className="text-slate-900 mt-1">{business.address}</p>
                </div>
              )}

              {business.phone && (
                <div>
                  <p className="text-sm text-slate-600 font-medium">Téléphone</p>
                  <p className="text-slate-900 mt-1">{business.phone}</p>
                </div>
              )}

              {business.website && (
                <div>
                  <p className="text-sm text-slate-600 font-medium">Site web</p>
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

              <div>
                <p className="text-sm text-slate-600 font-medium">Créé le</p>
                <p className="text-slate-900 mt-1">{formatDate(business.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Tag size={24} />
                Tags NFC/QR
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
                  {/* Type Selection */}
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

                  {/* Identifier Input */}
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

                  {/* Buttons */}
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
            {tags.length > 0 ? (
              <div className="space-y-6">
                {tags.map((tag) => {
                  const webUrl = generateWebUrl(businessId, tag.tag_identifier);
                  return (
                    <div key={tag.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      {/* Tag Header */}
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

                      {/* URLs Section */}
                      <div className="p-4">
                        {/* Web URL */}
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                            <Globe size={14} />
                            Lien
                          </p>
                          <button
                            onClick={() => handleCopyTag(webUrl, `url-${tag.id}-web`)}
                            className="w-full text-left p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition group"
                          >
                            <p className="text-xs text-slate-900 break-all font-mono">{webUrl}</p>
                            <div className={`flex justify-end mt-1 transition ${copiedTagId === `url-${tag.id}-web` ? 'text-green-600' : 'text-slate-600 group-hover:text-slate-700'}`}>
                              {copiedTagId === `url-${tag.id}-web` ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-600">
                Aucun tag. Créez le premier!
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Info */}
          {owner && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-slate-900 mb-4">Propriétaire</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Nom</p>
                  <p className="font-medium text-slate-900">
                    {owner.user_firstname} {owner.user_lastname}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <a href={`mailto:${owner.user_email}`} className="text-blue-600 hover:text-blue-700">
                    {owner.user_email}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-slate-900 mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-medium">Tags créés</p>
                <p className="text-2xl font-bold text-blue-900">{tags.length}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-700 font-medium">Tags NFC</p>
                <p className="text-2xl font-bold text-slate-900">{tags.filter((t) => t.tag_type === "NFC").length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700 font-medium">QR Codes</p>
                <p className="text-2xl font-bold text-purple-900">{tags.filter((t) => t.tag_type === "QRC").length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
