export default function AbonnementsPage() {
  const plans = [
    {
      name: "Starter",
      price: "29€",
      description: "Pour débuter",
      features: ["1 commerce", "Jusqu'à 100 clients", "Support email"],
    },
    {
      name: "Professional",
      price: "79€",
      description: "Pour croître",
      features: ["3 commerces", "Clients illimités", "Support prioritaire"],
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "Sur devis",
      description: "Pour les grands groupes",
      features: ["Commerces illimités", "Features custom", "Support 24/7"],
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Abonnements
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Choisissez le plan qui convient le mieux à votre activité
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg shadow p-6 ${
              plan.recommended ? "border-2 border-blue-600 relative" : "bg-white"
            } ${plan.recommended ? "bg-blue-50" : "bg-white"}`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Recommandé
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <p className="text-slate-500 mb-4">{plan.description}</p>
            <div className="text-3xl font-bold text-blue-600 mb-6">{plan.price}</div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full font-semibold py-3 rounded-lg transition ${
                plan.recommended
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900"
              }`}
            >
              {plan.recommended ? "S'abonner" : "Voir les détails"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
