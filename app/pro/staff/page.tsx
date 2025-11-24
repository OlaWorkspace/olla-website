'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';

interface StaffMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  isCurrentUser?: boolean;
}

export default function StaffPage() {
  const { user, userProfile } = useAuth();
  const { callFunction } = useEdgeFunction();

  const [members, setMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'OWNER' | 'MANAGER' | 'STAFF'>('STAFF');
  const [businessId, setBusinessId] = useState<string | null>(null);

  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'MANAGER' | 'STAFF'>('STAFF');
  const [inviteLoading, setInviteLoading] = useState(false);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [newRole, setNewRole] = useState<'MANAGER' | 'STAFF'>('STAFF');

  // Fetch staff data on mount
  useEffect(() => {
    const fetchStaffData = async () => {
      if (!user || !userProfile) {
        setError('Utilisateur non authentifié');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: staffData, error: staffError } = await callFunction('get-staff-dashboard', {
          userId: userProfile.id,
          authId: user.id,
        });

        if (staffError) {
          throw new Error(staffError);
        }

        if (staffData) {
          if (staffData.members) {
            setMembers(staffData.members);
          }
          if (staffData.userRole) {
            setUserRole(staffData.userRole);
          }
          if (staffData.business?.id) {
            setBusinessId(staffData.business.id);
          }
        } else {
          setError('Aucune donnée retournée');
        }
      } catch (err) {
        console.error('❌ Error fetching staff:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [user, userProfile, callFunction]);

  const canManageStaff = userRole === 'OWNER' || userRole === 'MANAGER';

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !businessId) {
      setError('Email invalide ou commerce manquant');
      return;
    }

    try {
      setInviteLoading(true);

      const { data: inviteData, error: inviteError } = await callFunction('send-staff-invitation', {
        userId: userProfile?.id,
        authId: user?.id,
        businessId,
        inviteEmail: inviteEmail.trim(),
        inviteRole,
      });

      if (inviteError) {
        throw new Error(inviteError);
      }

      if (inviteData) {
        // Show success message
        setError(null);
        setInviteEmail('');
        setInviteRole('STAFF');
        setShowInviteModal(false);

        // Show toast message
        alert(`✅ Invitation envoyée à ${inviteEmail}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedMember || !businessId) return;

    try {
      const { data: updateData, error: updateError } = await callFunction('manage-business-staff', {
        userId: userProfile?.id,
        authId: user?.id,
        businessId,
        action: 'update-role',
        staffData: { staffId: selectedMember.id, newRole },
      });

      if (updateError) {
        throw new Error(updateError);
      }

      if (updateData?.member) {
        setMembers(
          members.map((m) => (m.id === selectedMember.id ? { ...m, role: newRole } : m))
        );
        setShowRoleModal(false);
        setSelectedMember(null);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du rôle');
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;
    if (!businessId) return;

    try {
      // Find the member to get their user ID
      const memberToRemove = members.find((m) => m.id === memberId);
      if (!memberToRemove) {
        throw new Error('Membre non trouvé');
      }

      const { error: removeError } = await callFunction('remove-staff-member', {
        staffUserId: memberToRemove.userId,
        businessId,
        requestingUserId: userProfile?.id,
        requestingAuthId: user?.id,
      });

      if (removeError) {
        throw new Error(removeError);
      }

      setMembers(members.filter((m) => m.id !== memberId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !members.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Personnel</h1>
          <p className="text-slate-600">Gérez votre équipe</p>
        </div>
        {canManageStaff && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
          >
            + Inviter un membre
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Warning for STAFF */}
      {userRole === 'STAFF' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 text-sm">
            Vous avez accès en lecture seule en tant que personnel
          </p>
        </div>
      )}

      {/* Members Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Membres de l'équipe ({members.length})
        </h2>

        {members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Aucun membre pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between py-4 px-2 hover:bg-slate-50 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {member.firstName} {member.lastName}
                    {member.isCurrentUser && <span className="text-slate-500 font-normal ml-2">(Vous)</span>}
                  </p>
                  <p className="text-sm text-slate-600">{member.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      member.role === 'OWNER'
                        ? 'bg-yellow-100 text-yellow-800'
                        : member.role === 'MANAGER'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {member.role === 'OWNER'
                      ? 'Propriétaire'
                      : member.role === 'MANAGER'
                      ? 'Responsable'
                      : 'Personnel'}
                  </span>
                  {canManageStaff && !member.isCurrentUser && member.role !== 'OWNER' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setNewRole(member.role === 'MANAGER' ? 'STAFF' : 'MANAGER');
                          setShowRoleModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-1 hover:bg-blue-50 rounded transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 hover:bg-red-50 rounded transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Inviter un membre</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rôle</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'MANAGER' | 'STAFF')}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {userRole === 'OWNER' && (
                    <option value="MANAGER">Responsable</option>
                  )}
                  <option value="STAFF">Personnel</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleInvite}
                  disabled={inviteLoading || !inviteEmail.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition font-medium"
                >
                  {inviteLoading ? 'Invitation...' : 'Inviter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Modifier le rôle</h2>
            <p className="text-slate-600 text-sm mb-4">
              Rôle de {selectedMember.firstName} {selectedMember.lastName}
            </p>

            <div className="space-y-3 mb-6">
              {userRole === 'OWNER' && (
                <label className="flex items-center p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition"
                  style={{ borderColor: newRole === 'MANAGER' ? '#3b82f6' : undefined, backgroundColor: newRole === 'MANAGER' ? '#f0f4ff' : undefined }}>
                  <input
                    type="radio"
                    name="role"
                    value="MANAGER"
                    checked={newRole === 'MANAGER'}
                    onChange={(e) => setNewRole(e.target.value as 'MANAGER')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-slate-900">Responsable</div>
                    <div className="text-xs text-slate-600">Peut gérer le personnel</div>
                  </div>
                </label>
              )}
              <label className="flex items-center p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition"
                style={{ borderColor: newRole === 'STAFF' ? '#3b82f6' : undefined, backgroundColor: newRole === 'STAFF' ? '#f0f4ff' : undefined }}>
                <input
                  type="radio"
                  name="role"
                  value="STAFF"
                  checked={newRole === 'STAFF'}
                  onChange={(e) => setNewRole(e.target.value as 'STAFF')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-slate-900">Personnel</div>
                  <div className="text-xs text-slate-600">Accès basique seulement</div>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateRole}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
