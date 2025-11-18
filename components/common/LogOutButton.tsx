"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/clients/browser";
import { clearOnboardingStatus } from "@/lib/utils/onboarding";
import { LogOut } from "lucide-react";

interface LogOutButtonProps {
  className?: string;
}

/**
 * Bouton de déconnexion utilisant l'instance singleton Supabase
 * Déconnecte l'utilisateur et le redirige vers la page de login
 */
export default function LogOutButton({ className }: LogOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      // Clear onboarding status from localStorage
      clearOnboardingStatus();

      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("❌ Error signing out:", error);
    } finally {
      setLoading(false);
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
