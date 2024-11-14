export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'BEER' | 'WINE' | 'COCKTAIL' | 'SOFT_DRINK';
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  table_id: string;
  items: CartItem[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'PAID';
  total: number;
  created_at: string;
  updated_at: string;
  table?: {
    number: number;
  };
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: 'BEER' | 'WINE' | 'COCKTAIL' | 'SOFT_DRINK';
  stock: number;
}