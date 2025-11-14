"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, CreditCard, Users, HelpCircle, LifeBuoy } from "lucide-react";
import LogOutButton from "@/components/common/LogOutButton";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    label: "Dashboard",
    href: "/pro",
    icon: LayoutDashboard,
  },
  {
    label: "Paramètres",
    href: "/pro/parametres",
    icon: Settings,
  },
  {
    label: "Abonnements",
    href: "/pro/abonnements",
    icon: CreditCard,
  },
  {
    label: "Comptes",
    href: "/pro/comptes",
    icon: Users,
  },
  {
    label: "Aide",
    href: "/pro/aide",
    icon: HelpCircle,
  },
  {
    label: "Support",
    href: "/pro/support",
    icon: LifeBuoy,
  },
];

/**
 * Sidebar de l'espace professionnel
 * Utilise le hook useAuth() pour récupérer les informations utilisateur depuis AuthContext
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  // Générer les initiales pour l'avatar
  const getInitials = () => {
    if (!userProfile) return 'U';

    const firstName = userProfile.user_firstname || (userProfile as any).first_name || '';
    const lastName = userProfile.user_lastname || (userProfile as any).last_name || '';

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    }

    return 'U';
  };

  // Obtenir le nom complet
  const getFullName = () => {
    if (!userProfile) return 'Utilisateur';

    const firstName = userProfile.user_firstname || (userProfile as any).first_name || '';
    const lastName = userProfile.user_lastname || (userProfile as any).last_name || '';

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    return 'Utilisateur';
  };

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* User Info */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
            {getInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{getFullName()}</p>
            <p className="text-xs text-slate-400">Espace Pro</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/pro" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <LogOutButton className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm" />
      </div>
    </aside>
  );
}
