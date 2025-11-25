'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';
import { Clock, CheckCircle, Mail, Trash2 } from 'lucide-react';

interface StaffMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  isCurrentUser?: boolean;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: 'MANAGER' | 'STAFF';
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  expiresAt: string;
}

export default function StaffPage() {
  const { user, userProfile, userRole: authUserRole, loading: authLoading } = useAuth();
  const { callFunction } = useEdgeFunction();
  const router = useRouter();

  const [members, setMembers] = useState<StaffMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageUserRole, setPageUserRole] = useState<'OWNER' | 'MANAGER' | 'STAFF'>('STAFF');
  const [businessId, setBusinessId] = useState<string | null>(null);

  // Vérifier l'accès - STAFF n'a pas accès
  useEffect(() => {
    if (!authLoading && authUserRole === 'STAFF') {
      console.log('❌ Access denied - redirecting to dashboard');
      router.push('/pro');
    }
  }, [authUserRole, authLoading, router]);

  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'MANAGER' | 'STAFF'>('STAFF');
  const [inviteLoading, setInviteLoading] = useState(false);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [newRole, setNewRole] = useState<'MANAGER' | 'STAFF'>('STAFF');

  // Fetch staff data and pending invitations on mount
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
            setPageUserRole(staffData.userRole);
          }
          if (staffData.business?.id) {
            setBusinessId(staffData.business.id);
          }
        } else {
          setError('Aucune donnée retournée');
        }

        // Charger les invitations en attente pour ce business
        if (staffData?.business?.id) {
          try {
            const { data: invitationsData, error: invitationsError } = await callFunction('list-pending-invitations', {
              userId: userProfile.id,
              authId: user.id,
              businessId: staffData.business.id,
            });

            if (!invitationsError && invitationsData?.invitations) {
              setPendingInvitations(invitationsData.invitations);
            }
          } catch (invErr) {
            console.warn('⚠️ Could not load pending invitations:', invErr);
          }
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

  const canManageStaff = pageUserRole === 'OWNER' || pageUserRole === 'MANAGER';

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
      {pageUserRole === 'STAFF' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 text-sm">
            Vous avez accès en lecture seule en tant que personnel
          </p>
        </div>
      )}

      {/* Pending Invitations Section */}
      {pendingInvitations.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-blue-600" />
            Invitations en attente ({pendingInvitations.length})
          </h2>

          <div className="grid gap-4">
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                    <Mail size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{invitation.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          invitation.role === 'MANAGER'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {invitation.role === 'MANAGER' ? 'Responsable' : 'Personnel'}
                      </span>
                      <span className="text-xs text-slate-500">
                        Expire le {new Date(invitation.expiresAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="flex items-center gap-1 text-xs text-blue-600 font-medium px-3 py-1 bg-blue-100 rounded-full">
                    <Clock size={14} />
                    En attente
                  </span>
                  {canManageStaff && (
                    <button
                      onClick={() => {
                        // TODO: Implement cancel invitation
                      }}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Annuler l'invitation"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <CheckCircle size={20} className="text-green-600" />
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
                className="flex items-center justify-between py-4 px-3 hover:bg-slate-50/50 transition-colors rounded"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm">
                    {member.firstName?.[0]}{member.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      {member.firstName} {member.lastName}
                      {member.isCurrentUser && <span className="text-slate-500 font-normal ml-2 text-sm">(Vous)</span>}
                    </p>
                    <p className="text-sm text-slate-600">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
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
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-1.5 hover:bg-blue-50 rounded-lg transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1.5 hover:bg-red-50 rounded-lg transition"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Inviter un membre</h2>
            <p className="text-slate-600 text-sm mb-6">Ajoutez une nouvelle personne à votre équipe</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rôle</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'MANAGER' | 'STAFF')}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  {pageUserRole === 'OWNER' && (
                    <option value="MANAGER">Responsable - Peut gérer le personnel</option>
                  )}
                  <option value="STAFF">Personnel - Accès basique</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleInvite}
                  disabled={inviteLoading || !inviteEmail.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition font-medium"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Modifier le rôle</h2>
            <p className="text-slate-600 text-sm mb-6">
              Changer le rôle de <strong>{selectedMember.firstName} {selectedMember.lastName}</strong>
            </p>

            <div className="space-y-3 mb-8">
              {pageUserRole === 'OWNER' && (
                <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition"
                  style={{ borderColor: newRole === 'MANAGER' ? '#3b82f6' : undefined, backgroundColor: newRole === 'MANAGER' ? '#eff6ff' : undefined }}>
                  <input
                    type="radio"
                    name="role"
                    value="MANAGER"
                    checked={newRole === 'MANAGER'}
                    onChange={(e) => setNewRole(e.target.value as 'MANAGER')}
                    className="mr-3 w-4 h-4"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">Responsable</div>
                    <div className="text-xs text-slate-600">Peut gérer le personnel et les paramètres</div>
                  </div>
                </label>
              )}
              <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition"
                style={{ borderColor: newRole === 'STAFF' ? '#3b82f6' : undefined, backgroundColor: newRole === 'STAFF' ? '#eff6ff' : undefined }}>
                <input
                  type="radio"
                  name="role"
                  value="STAFF"
                  checked={newRole === 'STAFF'}
                  onChange={(e) => setNewRole(e.target.value as 'STAFF')}
                  className="mr-3 w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-slate-900">Personnel</div>
                  <div className="text-xs text-slate-600">Accès au dashboard uniquement</div>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateRole}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
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
