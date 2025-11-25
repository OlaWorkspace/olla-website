'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function InvitationPage() {
  const router = useRouter();
  const params = useParams();
  const token = (params?.token as string) || '';

  // Redirect to login with token
  useEffect(() => {
    if (token) {
      router.push(`/auth/login?token=${token}`);
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-200 rounded-full border-t-primary animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Redirection...</p>
      </div>
    </div>
  );
}
