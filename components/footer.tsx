import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Olla</h3>
            <p className="text-text-light text-sm">
              La fidélité sans carte. Un système complet pour tous vos
              commerces.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-text mb-4">Produit</h4>
            <ul className="space-y-2 text-sm text-text-light">
              <li>
                <Link href="/features" className="hover:text-primary">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-text mb-4">Entreprise</h4>
            <ul className="space-y-2 text-sm text-text-light">
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-text mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-text-light">
              <li>
                <Link href="#" className="hover:text-primary">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  CGU
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 text-center text-sm text-text-light">
          <p>© 2024 Olla. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
