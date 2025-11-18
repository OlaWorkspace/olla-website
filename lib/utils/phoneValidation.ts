// lib/utils/phoneValidation.ts

/**
 * Formats de téléphone acceptés par la base de données :
 * - +33 X XX XX XX XX (format international avec espaces)
 * - XXXXXXXXXX (10 chiffres sans espaces)
 */

export interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  error?: string;
}

/**
 * Formate un numéro de téléphone français au format attendu par la BDD
 */
export function formatPhoneNumber(phone: string): PhoneValidationResult {
  // Nettoyer l'entrée
  const cleaned = phone.replace(/\s+/g, '').replace(/[-().]/g, '');

  // Cas 1: Commence par +33
  if (cleaned.startsWith('+33')) {
    const digits = cleaned.substring(3);

    // Doit avoir exactement 9 chiffres après +33
    if (digits.length !== 9 || !/^\d+$/.test(digits)) {
      return {
        isValid: false,
        formatted: phone,
        error: 'Le numéro doit contenir 9 chiffres après +33'
      };
    }

    // Formater en +33 X XX XX XX XX
    const formatted = `+33 ${digits[0]} ${digits.substring(1, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 9)}`;
    return {
      isValid: true,
      formatted
    };
  }

  // Cas 2: Commence par 0 (format français standard)
  if (cleaned.startsWith('0')) {
    // Doit avoir exactement 10 chiffres
    if (cleaned.length !== 10 || !/^\d+$/.test(cleaned)) {
      return {
        isValid: false,
        formatted: phone,
        error: 'Le numéro doit contenir 10 chiffres'
      };
    }

    // Retourner tel quel (10 chiffres sans espaces)
    return {
      isValid: true,
      formatted: cleaned
    };
  }

  // Cas 3: Commence par 33 (sans le +)
  if (cleaned.startsWith('33')) {
    const digits = cleaned.substring(2);

    if (digits.length !== 9 || !/^\d+$/.test(digits)) {
      return {
        isValid: false,
        formatted: phone,
        error: 'Le numéro doit contenir 9 chiffres après 33'
      };
    }

    // Formater en +33 X XX XX XX XX
    const formatted = `+33 ${digits[0]} ${digits.substring(1, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 9)}`;
    return {
      isValid: true,
      formatted
    };
  }

  // Cas 4: Commence par un chiffre autre que 0 ou 3
  if (/^\d+$/.test(cleaned)) {
    if (cleaned.length === 9) {
      // Peut-être un numéro sans le 0 initial, on l'ajoute
      const withZero = '0' + cleaned;
      return {
        isValid: true,
        formatted: withZero
      };
    }
  }

  return {
    isValid: false,
    formatted: phone,
    error: 'Format invalide. Utilisez un numéro français (ex: 01 23 45 67 89 ou +33 1 23 45 67 89)'
  };
}

/**
 * Valide un numéro de téléphone selon les contraintes de la BDD
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone || phone.trim() === '') return false;

  const result = formatPhoneNumber(phone);
  return result.isValid;
}

/**
 * Formate un numéro pour l'affichage (avec espaces)
 */
export function displayPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '').replace(/[-().]/g, '');

  // Si déjà au format +33 X XX XX XX XX
  if (phone.match(/^\+33\s\d{1}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/)) {
    return phone;
  }

  // Si 10 chiffres commençant par 0
  if (cleaned.match(/^0\d{9}$/)) {
    return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}`;
  }

  // Si commence par +33
  if (cleaned.startsWith('+33') && cleaned.length === 12) {
    const digits = cleaned.substring(3);
    return `+33 ${digits[0]} ${digits.substring(1, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 9)}`;
  }

  return phone;
}
