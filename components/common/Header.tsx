"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          Olla
        </Link>

        {/* Desktop Menu - Centered */}
        <ul className="hidden md:flex items-center gap-8 text-text-light font-medium absolute left-1/2 transform -translate-x-1/2">
          <li>
            <Link href="/" className="hover:text-primary transition">
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/marketing/features" className="hover:text-primary transition">
              Fonctionnalités
            </Link>
          </li>
          <li>
            <Link href="/marketing/pricing" className="hover:text-primary transition">
              Tarifs
            </Link>
          </li>
          <li>
            <Link href="/marketing/faq" className="hover:text-primary transition">
              FAQ
            </Link>
          </li>
          <li>
            <Link href="/marketing/contact" className="hover:text-primary transition">
              Contact
            </Link>
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className="hidden md:flex gap-4">
          <Link
            href="/auth/login"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
          >
            Espaces pro
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-2 bg-success text-white rounded-lg hover:bg-opacity-90 transition"
          >
            Devenir Pro
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-4">
          <Link href="/" className="block text-text hover:text-primary">
            Accueil
          </Link>
          <Link
            href="/marketing/features"
            className="block text-text hover:text-primary"
          >
            Fonctionnalités
          </Link>
          <Link href="/marketing/pricing" className="block text-text hover:text-primary">
            Tarifs
          </Link>
          <Link href="/marketing/faq" className="block text-text hover:text-primary">
            FAQ
          </Link>
          <Link href="/marketing/contact" className="block text-text hover:text-primary">
            Contact
          </Link>
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="block px-6 py-2 bg-primary text-white rounded-lg text-center hover:bg-secondary transition"
            >
              Espaces pro
            </Link>
            <Link
              href="/auth/signup"
              className="block px-6 py-2 bg-success text-white rounded-lg text-center hover:bg-opacity-90 transition"
            >
              Devenir Pro
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
