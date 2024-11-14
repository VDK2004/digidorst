import React, { useState, useEffect } from 'react';
import { ClipboardList, BarChart3 } from 'lucide-react';
import { ProductForm } from './admin/ProductForm';
import { ProductList } from './admin/ProductList';
import { OrderList } from './admin/OrderList';
import { Analytics } from './admin/Analytics';
import { useAdminStore } from '../store/useAdminStore';
import { useWakeLock } from '../hooks/useWakeLock';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics'>('orders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Keep screen awake
  useWakeLock();
  
  const {
    orders,
    products,
    formData,
    setFormData,
    editingProductId,
    setEditingProductId,
    error,
    fetchOrders,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus
  } = useAdminStore();

  const initialFormData = {
    name: '',
    description: '',
    price: 0,
    category: 'BEER' as const,
    stock: 0,
  };

  useEffect(() => {
    // Initial data fetch based on active tab
    if (activeTab === 'orders') {
      fetchOrders();
      // Set up polling for new orders every 10 seconds
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    } else if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab, fetchOrders, fetchProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, formData);
      } else {
        await createProduct(formData);
      }
      setIsModalOpen(false);
      setFormData(initialFormData);
      setEditingProductId(null);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <ClipboardList className="h-6 w-6 text-amber-600" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'products'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {activeTab === 'orders' && (
        <OrderList
          orders={orders}
          onUpdateStatus={updateOrderStatus}
        />
      )}

      {activeTab === 'products' && (
        <ProductList
          products={products}
          onAdd={() => {
            setFormData(initialFormData);
            setEditingProductId(null);
            setIsModalOpen(true);
          }}
          onEdit={(product) => {
            setFormData({
              name: product.name,
              description: product.description || '',
              price: product.price,
              category: product.category,
              stock: product.stock,
            });
            setEditingProductId(product.id);
            setIsModalOpen(true);
          }}
          onDelete={deleteProduct}
        />
      )}

      {activeTab === 'analytics' && <Analytics />}

      {isModalOpen && (
        <ProductForm
          formData={formData}
          onSubmit={handleSubmit}
          onChange={setFormData}
          onClose={() => {
            setIsModalOpen(false);
            setFormData(initialFormData);
            setEditingProductId(null);
          }}
          isEditing={!!editingProductId}
        />
      )}
    </div>
  );
}