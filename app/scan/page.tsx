'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ScanFallbackPage() {
  const params = useParams();
  const businessId = params?.businessId as string;
  const qrCode = params?.qrCode as string;

  const [platform, setPlatform] = useState<'ios' | 'android' | 'unknown'>('unknown');
  const [countdown, setCountdown] = useState(45);

  // 🔒 SÉCURITÉ: Bloquer F12 et DevTools (utilisateurs basiques)
  useEffect(() => {
    const blockDevTools = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', blockDevTools);
    return () => document.removeEventListener('keydown', blockDevTools);
  }, []);

  // 🔒 SÉCURITÉ: Redirection automatique vers l'accueil après 45 secondes
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Redirection vers l'accueil
          window.location.href = 'https://www.ollafidelite.com';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    // 🔍 DEBUG: Log des paramètres reçus
    console.log('🔍 WEB DEBUG - businessId reçu:', businessId);
    console.log('🔍 WEB DEBUG - qrCode reçu:', qrCode);
    console.log('🔍 WEB DEBUG - params complets:', params);

    // Détecter la plateforme
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/i.test(userAgent)) {
      setPlatform('android');
    }

    // Tenter d'ouvrir l'app via deep link
    const deepLink = `olla://scan/${businessId}/${qrCode}`;
    const universalLink = `https://ollafidelite.com/scan/${businessId}/${qrCode}`;

    // 🔍 DEBUG: Log des liens générés
    console.log('🔍 WEB DEBUG - deepLink généré:', deepLink);
    console.log('🔍 WEB DEBUG - universalLink généré:', universalLink);

    // Essayer d'ouvrir l'app (timeout de 1.5s)
    const timeout = setTimeout(() => {
      // Si après 1.5s on est toujours sur la page, l'app n'est probablement pas installée
      // Rien à faire, la page reste affichée
    }, 1500);

    // Tenter l'ouverture
    window.location.href = deepLink;

    // Sauvegarder le lien pour après installation
    if (typeof window !== 'undefined') {
      localStorage.setItem('olla_pending_scan', universalLink);

      // 🔒 SÉCURITÉ: Masquer l'URL dans la barre d'adresse
      // L'URL devient juste "ollafidelite.com/scan" sans les IDs visibles
      window.history.replaceState(null, '', '/scan');
    }

    // Cleanup
    return () => clearTimeout(timeout);
  }, [businessId, qrCode, params]);

  const handleDownload = () => {
    if (platform === 'ios') {
      window.location.href = 'https://apps.apple.com/app/id6751494865';
    } else if (platform === 'android') {
      window.location.href = 'https://play.google.com/store/apps/details?id=com.loyalty.olla';
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: 'none' }}
    >
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center justify-center">
            <div className="relative w-12 h-12 md:w-16 md:h-16">
              <Image
                src="/logo-fond-bleu.png"
                alt="OLLA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="max-w-md w-full">
          {/* Card principale */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 text-center">
            {/* Titre */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3">
              Scannez et gagnez !
            </h1>

            <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10">
              Téléchargez l'application OLLA pour gagner vos points de fidélité instantanément
            </p>

            {/* Icône de scan animée */}
            <div className="mb-8 md:mb-10 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    className="w-10 h-10 md:w-12 md:h-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                </div>
                {/* Ring animé */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping opacity-20"></div>
              </div>
            </div>

            {/* Boutons de téléchargement */}
            <div className="space-y-3 md:space-y-4">
              {platform === 'ios' && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg text-sm md:text-base"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs md:text-sm">Télécharger sur</div>
                    <div className="font-bold -mt-1">App Store</div>
                  </div>
                </button>
              )}

              {platform === 'android' && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg text-sm md:text-base"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs md:text-sm">Disponible sur</div>
                    <div className="font-bold -mt-1">Google Play</div>
                  </div>
                </button>
              )}

              {platform === 'unknown' && (
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = 'https://apps.apple.com/app/id6751494865'}
                    className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg text-sm md:text-base"
                  >
                    <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs md:text-sm">Télécharger sur</div>
                      <div className="font-bold -mt-1">App Store</div>
                    </div>
                  </button>

                  <button
                    onClick={() => window.location.href = 'https://play.google.com/store/apps/details?id=com.loyalty.olla'}
                    className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg text-sm md:text-base"
                  >
                    <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs md:text-sm">Disponible sur</div>
                      <div className="font-bold -mt-1">Google Play</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Message informatif */}
            <div className="mt-6 md:mt-8 p-4 md:p-5 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs md:text-sm text-slate-600">
                <span className="font-semibold text-blue-600">✓</span> Une fois l'app installée, vos points seront automatiquement ajoutés à votre compte !
              </p>
            </div>

            {/* Timer de redirection */}
            <div className="mt-4 p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs md:text-sm text-slate-600">
                Redirection automatique dans <span className="font-bold text-blue-600">{countdown}s</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="text-slate-600 text-xs md:text-sm">
              Rejoignez des milliers d'utilisateurs qui gagnent des points de fidélité avec OLLA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
