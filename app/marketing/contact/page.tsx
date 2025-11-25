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
    
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-4 sm:py-6 lg:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-2 leading-tight">
              <span className="text-primary">Contactez-nous</span>
            </h1>
            <p className="text-xs sm:text-base lg:text-xl text-gray-600 max-w-7xl mx-auto leading-relaxed mb-1 sm:mb-2">
              Une question ? Une suggestion ? Contactez-nous, nous vous répondrons dans les plus brefs délais.
            </p>
            <p className="text-xs sm:text-base lg:text-xl text-gray-600 max-w-7xl mx-auto leading-relaxed">
              Nous sommes disponible du lundi au vendredi, de 9h à 18h.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-6 sm:py-10 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">

            {/* Contact Form */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 xl:p-10 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-1.5 lg:mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600 text-[10px] sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
              </p>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-gray-900 font-semibold mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Votre message..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-primary text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold text-xs sm:text-sm lg:text-base hover:bg-secondary hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  <span>Envoyer le message</span>
                </button>

                {submitted && (
                  <div className="p-3 sm:p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg sm:rounded-xl lg:rounded-2xl text-center font-medium text-xs sm:text-sm lg:text-base">
                    ✓ Merci ! Nous avons bien reçu votre message.
                  </div>
                )}
              </form>
            </div>
            {/* Contact Info Cards */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
                Nos coordonnées
              </h2>

              {/* Email Card */}
              <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-1.5 lg:mb-2">Email</h3>
                    <a
                      href="mailto:support@ollafidelite.com"
                      className="text-primary hover:text-secondary font-semibold inline-flex items-center gap-1 sm:gap-1.5 lg:gap-2 transition-colors text-[10px] sm:text-sm lg:text-base"
                    >
                      support@ollafidelite.com
                      <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-1.5 lg:mb-2">Téléphone</h3>
                    <a
                      href="tel:+33123456789"
                      className="text-primary hover:text-secondary font-semibold inline-flex items-center gap-1 sm:gap-1.5 lg:gap-2 transition-colors text-[10px] sm:text-sm lg:text-base"
                    >
                      +33 6 52 21 13 52
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
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
