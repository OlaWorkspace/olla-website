// Catégories de commerce avec labels, icônes et couleurs
export const BUSINESS_CATEGORIES = {
  restaurant: { label: 'Restaurant', shortLabel: 'Restaurants', icon: '🍽️', accentColor: '#0000ff' },
  café: { label: 'Café', shortLabel: 'Cafés', icon: '☕', accentColor: '#8B4513' },
  boulangerie: { label: 'Boulangerie', shortLabel: 'Boulangeries', icon: '🥐', accentColor: '#D4A574' },
  commerce: { label: 'Commerce général', shortLabel: 'Commerces', icon: '🏪', accentColor: '#0000ff' },
  pizzeria: { label: 'Pizzeria', shortLabel: 'Pizzerias', icon: '🍕', accentColor: '#FF6B35' },
  pharmacie: { label: 'Pharmacie', shortLabel: 'Pharmacies', icon: '💊', accentColor: '#0EA5E9' },
  coiffeur: { label: 'Salon de coiffure', shortLabel: 'Coiffeurs', icon: '✂️', accentColor: '#E879F9' },
  librairie: { label: 'Librairie', shortLabel: 'Librairies', icon: '📚', accentColor: '#7C3AED' },
  fleuriste: { label: 'Fleuriste', shortLabel: 'Fleuristes', icon: '🌸', accentColor: '#00A699' },
  supermarché: { label: 'Supermarché', shortLabel: 'Supermarchés', icon: '🛒', accentColor: '#10B981' },
  bar: { label: 'Bar', shortLabel: 'Bars', icon: '🍺', accentColor: '#F59E0B' },
  garage: { label: 'Garage/Automobile', shortLabel: 'Garages', icon: '🚗', accentColor: '#6B7280' },
  vêtements: { label: 'Mode & Vêtements', shortLabel: 'Vêtements', icon: '👕', accentColor: '#EC4899' }
} as const;

// Array pour les sélecteurs (dérivé de BUSINESS_CATEGORIES)
export const CATEGORY_OPTIONS = [
  { key: 'restaurant', label: BUSINESS_CATEGORIES.restaurant.label, icon: BUSINESS_CATEGORIES.restaurant.icon },
  { key: 'café', label: BUSINESS_CATEGORIES.café.label, icon: BUSINESS_CATEGORIES.café.icon },
  { key: 'boulangerie', label: BUSINESS_CATEGORIES.boulangerie.label, icon: BUSINESS_CATEGORIES.boulangerie.icon },
  { key: 'pizzeria', label: BUSINESS_CATEGORIES.pizzeria.label, icon: BUSINESS_CATEGORIES.pizzeria.icon },
  { key: 'bar', label: BUSINESS_CATEGORIES.bar.label, icon: BUSINESS_CATEGORIES.bar.icon },
  { key: 'pharmacie', label: BUSINESS_CATEGORIES.pharmacie.label, icon: BUSINESS_CATEGORIES.pharmacie.icon },
  { key: 'coiffeur', label: BUSINESS_CATEGORIES.coiffeur.label, icon: BUSINESS_CATEGORIES.coiffeur.icon },
  { key: 'librairie', label: BUSINESS_CATEGORIES.librairie.label, icon: BUSINESS_CATEGORIES.librairie.icon },
  { key: 'fleuriste', label: BUSINESS_CATEGORIES.fleuriste.label, icon: BUSINESS_CATEGORIES.fleuriste.icon },
  { key: 'supermarché', label: BUSINESS_CATEGORIES.supermarché.label, icon: BUSINESS_CATEGORIES.supermarché.icon },
  { key: 'vêtements', label: BUSINESS_CATEGORIES.vêtements.label, icon: BUSINESS_CATEGORIES.vêtements.icon },
  { key: 'garage', label: BUSINESS_CATEGORIES.garage.label, icon: BUSINESS_CATEGORIES.garage.icon },
  { key: 'commerce', label: BUSINESS_CATEGORIES.commerce.label, icon: BUSINESS_CATEGORIES.commerce.icon }
] as const;

/**
 * Fonction pour obtenir uniquement la clé de catégorie (sans icône) pour l'envoi API
 * Utilisée pour envoyer les données au backend sans les émojis
 */
export const getCategoryKey = (categoryLabelOrKey: string): string => {
  // Si c'est déjà une clé valide, la retourner
  if (BUSINESS_CATEGORIES[categoryLabelOrKey as keyof typeof BUSINESS_CATEGORIES]) {
    return categoryLabelOrKey;
  }

  // Chercher par label complet (ex: "Restaurant")
  const entryByLabel = Object.entries(BUSINESS_CATEGORIES).find(
    ([_, value]) => value.label === categoryLabelOrKey
  );

  if (entryByLabel) {
    return entryByLabel[0];
  }

  // Chercher si c'est une ancienne valeur avec emoji (ex: "🍽️ Restaurant")
  const entryByEmojiLabel = Object.entries(BUSINESS_CATEGORIES).find(
    ([_, value]) => categoryLabelOrKey.includes(value.label)
  );

  if (entryByEmojiLabel) {
    return entryByEmojiLabel[0];
  }

  // Fallback: retourner 'commerce' par défaut
  return 'commerce';
};

/**
 * Fonction pour obtenir le label avec icône pour l'affichage
 */
export const getCategoryDisplay = (categoryKey: string): string => {
  const category = BUSINESS_CATEGORIES[categoryKey as keyof typeof BUSINESS_CATEGORIES];
  if (category) {
    return `${category.icon} ${category.label}`;
  }
  return `${BUSINESS_CATEGORIES.commerce.icon} ${BUSINESS_CATEGORIES.commerce.label}`;
};
