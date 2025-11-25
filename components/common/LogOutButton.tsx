"use client";

import { useLogout } from "@/lib/hooks/useLogout";
import { LogOut } from "lucide-react";

interface LogOutButtonProps {
  className?: string;
}

/**
 * Bouton de déconnexion utilisant le hook centralisé useLogout
 * Déconnecte l'utilisateur et le redirige vers la page de login
 */
export default function LogOutButton({ className }: LogOutButtonProps) {
  const { logout, loading } = useLogout();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      // Erreur déjà loggée dans le hook
    }
  };

  const defaultClassName = "inline-flex items-center gap-2 px-8 py-3 bg-error text-white rounded-lg hover:bg-red-600 transition font-semibold disabled:opacity-50";

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={className || defaultClassName}
    >
      <LogOut className="w-5 h-5" />
      {loading ? "Déconnexion..." : "Se déconnecter"}
    </button>
  );
}
