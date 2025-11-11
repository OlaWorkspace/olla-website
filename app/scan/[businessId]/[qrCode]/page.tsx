'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ScanFallbackPage() {
  const params = useParams();
  const businessId = params?.businessId as string;
  const qrCode = params?.qrCode as string;

  const [platform, setPlatform] = useState<'ios' | 'android' | 'unknown'>('unknown');
  const [appOpened, setAppOpened] = useState(false);

  useEffect(() => {
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

    // Essayer d'ouvrir l'app
    const timeout = setTimeout(() => {
      // Si après 1.5s on est toujours sur la page, l'app n'est probablement pas installée
      setAppOpened(false);
    }, 1500);

    // Tenter l'ouverture
    window.location.href = deepLink;

    // Sauvegarder le lien pour après installation
    if (typeof window !== 'undefined') {
      localStorage.setItem('olla_pending_scan', universalLink);
    }

    // Cleanup
    return () => clearTimeout(timeout);
  }, [businessId, qrCode]);

  const handleDownload = () => {
    if (platform === 'ios') {
      window.location.href = 'https://apps.apple.com/app/id6751494865';
    } else if (platform === 'android') {
      window.location.href = 'https://play.google.com/store/apps/details?id=com.loyalty.olla';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card principale */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24">
              <Image
                src="/logo-fond-bleu.png"
                alt="OLLA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Scannez et gagnez !
          </h1>

          <p className="text-lg text-slate-600 mb-8">
            Téléchargez l'application OLLA pour gagner vos points de fidélité instantanément
          </p>

          {/* Icône de scan animée */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-10 h-10 text-blue-600"
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
          <div className="space-y-4">
            {platform === 'ios' && (
              <button
                onClick={handleDownload}
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Télécharger sur</div>
                  <div className="text-lg font-bold -mt-1">App Store</div>
                </div>
              </button>
            )}

            {platform === 'android' && (
              <button
                onClick={handleDownload}
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Disponible sur</div>
                  <div className="text-lg font-bold -mt-1">Google Play</div>
                </div>
              </button>
            )}

            {platform === 'unknown' && (
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = 'https://apps.apple.com/app/id6751494865'}
                  className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Télécharger sur</div>
                    <div className="text-lg font-bold -mt-1">App Store</div>
                  </div>
                </button>

                <button
                  onClick={() => window.location.href = 'https://play.google.com/store/apps/details?id=com.loyalty.olla'}
                  className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Disponible sur</div>
                    <div className="text-lg font-bold -mt-1">Google Play</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Message informatif */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-blue-600">✓</span> Une fois l'app installée, vos points seront automatiquement ajoutés à votre compte !
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white text-sm opacity-80">
            Rejoignez des milliers d'utilisateurs qui gagnent des points de fidélité avec OLLA
          </p>
        </div>
      </div>
    </div>
  );
}
