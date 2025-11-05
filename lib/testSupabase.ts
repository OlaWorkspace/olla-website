/**
 * Test Supabase Configuration
 * Usage: Importe et appelle testSupabase() dans la console du browser
 */

import { supabase } from "./supabaseClient";

export async function testSupabase() {
  console.log("🧪 Testing Supabase configuration...\n");

  // 1. Check env vars
  console.log("1️⃣ Environment Variables:");
  console.log(
    "   NEXT_PUBLIC_SUPABASE_URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  console.log(
    "   NEXT_PUBLIC_SUPABASE_ANON_KEY exists:",
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL not set!");
    return;
  }

  // 2. Check Supabase connection
  console.log("\n2️⃣ Supabase Connection:");
  try {
    const { data, error } = await supabase
      .from("auth.users")
      .select("count");

    if (error) {
      console.log("   ⚠️ Cannot query auth.users (expected, it's protected)");
    } else {
      console.log("   ✅ Supabase connected!");
    }
  } catch (err) {
    console.log("   ⚠️ Query failed (expected for protected table)");
  }

  // 3. Check current session
  console.log("\n3️⃣ Current Session:");
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    console.log("   ✅ Session found:", session.user.email);
  } else {
    console.log("   ℹ️ No session (expected if not logged in)");
  }

  // 4. Test signIn (use test credentials)
  console.log("\n4️⃣ Test Sign In:");
  console.log("   To test: call testSignIn('test@example.com', 'password123')");

  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSession: !!session,
    sessionUser: session?.user.email,
  };
}

export async function testSignIn(email: string, password: string) {
  console.log(`\n🔐 Testing sign in with ${email}...\n`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("Response:", { data, error });

  if (error) {
    console.error("❌ Sign in failed:", error.message);
    return false;
  }

  if (data.session) {
    console.log("✅ Sign in successful!");
    console.log("   Session:", data.session.user.email);
    console.log("   Token:", data.session.access_token.substring(0, 20) + "...");
    return true;
  } else {
    console.warn("⚠️ Sign in returned no session");
    return false;
  }
}

// Export for global use in browser console
(globalThis as any).testSupabase = testSupabase;
(globalThis as any).testSignIn = testSignIn;
