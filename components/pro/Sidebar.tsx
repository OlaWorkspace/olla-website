"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, CreditCard, Users, HelpCircle, LifeBuoy } from "lucide-react";
import LogOutButton from "@/components/LogOutButton";

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

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/pro" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
            O
          </div>
          <span className="font-bold text-lg">Olla</span>
        </Link>
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
