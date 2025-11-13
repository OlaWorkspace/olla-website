'use client';

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Footer() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12">
        {/* Brand - Visible on mobile only */}
        <div className="mb-4 md:hidden">
          <h3 className="text-base font-bold text-text mb-2">Olla Fidelite</h3>
          <p className="text-text-light text-[10px]">
            La fidélité sans carte. Un système complet pour tous vos commerces.
          </p>
        </div>

        {/* Desktop view - grid layout with Brand */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-text mb-4">Olla</h3>
            <p className="text-text-light text-sm">
              La fidélité sans carte. Un système complet pour tous vos commerces.
            </p>
          </div>
          {/* Product */}
          <div>
            <h4 className="font-semibold text-text text-base mb-4">Produit</h4>
            <ul className="space-y-2 text-sm text-text-light">
              <li>
                <Link href="/marketing/features" className="hover:text-primary transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/marketing/pricing" className="hover:text-primary transition-colors">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-text text-base mb-4">Entreprise</h4>
            <ul className="space-y-2 text-sm text-text-light">
              <li>
                <Link href="/marketing/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/info/about" className="hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-text text-base mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-text-light">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  CGU
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile view - accordion */}
        <div className="md:hidden space-y-2 mb-6">
          {/* Product */}
          <div className="border-b border-border">
            <button
              onClick={() => toggleSection('product')}
              className="w-full flex items-center justify-between py-3 text-text font-semibold text-sm"
            >
              <span>Produit</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSections['product'] ? 'rotate-180' : ''}`}
              />
            </button>
            {openSections['product'] && (
              <ul className="space-y-2 pb-3 text-xs text-text-light">
                <li>
                  <Link href="/marketing/features" className="hover:text-primary transition-colors block py-1">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="/marketing/pricing" className="hover:text-primary transition-colors block py-1">
                    Tarifs
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Company */}
          <div className="border-b border-border">
            <button
              onClick={() => toggleSection('company')}
              className="w-full flex items-center justify-between py-3 text-text font-semibold text-sm"
            >
              <span>Entreprise</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSections['company'] ? 'rotate-180' : ''}`}
              />
            </button>
            {openSections['company'] && (
              <ul className="space-y-2 pb-3 text-xs text-text-light">
                <li>
                  <Link href="/marketing/contact" className="hover:text-primary transition-colors block py-1">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/info/about" className="hover:text-primary transition-colors block py-1">
                    À propos
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Legal */}
          <div className="border-b border-border">
            <button
              onClick={() => toggleSection('legal')}
              className="w-full flex items-center justify-between py-3 text-text font-semibold text-sm"
            >
              <span>Légal</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSections['legal'] ? 'rotate-180' : ''}`}
              />
            </button>
            {openSections['legal'] && (
              <ul className="space-y-2 pb-3 text-xs text-text-light">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors block py-1">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors block py-1">
                    CGU
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors block py-1">
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-4 sm:pt-8 text-center text-[10px] sm:text-sm text-text-light">
          <p>© 2024 Olla. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
