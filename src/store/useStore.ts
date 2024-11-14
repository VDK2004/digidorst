import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { CartItem, Product } from '../types';

interface StoreState {
  cart: CartItem[];
  tableId: string | null;
  products: Product[];
  loading: boolean;
  error: string | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setTableId: (tableId: string) => void;
  fetchProducts: () => Promise<void>;
  submitOrder: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  tableId: null,
  products: [],
  loading: false,
  error: null,

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: quantity === 0
        ? state.cart.filter((item) => item.product.id !== productId)
        : state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
    })),

  clearCart: () => set({ cart: [] }),
  
  setTableId: (tableId) => set({ tableId }),

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  submitOrder: async () => {
    const state = get();
    if (!state.tableId || state.cart.length === 0) {
      set({ error: 'Invalid order: Missing table or empty cart' });
      return;
    }

    set({ loading: true, error: null });
    try {
      // First, get or create the table
      const { data: tableData, error: tableError } = await supabase
        .from('tables')
        .select('id')
        .eq('number', state.tableId)
        .single();

      if (tableError && tableError.code !== 'PGRST116') {
        throw tableError;
      }

      let tableId;
      if (!tableData) {
        // Create the table if it doesn't exist
        const { data: newTable, error: createError } = await supabase
          .from('tables')
          .insert({ number: parseInt(state.tableId), status: 'OCCUPIED' })
          .select()
          .single();

        if (createError) throw createError;
        tableId = newTable.id;
      } else {
        tableId = tableData.id;
      }

      const total = state.cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          table_id: tableId,
          status: 'PENDING',
          total: total,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.cart.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart after successful order
      set({ loading: false, error: null });
      get().clearCart();
    } catch (error) {
      console.error('Error submitting order:', error);
      set({ 
        error: 'Failed to submit order. Please try again.', 
        loading: false 
      });
      throw error;
    }
  },
}));