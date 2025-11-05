"use client";

import Section from "@/components/section";
import { type Metadata } from "next";
import { useState } from "react";
import { Mail, MapPin, MessageSquare } from "lucide-react";

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
      <Section>
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-text mb-4">
            Nous aimerions vous entendre
          </h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            Une question ? Une suggestion ? Contactez-nous, nous vous répondrons
            rapidement.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">Email</h3>
                <p className="text-text-light">hello@olla.app</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">Chat en direct</h3>
                <p className="text-text-light">
                  Disponible du lundi au vendredi, 9h-18h
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">Localisation</h3>
                <p className="text-text-light">France</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-text font-semibold mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-text font-semibold mb-2">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-text font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
              >
                Envoyer
              </button>

              {submitted && (
                <div className="p-4 bg-success/10 border border-success text-success rounded-lg text-center">
                  Merci ! Nous avons bien reçu votre message.
                </div>
              )}
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
