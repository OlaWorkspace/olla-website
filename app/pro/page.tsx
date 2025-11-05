import { createClient } from "@/lib/supabase/clients/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Bienvenue {user?.email} 👋
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Gérez vos commerces et fidélité clients depuis votre dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards dashboard */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Commerces actifs</h2>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-slate-500 mt-2">Aucun commerce configuré</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Clients</h2>
          <p className="text-3xl font-bold text-green-600">0</p>
          <p className="text-sm text-slate-500 mt-2">Aucun client enregistré</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Statut abonnement</h2>
          <p className="text-3xl font-bold text-orange-600">—</p>
          <p className="text-sm text-slate-500 mt-2">Souscrire à un plan</p>
        </div>
      </div>
    </div>
  );
}
