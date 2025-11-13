import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Récupérer l'utilisateur de manière sécurisée (authentification via serveur Supabase)
  const { data: { user } } = await supabase.auth.getUser();

  // Si l'utilisateur est connecté et va sur /auth/login, le rediriger vers son espace
  if (user && request.nextUrl.pathname === '/auth/login') {
    // Récupérer le rôle de l'utilisateur
    const { data: userData } = await supabase
      .from('users')
      .select('pro, admin, onboarding_status')
      .eq('auth_id', user.id)
      .single();

    if (userData) {
      if (userData.admin) {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userData.pro) {
        // Check onboarding status for professionals
        if (userData.onboarding_status !== 'completed') {
          return NextResponse.redirect(new URL(getOnboardingRedirectPath(userData.onboarding_status), request.url));
        }
        return NextResponse.redirect(new URL('/pro', request.url));
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  // Protéger /pro et /onboarding sans user
  if ((request.nextUrl.pathname.startsWith('/pro') || request.nextUrl.pathname.startsWith('/onboarding') || request.nextUrl.pathname.startsWith('/admin')) && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Gestion de l'onboarding pour les professionnels connectés
  if (user && request.nextUrl.pathname.startsWith('/pro')) {
    const { data: userData } = await supabase
      .from('users')
      .select('pro, onboarding_status')
      .eq('auth_id', user.id)
      .single();

    if (userData?.pro && userData.onboarding_status !== 'completed') {
      // Rediriger vers l'étape appropriée de l'onboarding
      return NextResponse.redirect(new URL(getOnboardingRedirectPath(userData.onboarding_status), request.url));
    }
  }

  // Si un professionnel avec onboarding complété essaie d'accéder aux pages d'onboarding
  if (user && request.nextUrl.pathname.startsWith('/onboarding')) {
    const { data: userData } = await supabase
      .from('users')
      .select('pro, onboarding_status')
      .eq('auth_id', user.id)
      .single();

    if (userData?.pro && userData.onboarding_status === 'completed') {
      // Rediriger vers le dashboard pro
      return NextResponse.redirect(new URL('/pro', request.url));
    }
  }

  return response;
}

// Helper function to determine the correct onboarding step based on status
function getOnboardingRedirectPath(status: string | null): string {
  switch (status) {
    case 'plan_selected':
      return '/onboarding/business';
    case 'business_info':
      return '/onboarding/loyalty';
    case 'loyalty_setup':
      return '/onboarding/welcome';
    case 'completed':
      return '/pro';
    default:
      return '/onboarding/plan';
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
