'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEdgeFunction } from '@/lib/supabase/hooks/useEdgeFunction';
import { Clock, CheckCircle, Mail, Trash2, Users } from 'lucide-react';

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
  const [success, setSuccess] = useState<string | null>(null);
  const [pageUserRole, setPageUserRole] = useState<'OWNER' | 'MANAGER' | 'STAFF'>('STAFF');
  const [businessId, setBusinessId] = useState<string | null>(null);

  // Vérifier l'accès - STAFF n'a pas accès
  useEffect(() => {
    if (!authLoading && authUserRole === 'STAFF') {
      router.push('/pro');
    }
  }, [authUserRole, authLoading, router]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'MANAGER' | 'STAFF'>('STAFF');
  const [inviteLoading, setInviteLoading] = useState(false);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [newRole, setNewRole] = useState<'MANAGER' | 'STAFF'>('STAFF');
  const [roleLoading, setRoleLoading] = useState(false);

  // Confirmation modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'remove' | 'cancel'; id: string; name?: string } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      setInviteLoading(true);
      setError(null);

      const { data: inviteData, error: inviteError } = await callFunction('send-staff-invitation', {
        userId: userProfile?.id,
        authId: user?.id,
        businessId,
        inviteEmail: inviteEmail.trim(),
        inviteRole,
      });

      if (inviteError) {
        // Map backend error messages to user-friendly French messages
        let userMessage = inviteError;

        if (inviteError.includes('déjà un utilisateur professionnel')) {
          userMessage = 'Cette personne est déjà un utilisateur professionnel ailleurs';
        } else if (inviteError.includes('déjà affiliée')) {
          userMessage = 'Cette personne est déjà affiliée à un autre commerce';
        } else if (inviteError.includes('already a member') || inviteError.includes('déjà membre')) {
          userMessage = 'Cette personne fait déjà partie de votre équipe';
        } else if (inviteError.includes('already invited') || inviteError.includes('déjà invité')) {
          userMessage = 'Une invitation est déjà en attente pour cet email';
        } else if (inviteError.includes('permission') || inviteError.includes('permission')) {
          userMessage = 'Vous n\'avez pas la permission d\'inviter des personnes';
        } else if (inviteError.includes('invalid role') || inviteError.includes('rôle invalide')) {
          userMessage = 'Le rôle sélectionné n\'est pas autorisé';
        } else if (inviteError.includes('MANAGER') || inviteError.includes('manager')) {
          userMessage = 'Seul un propriétaire peut inviter un responsable';
        }

        throw new Error(userMessage);
      }

      if (inviteData) {
        // Clear form and close modal on success
        setError(null);
        const emailSent = inviteEmail;
        setInviteEmail('');
        setInviteRole('STAFF');
        setShowInviteModal(false);

        // Show success notification (auto-closes after 3 seconds)
        setSuccess(`✅ Invitation envoyée à ${emailSent}`);

        // Refresh pending invitations
        if (businessId) {
          try {
            const { data: invitationsData } = await callFunction('list-pending-invitations', {
              userId: userProfile?.id,
              authId: user?.id,
              businessId,
            });
            if (invitationsData?.invitations) {
              setPendingInvitations(invitationsData.invitations);
            }
          } catch (err) {
            // Error refreshing invitations:', err);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'envoi de l\'invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedMember || !businessId) return;

    try {
      setRoleLoading(true);
      setError(null);

      const { data: updateData, error: updateError } = await callFunction('manage-business-staff', {
        userId: userProfile?.id,
        authId: user?.id,
        businessId,
        action: 'update-role',
        staffData: { staffId: selectedMember.id, newRole },
      }, { method: 'PATCH' });

      if (updateError) {
        throw new Error(updateError);
      }

      if (updateData?.member) {
        setMembers(
          members.map((m) => (m.id === selectedMember.id ? { ...m, role: newRole } : m))
        );
        setShowRoleModal(false);
        setSelectedMember(null);
        setSuccess(`✅ Rôle de ${selectedMember.firstName} ${selectedMember.lastName} modifié en ${newRole === 'MANAGER' ? 'Responsable' : 'Personnel'}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du rôle');
    } finally {
      setRoleLoading(false);
    }
  };

  const handleRemove = (memberId: string) => {
    const memberToRemove = members.find((m) => m.id === memberId);
    if (!memberToRemove) return;

    setConfirmAction({
      type: 'remove',
      id: memberId,
      name: `${memberToRemove.firstName} ${memberToRemove.lastName}`
    });
    setShowConfirmModal(true);
  };

  const handleCancelInvitation = (invitationId: string) => {
    setConfirmAction({
      type: 'cancel',
      id: invitationId,
      name: pendingInvitations.find(inv => inv.id === invitationId)?.email
    });
    setShowConfirmModal(true);
  };

  const executeConfirmAction = async () => {
    if (!confirmAction || !businessId) return;

    try {
      setConfirmLoading(true);

      if (confirmAction.type === 'remove') {
        const memberToRemove = members.find((m) => m.id === confirmAction.id);
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

        setMembers(members.filter((m) => m.id !== confirmAction.id));
        setSuccess(`✅ ${confirmAction.name} a été supprimé de l'équipe`);
      } else if (confirmAction.type === 'cancel') {
        const { error: cancelError } = await callFunction('cancel-staff-invitation', {
          invitationId: confirmAction.id,
          businessId,
          requestingUserId: userProfile?.id,
          requestingAuthId: user?.id,
        });

        if (cancelError) {
          throw new Error(cancelError);
        }

        setPendingInvitations(pendingInvitations.filter((inv) => inv.id !== confirmAction.id));
        setSuccess('✅ Invitation annulée');
      }

      setShowConfirmModal(false);
      setConfirmAction(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'opération');
    } finally {
      setConfirmLoading(false);
    }
  };

  // Séparer les membres par rôle
  const managers = members.filter(m => m.role === 'MANAGER');
  const staff = members.filter(m => m.role === 'STAFF');
  const owner = members.find(m => m.role === 'OWNER');

  const MemberRow = ({ member }: { member: StaffMember }) => (
    <div
      key={member.id}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 px-4 md:px-5 hover:bg-slate-50/50 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm flex-shrink-0">
          {member.firstName?.[0]}{member.lastName?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900">
            {member.firstName} {member.lastName}
            {member.isCurrentUser && <span className="text-slate-500 font-normal ml-2 text-xs md:text-sm">(Vous)</span>}
          </p>
          <p className="text-xs md:text-sm text-slate-600 truncate">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:ml-4">
        {canManageStaff && !member.isCurrentUser && member.role !== 'OWNER' && (
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                setSelectedMember(member);
                setNewRole(member.role === 'MANAGER' ? 'STAFF' : 'MANAGER');
                setShowRoleModal(true);
              }}
              className="flex-1 md:flex-none text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-2 hover:bg-blue-50 rounded-lg transition"
            >
              Modifier
            </button>
            <button
              onClick={() => handleRemove(member.id)}
              className="flex-1 md:flex-none text-red-600 hover:text-red-700 font-medium text-sm px-3 py-2 hover:bg-red-50 rounded-lg transition"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );

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
    <div className="min-h-screen bg-white">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg z-40 max-w-sm animate-in slide-in-from-right">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Personnel</h1>
              <p className="text-slate-600 mt-2">Gérez votre équipe</p>
            </div>
            {canManageStaff && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium w-full md:w-auto text-center"
              >
                + Inviter un membre
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-5 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Warning for STAFF */}
        {pageUserRole === 'STAFF' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 md:p-5">
            <p className="text-yellow-800 text-sm">
              Vous avez accès en lecture seule en tant que personnel
            </p>
          </div>
        )}

        {/* Pending Invitations Section */}
        {pendingInvitations.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Invitations en attente ({pendingInvitations.length})
            </h2>

            <div className="grid gap-3 md:gap-4">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-5 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 flex-shrink-0">
                      <Mail size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{invitation.email}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            invitation.role === 'MANAGER'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {invitation.role === 'MANAGER' ? 'Responsable' : 'Personnel'}
                        </span>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          Expire le {new Date(invitation.expiresAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:ml-4">
                    <span className="flex items-center gap-1 text-xs text-blue-600 font-medium px-3 py-1 bg-blue-100 rounded-full flex-shrink-0">
                      <Clock size={14} />
                      <span className="hidden sm:inline">En attente</span>
                      <span className="sm:hidden">Attente</span>
                    </span>
                    {canManageStaff && (
                      <button
                        onClick={() => handleCancelInvitation(invitation.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
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

        {/* Owner Card */}
        {owner && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">👑</span>
              Propriétaire
            </h2>
            <div className="divide-y divide-slate-200">
              <MemberRow member={owner} />
            </div>
          </div>
        )}

        {/* Managers Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            Responsables ({managers.length})
          </h2>

          {managers.length === 0 ? (
            <div className="text-center py-12">
              <Users size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Aucun responsable pour le moment</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {managers.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>

        {/* Staff Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Personnel ({staff.length})
          </h2>

          {staff.length === 0 ? (
            <div className="text-center py-12">
              <Users size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Aucun personnel pour le moment</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {staff.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Inviter un membre</h2>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setError(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition flex-shrink-0"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-slate-600 text-sm mb-6">Ajoutez une nouvelle personne à votre équipe</p>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setError(null);
                  }}
                  disabled={inviteLoading}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-slate-50 disabled:cursor-not-allowed text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rôle</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'MANAGER' | 'STAFF')}
                  disabled={inviteLoading}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-slate-50 disabled:cursor-not-allowed text-sm"
                >
                  {pageUserRole === 'OWNER' && (
                    <option value="MANAGER">Responsable - Peut gérer le personnel</option>
                  )}
                  <option value="STAFF">Personnel - Accès basique</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setError(null);
                  }}
                  disabled={inviteLoading}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition font-medium text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleInvite}
                  disabled={inviteLoading || !inviteEmail.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition font-medium text-sm"
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
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Modifier le rôle</h2>
              <button
                onClick={() => setShowRoleModal(false)}
                disabled={roleLoading}
                className="text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              Changer le rôle de <strong>{selectedMember.firstName} {selectedMember.lastName}</strong>
            </p>

            <div className="space-y-3 mb-8">
              {pageUserRole === 'OWNER' && (
                <label className="flex items-start p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderColor: newRole === 'MANAGER' ? '#3b82f6' : undefined, backgroundColor: newRole === 'MANAGER' ? '#eff6ff' : undefined }}>
                  <input
                    type="radio"
                    name="role"
                    value="MANAGER"
                    checked={newRole === 'MANAGER'}
                    onChange={(e) => setNewRole(e.target.value as 'MANAGER')}
                    disabled={roleLoading}
                    className="mr-3 w-4 h-4 mt-1 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Responsable</div>
                    <div className="text-xs text-slate-600">Peut gérer le personnel et les paramètres</div>
                  </div>
                </label>
              )}
              <label className="flex items-start p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: newRole === 'STAFF' ? '#3b82f6' : undefined, backgroundColor: newRole === 'STAFF' ? '#eff6ff' : undefined }}>
                <input
                  type="radio"
                  name="role"
                  value="STAFF"
                  checked={newRole === 'STAFF'}
                  onChange={(e) => setNewRole(e.target.value as 'STAFF')}
                  disabled={roleLoading}
                  className="mr-3 w-4 h-4 mt-1 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                />
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Personnel</div>
                  <div className="text-xs text-slate-600">Accès au dashboard uniquement</div>
                </div>
              </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                disabled={roleLoading}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition font-medium text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={roleLoading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition font-medium text-sm"
              >
                {roleLoading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v0m0-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">Attention</h2>
            </div>

            <div className="mb-8">
              {confirmAction.type === 'remove' ? (
                <>
                  <p className="text-slate-600 text-sm mb-2">
                    Êtes-vous sûr de vouloir <strong>supprimer</strong> <strong>{confirmAction.name}</strong> de votre équipe ?
                  </p>
                  <p className="text-xs text-red-600">Cette action est irréversible.</p>
                </>
              ) : (
                <p className="text-slate-600 text-sm">
                  Êtes-vous sûr de vouloir <strong>annuler</strong> l'invitation pour <strong>{confirmAction.name}</strong> ?
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                disabled={confirmLoading}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition font-medium text-sm"
              >
                Annuler
              </button>
              <button
                onClick={executeConfirmAction}
                disabled={confirmLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition font-medium text-sm"
              >
                {confirmLoading ? 'Traitement...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
