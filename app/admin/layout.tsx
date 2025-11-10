"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/clients/browser";
import { Settings, Users, CreditCard, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push("/auth/login");
          return;
        }

        const { data: userData } = await supabase
          .from("users")
          .select("admin")
          .eq("auth_id", authUser.id)
          .single();

        if (!userData?.admin) {
          router.push("/pro");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Chargement...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        </div>

        <nav className="mt-6">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            <Settings className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/subscriptions"
            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            <CreditCard className="w-5 h-5" />
            <span>Subscriptions</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            <Users className="w-5 h-5" />
            <span>Utilisateurs</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition w-full mt-6"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
