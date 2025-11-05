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

  // Récupération de l'utilisateur et rafraîchissement de la session
  const { data: { user } } = await supabase.auth.getUser();

  // Redirection de /dashboard vers /pro
  if (request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/pro', request.url));
  }

  // Routes protégées
  const protectedRoutes = ['/pro', '/onboarding'];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    // Redirection vers la page de login si pas d'utilisateur
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est authentifié, vérifier son statut pro et le statut onboarding
  if (user && (request.nextUrl.pathname.startsWith('/onboarding/business') || request.nextUrl.pathname.startsWith('/pro'))) {
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('id, pro')
        .eq('auth_id', user.id)
        .single();

      if (!userProfile?.pro) {
        // Si accès à /pro mais pro = false, rediriger vers /onboarding/business
        if (request.nextUrl.pathname.startsWith('/pro')) {
          return NextResponse.redirect(new URL('/onboarding/business', request.url));
        }
      } else {
        // L'utilisateur est pro = true
        // Vérifier s'il a complété le business onboarding
        const { count: businessCount } = await supabase
          .from('professionals')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userProfile.id);

        if (businessCount === 0) {
          // Pro mais sans business, doit compléter l'onboarding
          if (request.nextUrl.pathname.startsWith('/pro')) {
            return NextResponse.redirect(new URL('/onboarding/business', request.url));
          }
        } else {
          // Pro avec business, ne peut pas accéder à /onboarding/business
          if (request.nextUrl.pathname.startsWith('/onboarding/business')) {
            return NextResponse.redirect(new URL('/pro', request.url));
          }
        }
      }
    } catch (error) {
      console.error('Error checking user pro status:', error);
    }
  }

  // Si l'utilisateur vient de signup et accède à /login ou /onboarding/plan
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/onboarding/plan')) {
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('id, pro')
        .eq('auth_id', user.id)
        .single();

      if (userProfile?.pro) {
        // Vérifier si l'utilisateur a déjà un business
        const { count: businessCount } = await supabase
          .from('professionals')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userProfile.id);

        if (businessCount === 0) {
          // Nouvel utilisateur pro, aller à business creation
          return NextResponse.redirect(new URL('/onboarding/business', request.url));
        } else {
          // Utilisateur pro avec business, aller au pro dashboard
          return NextResponse.redirect(new URL('/pro', request.url));
        }
      }
    } catch (error) {
      console.error('Error checking user on login:', error);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
