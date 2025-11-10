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
      .select('pro, admin')
      .eq('auth_id', user.id)
      .single();

    if (userData) {
      if (userData.admin) {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userData.pro) {
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

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
