// app/onboarding/layout.tsx
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export const metadata = {
  title: 'Onboarding Professionnel - Olla',
  description: 'Complétez votre inscription professionnelle sur Olla'
};

export default function OnboardingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Minimal Header */}
        <div className="bg-white border-b border-border sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-primary">Olla</h1>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-border mt-12">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-text-light text-sm">
            <p>© 2024 Olla. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </OnboardingProvider>
  );
}
