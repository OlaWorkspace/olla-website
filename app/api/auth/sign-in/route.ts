import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (data?.session) {
    // Vérifier si l'utilisateur est un professionnel et/ou admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('pro, admin')
      .eq('auth_id', data.user.id)
      .single();

    if (userError) {
      // Déconnecter l'utilisateur si on ne peut pas vérifier son statut
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Erreur lors de la vérification du compte" },
        { status: 500 }
      );
    }

    // Vérifier si l'utilisateur est pro ou admin
    if (!userData.pro && !userData.admin) {
      // Déconnecter l'utilisateur non-pro et non-admin
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Cet espace est réservé aux professionnels" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, user: data.user, isAdmin: userData.admin },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { error: "Sign in failed" },
    { status: 400 }
  );
}
