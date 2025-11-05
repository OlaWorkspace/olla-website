"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { LogOut } from "lucide-react";

interface LogOutButtonProps {
  className?: string;
}

export default function LogOutButton({ className }: LogOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
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
