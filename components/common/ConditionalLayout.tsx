'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Routes qui ne doivent PAS avoir Header/Footer
  const noLayoutRoutes = ['/pro', '/auth', '/onboarding', '/admin'];
  const shouldHideLayout = noLayoutRoutes.some(route => pathname.startsWith(route));

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
