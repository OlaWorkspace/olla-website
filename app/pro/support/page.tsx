import { Mail, MessageSquare, Phone } from "lucide-react";

export default function SupportPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Support
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Nous sommes là pour vous aider
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Contact direct */}
        <div className="bg-white rounded-lg shadow p-6">
          <Mail size={32} className="text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
          <p className="text-slate-600 mb-4">Nous répondons en maximum 24h</p>
          <a
            href="mailto:support@ollafidelite.com"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            support@ollafidelite.com
          </a>
        </div>

        {/* Chat */}
        <div className="bg-white rounded-lg shadow p-6">
          <MessageSquare size={32} className="text-green-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chat en direct</h3>
          <p className="text-slate-600 mb-4">Parlez à un expert maintenant</p>
          <button className="text-green-600 hover:text-green-700 font-semibold">
            Ouvrir le chat
          </button>
        </div>

        {/* Téléphone */}
        <div className="bg-white rounded-lg shadow p-6">
          <Phone size={32} className="text-orange-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Téléphone</h3>
          <p className="text-slate-600 mb-4">Du lundi au vendredi, 9h-18h</p>
          <a
            href="tel:+33123456789"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            +33 6 52 21 13 52
          </a>
        </div>
      </div>

      {/* Formulaire de contact */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Envoyez-nous un message</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sujet
            </label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Sélectionnez un sujet</option>
              <option>Problème technique</option>
              <option>Question produit</option>
              <option>Facturation</option>
              <option>Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              placeholder="Décrivez votre problème en détail..."
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Envoyer le message
          </button>
        </form>
      </div>

      {/* Statut du système */}
      <div className="mt-8 bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Statut du système</h3>
        <p className="text-green-700">
          ✓ Tous les services fonctionnent normalement
        </p>
        <a href="#" className="text-green-600 hover:text-green-700 font-semibold mt-2 inline-block">
          Voir le statut en détail
        </a>
      </div>
    </div>
  );
}
