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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data?.user) {
      // Vérifier si le profil existe déjà
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', data.user.id)
        .single();

      let userProfile;

      if (!existingUser && !checkError) {
        // L'utilisateur n'existe pas, le créer
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            auth_id: data.user.id,
            user_firstname: firstName.trim(),
            user_lastname: lastName.trim(),
            user_email: email,
            pro: true  // 👈 Passer directement en pro
          });

        if (profileError) {
          console.error("Erreur création profil:", profileError);
          return NextResponse.json(
            { error: "Erreur lors de la création du profil" },
            { status: 500 }
          );
        }
      } else if (existingUser) {
        // L'utilisateur existe déjà, le mettre à jour avec les nouvelles données
        const { error: updateError } = await supabase
          .from('users')
          .update({
            user_firstname: firstName.trim(),
            user_lastname: lastName.trim(),
            pro: true
          })
          .eq('auth_id', data.user.id);

        if (updateError) {
          console.error("Erreur mise à jour profil:", updateError);
          return NextResponse.json(
            { error: "Erreur lors de la mise à jour du profil" },
            { status: 500 }
          );
        }
      }

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
