import { createClient } from "@/lib/supabase/clients/server";

export default async function ComptesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Comptes
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Gérez votre profil et les accès utilisateurs
      </p>

      <div className="space-y-6">
        {/* Profil utilisateur */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Mon profil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'entreprise</label>
              <input
                type="text"
                placeholder="Votre entreprise"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
              <input
                type="tel"
                placeholder="+33 6 00 00 00 00"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition mt-6">
              Sauvegarder
            </button>
          </div>
        </div>

        {/* Utilisateurs de l'équipe */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Utilisateurs</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
              Ajouter un utilisateur
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-slate-500">Aucun utilisateur supplémentaire</p>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sécurité</h2>
          <button className="border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold px-6 py-3 rounded-lg transition">
            Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
}
