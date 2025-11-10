"use client";

import { type Metadata } from "next";
import { useState } from "react";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulating form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 mb-2 leading-tight">
              <span className="text-primary">Contactez-nous</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-7xl mx-auto leading-relaxed">
              Une question ? Une suggestion ? Contactez-nous, nous vous répondrons dans les plus brefs délais.
            </p>
            <p className="text-xl text-gray-600 max-w-7xl mx-auto leading-relaxed">
              Nous sommes disponible du lundi au vendredi, de 9h à 18h.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600 mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Votre message..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-secondary hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                  <span>Envoyer le message</span>
                </button>

                {submitted && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-center font-medium">
                    ✓ Merci ! Nous avons bien reçu votre message.
                  </div>
                )}
              </form>
            </div>
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Nos coordonnées
              </h2>

              {/* Email Card */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                    <a
                      href="mailto:support@ollafidelite.com"
                      className="text-primary hover:text-secondary font-semibold inline-flex items-center gap-2 transition-colors"
                    >
                      support@ollafidelite.com
                      <Send className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Téléphone</h3>
                    <a
                      href="tel:+33123456789"
                      className="text-primary hover:text-secondary font-semibold inline-flex items-center gap-2 transition-colors"
                    >
                      +33 6 52 21 13 52
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
