export type CurrencyCode = 'INR' | 'USD' | 'EUR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Rate relative to INR
  locale: string;
}

export interface UserProfile {
  name: string;
  email: string;
  addresses: string[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  highlights: string[];
  reviews?: Review[];
  specs?: Record<string, string>;
  inStock?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  customer: {
    name: string;
    email: string;
    address: string;
  };
  createdAt: string;
}
