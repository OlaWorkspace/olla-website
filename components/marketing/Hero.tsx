'use client';

import Link from "next/link";
import { Smartphone, Zap, Shield, Gift, Check } from "lucide-react";

export default function Hero() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

      {/* Hero Section - Modern & Clean */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 animate-fadeInUp flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
                <Zap className="w-4 h-4" />
                <span>La fidélité réinventée</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Toutes vos cartes </span>
                <span className="text-primary">en une seule app</span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed  mx-auto lg:mx-0">
                Fini les cartes papier perdues ! Collectez vos points avec un simple scan et réclamez vos récompenses en toute sécurité.
              </p>

              {/* Features List */}
              <div className="flex flex-col gap-3 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                  <span className="text-lg">100% gratuit pour les clients, sans publicité</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                  <span className="text-lg">Scan NFC & QR code ultra-rapide</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                  <span className="text-lg">Programme de fidélité personnalisable</span>
                </div>           
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <a
                  href="https://apps.apple.com/app/olla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary border-2 border-primary rounded-2xl font-semibold hover:bg-secondary hover:text-white hover:border-secondary hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span>Télécharger sur l'App Store</span>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.olla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary border-2 border-primary rounded-2xl font-semibold hover:bg-secondary hover:text-white hover:border-secondary hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <span>Obtenir sur Google Play</span>
                </a>
              </div>
            </div>

            {/* Right - Phone Mockup */}
            <div className="relative lg:flex justify-end animate-float hidden flex-shrink-0">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>

                {/* Phone mockup */}
                <div className="relative w-[300px] h-[610px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    <img
                      src="/phone-screenshot1.png"
                      alt="Olla App Screenshot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl"></div>
                </div>

                {/* Floating cards */}
                <div className="absolute -left-8 top-20 bg-white p-4 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
                  <Gift className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -right-8 top-40 bg-white p-4 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -left-4 bottom-32 bg-white p-4 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section 
      A METTRE PLUS TARD*/}
      {/* <section className="bg-gradient-to-b from-primary to-secondary py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Commerces partenaires</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">500K+</div>
              <div className="text-blue-100">Points échangés</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">4.8★</div>
              <div className="text-blue-100">Note moyenne</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      
    </>
  );
}
