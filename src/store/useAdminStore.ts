import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Product, Order, ProductFormData } from '../types';

interface AdminState {
  orders: Order[];
  products: Product[];
  analytics: {
    totalRevenue: number;
    totalOrders: number;
    productStats: {
      id: string;
      name: string;
      totalSold: number;
      revenue: number;
      category: string;
    }[];
    categoryStats: {
      category: string;
      totalSold: number;
      revenue: number;
    }[];
    timeStats: {
      date: string;
      orders: number;
      revenue: number;
    }[];
  };
  loading: boolean;
  error: string | null;
  formData: ProductFormData;
  editingProductId: string | null;
  setFormData: (data: ProductFormData) => void;
  setEditingProductId: (id: string | null) => void;
  fetchOrders: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
  createProduct: (data: ProductFormData) => Promise<void>;
  updateProduct: (id: string, data: ProductFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  orders: [],
  products: [],
  analytics: {
    totalRevenue: 0,
    totalOrders: 0,
    productStats: [],
    categoryStats: [],
    timeStats: [],
  },
  loading: false,
  error: null,
  formData: {
    name: '',
    description: '',
    price: 0,
    category: 'BEER',
    stock: 0,
  },
  editingProductId: null,

  setFormData: (data) => set({ formData: data }),
  setEditingProductId: (id) => set({ editingProductId: id }),

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          table:tables(number),
          items:order_items(
            *,
            product:products(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: data || [], loading: false });
    } catch (err) {
      console.error('Error fetching orders:', err);
      set({ error: 'Failed to load orders', loading: false });
    }
  },

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ products: data || [], loading: false });
    } catch (err) {
      console.error('Error fetching products:', err);
      set({ error: 'Failed to load products', loading: false });
    }
  },

  fetchAnalytics: async () => {
    try {
      set({ loading: true, error: null });

      // Fetch all completed orders with their items
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            quantity,
            price,
            product:products(
              name,
              category
            )
          )
        `)
        .eq('status', 'PAID');

      if (ordersError) throw ordersError;

      // Process analytics data
      const productStats: Record<string, { 
        name: string;
        totalSold: number;
        revenue: number;
        category: string;
      }> = {};

      const categoryStats: Record<string, {
        totalSold: number;
        revenue: number;
      }> = {};

      const timeStats: Record<string, {
        orders: number;
        revenue: number;
      }> = {};

      let totalRevenue = 0;

      orders?.forEach((order) => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        
        // Initialize time stats for this date
        if (!timeStats[orderDate]) {
          timeStats[orderDate] = { orders: 0, revenue: 0 };
        }
        timeStats[orderDate].orders += 1;
        timeStats[orderDate].revenue += order.total;

        totalRevenue += order.total;

        order.items?.forEach((item) => {
          if (!item.product) return;

          // Product stats
          if (!productStats[item.product.name]) {
            productStats[item.product.name] = {
              name: item.product.name,
              totalSold: 0,
              revenue: 0,
              category: item.product.category,
            };
          }
          productStats[item.product.name].totalSold += item.quantity;
          productStats[item.product.name].revenue += item.price * item.quantity;

          // Category stats
          if (!categoryStats[item.product.category]) {
            categoryStats[item.product.category] = {
              totalSold: 0,
              revenue: 0,
            };
          }
          categoryStats[item.product.category].totalSold += item.quantity;
          categoryStats[item.product.category].revenue += item.price * item.quantity;
        });
      });

      set({
        analytics: {
          totalRevenue,
          totalOrders: orders?.length || 0,
          productStats: Object.values(productStats),
          categoryStats: Object.entries(categoryStats).map(([category, stats]) => ({
            category,
            ...stats,
          })),
          timeStats: Object.entries(timeStats).map(([date, stats]) => ({
            date,
            ...stats,
          })),
        },
        loading: false,
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      set({ error: 'Failed to load analytics', loading: false });
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      await get().fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      set({ error: 'Failed to update order status', loading: false });
    }
  },

  createProduct: async (data) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.from('products').insert([data]);
      if (error) throw error;
      await get().fetchProducts();
    } catch (err) {
      console.error('Error creating product:', err);
      set({ error: 'Failed to create product', loading: false });
    }
  },

  updateProduct: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id);
      if (error) throw error;
      await get().fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      set({ error: 'Failed to update product', loading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      await get().fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      set({ error: 'Failed to delete product', loading: false });
    }
  },
}));