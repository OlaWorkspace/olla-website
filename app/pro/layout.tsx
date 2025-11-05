import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/clients/server";
import Sidebar from "@/components/pro/Sidebar";

export default async function ProLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
