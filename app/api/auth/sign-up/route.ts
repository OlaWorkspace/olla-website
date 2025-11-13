import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, confirmPassword, firstName, lastName } = await request.json();

  console.log('Sign-up request:', { email, firstName, lastName, hasPassword: !!password, hasConfirm: !!confirmPassword });

  // Validation
  if (!email || !password || !confirmPassword || !firstName || !lastName) {
    console.error('Validation failed:', { email, password, confirmPassword, firstName, lastName });
    return NextResponse.json(
      { error: "Tous les champs sont requis" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Les mots de passe ne correspondent pas" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 6 caractères" },
      { status: 400 }
    );
  }

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
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    // Passer les infos utilisateur dans les métadonnées
    // Le trigger handle_new_user les utilisera automatiquement
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          pro: true  // 👈 Important : marquer comme professionnel
        }
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data?.user) {
      return NextResponse.json(
        {
          success: true,
          user: data.user,
          message: "Inscription réussie. Redirection en cours..."
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: "L'inscription a échoué" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Erreur signup:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
