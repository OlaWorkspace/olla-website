// Types globaux pour l'application Olla

export interface User {
  id: string;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  pro: boolean;
  admin: boolean;
  auth_id: string | null;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  features: string[];
  max_loyalty_programs: number | null;
  display_order: number;
  is_active?: boolean;
  promotion_enabled?: boolean;
  promotion_label?: string | null;
  promotion_months_free?: number;
  promotion_quantity_limit?: number | null;
  promotion_quantity_used?: number;
  promotion_start_date?: string | null;
  promotion_end_date?: string | null;
}

export interface BusinessData {
  businessName: string;
  address: string;
  phone: string;
  website?: string | null;
  category: string;
  openingHours?: any;
}

export interface Toast {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
