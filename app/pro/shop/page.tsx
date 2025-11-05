export default function ShopPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Shop
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Gérez vos produits, stocks et tarifs
      </p>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">Vous n'avez pas encore de produits</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition">
            Ajouter un produit
          </button>
        </div>
      </div>
    </div>
  );
}
