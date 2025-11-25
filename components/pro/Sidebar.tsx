"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, CreditCard, Users, HelpCircle, LifeBuoy, Menu, X, Users2 } from "lucide-react";
import LogOutButton from "@/components/common/LogOutButton";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  roles?: ('OWNER' | 'MANAGER' | 'STAFF')[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/pro",
    icon: LayoutDashboard,
    roles: ['OWNER', 'MANAGER', 'STAFF'],
  },
  {
    label: "Personnel",
    href: "/pro/staff",
    icon: Users2,
    roles: ['OWNER', 'MANAGER'],
  },
  {
    label: "Paramètres",
    href: "/pro/parametres",
    icon: Settings,
    roles: ['OWNER', 'MANAGER'],
  },
  {
    label: "Abonnements",
    href: "/pro/abonnements",
    icon: CreditCard,
    roles: ['OWNER'],
  },
  {
    label: "Comptes",
    href: "/pro/comptes",
    icon: Users,
    roles: ['OWNER', 'MANAGER'],
  },
  {
    label: "Aide",
    href: "/pro/aide",
    icon: HelpCircle,
    roles: ['OWNER', 'MANAGER', 'STAFF'],
  },
  {
    label: "Support",
    href: "/pro/support",
    icon: LifeBuoy,
    roles: ['OWNER', 'MANAGER', 'STAFF'],
  },
];

/**
 * Sidebar de l'espace professionnel
 * Utilise le hook useAuth() pour récupérer les informations utilisateur depuis AuthContext
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { userProfile, userRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Log user role for debugging
  console.log('👤 Current user role:', userRole, '| User:', userProfile?.user_firstname, userProfile?.user_lastname);

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

  // Filtrer les items selon le rôle
  const visibleItems = menuItems.filter(item => {
    if (!item.roles || !userRole) return true;
    return item.roles.includes(userRole);
  });

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-slate-900 text-white min-h-screen fixed right-0 lg:left-0 lg:right-auto top-0 flex flex-col z-40 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* User Info */}
        <div className="p-5 border-b border-slate-700 mt-14 lg:mt-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{getFullName()}</p>
              <p className="text-xs text-slate-400">
                {userRole ? (
                  <>
                    {userRole === 'OWNER' && 'Propriétaire'}
                    {userRole === 'MANAGER' && 'Responsable'}
                    {userRole === 'STAFF' && 'Personnel'}
                  </>
                ) : (
                  'Espace Pro'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/pro" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
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
        <div className="p-3 border-t border-slate-700">
          <LogOutButton className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm" />
        </div>
      </aside>
    </>
  );
}
