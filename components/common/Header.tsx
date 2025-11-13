"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-fond-bleu.png"
            alt="Olla Logo"
            width={50}
            height={50}
            className="w-12 h-12 rounded-xl"
          />
          <span className="text-3xl font-semibold text-primary hidden sm:inline">Olla Fidelite</span>
        </Link>

        {/* Desktop Menu - Centered */}
        <ul className="hidden md:flex items-center gap-8 text-primary font-medium absolute left-1/2 transform -translate-x-1/2">
          <li>
            <Link href="/" className="hover:text-secondary transition">
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/marketing/features" className="hover:text-secondary transition">
              Fonctionnalités
            </Link>
          </li>
          <li>
            <Link href="/marketing/pricing" className="hover:text-secondary transition">
              Tarifs
            </Link>
          </li>
          <li>
            <Link href="/marketing/faq" className="hover:text-secondary transition">
              FAQ
            </Link>
          </li>
          <li>
            <Link href="/marketing/contact" className="hover:text-secondary transition">
              Contact
            </Link>
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className="hidden md:flex gap-4">
          <Link
            href="/auth/login"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
          >
            Espaces pro
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary"
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
        <div className="md:hidden bg-white px-4 py-4 space-y-4">
          <Link href="/" className="block text-primary hover:text-secondary transition">
            Accueil
          </Link>
          <Link
            href="/marketing/features"
            className="block text-primary hover:text-secondary transition"
          >
            Fonctionnalités
          </Link>
          <Link href="/marketing/pricing" className="block text-primary hover:text-secondary transition">
            Tarifs
          </Link>
          <Link href="/marketing/faq" className="block text-primary hover:text-secondary transition">
            FAQ
          </Link>
          <Link href="/marketing/contact" className="block text-primary hover:text-secondary transition">
            Contact
          </Link>
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="block px-6 py-2 bg-primary text-white rounded-lg text-center hover:bg-secondary transition font-semibold"
            >
              Espace pro
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
