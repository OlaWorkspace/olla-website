"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, CreditCard, Users, HelpCircle, LifeBuoy } from "lucide-react";
import LogOutButton from "@/components/common/LogOutButton";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/clients/browser";

const menuItems = [
  {
    label: "Dashboard",
    href: "/pro",
    icon: LayoutDashboard,
  },
  {
    label: "Shop",
    href: "/pro/shop",
    icon: ShoppingCart,
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

export default function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserName = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('user_firstname, user_lastname')
          .eq('auth_id', user.id)
          .single();

        if (dbUser) {
          setUserName(`${dbUser.user_firstname} ${dbUser.user_lastname}`);
        }
      }
    };

    fetchUserName();
  }, []);

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* User Info */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
            {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{userName || 'Utilisateur'}</p>
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
        <LogOutButton className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors" />
      </div>
    </aside>
  );
}
