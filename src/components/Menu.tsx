import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Beer, Wine, Martini, Coffee, Ticket } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useWakeLock } from '../hooks/useWakeLock';

const CategoryIcons = {
  BEER: Beer,
  WINE: Wine,
  COCKTAIL: Martini,
  SOFT_DRINK: Coffee,
};

export function Menu() {
  const { tableId } = useParams();
  const { products, loading, error, addToCart, fetchProducts, setTableId } =
    useStore();
    
  // Keep screen awake while viewing menu
  useWakeLock();

  useEffect(() => {
    if (tableId) {
      setTableId(tableId);
    }
    fetchProducts();
  }, [fetchProducts, tableId, setTableId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>Error loading menu: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Table {tableId}</h2>
        <p className="mt-2 text-gray-600">Select your drinks below</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => {
          const Icon = CategoryIcons[item.category];
          const isOutOfStock = item.stock === 0;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6 ${
                isOutOfStock ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Icon className="h-8 w-8 text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h3>
              </div>
              <p className="mt-2 text-gray-600 text-sm">{item.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900 flex items-center gap-1">
                    <Ticket className="h-5 w-5 text-amber-600" />
                    {item.price} {item.price === 1 ? 'token' : 'tokens'}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {isOutOfStock ? 'Out of stock' : `${item.stock} available`}
                  </p>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  disabled={isOutOfStock}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isOutOfStock
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Order'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}