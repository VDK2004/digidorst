import React from 'react';
import { Plus, Pencil, Trash2, Beer, Wine, Martini, Coffee, Ticket } from 'lucide-react';
import { Product } from '../../types';

const CategoryIcons = {
  BEER: Beer,
  WINE: Wine,
  COCKTAIL: Martini,
  SOFT_DRINK: Coffee,
};

interface ProductListProps {
  products: Product[];
  onAdd: () => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductList({ products, onAdd, onEdit, onDelete }: ProductListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const Icon = CategoryIcons[product.category];
          const isLowStock = product.stock <= 10;
          const isOutOfStock = product.stock === 0;
          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon className="h-8 w-8 text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <div className="mt-4 space-y-2">
                <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                  <Ticket className="h-5 w-5 text-amber-600" />
                  {product.price} {product.price === 1 ? 'token' : 'tokens'}
                </p>
                <p className={`text-sm ${
                  isOutOfStock 
                    ? 'text-red-600 font-semibold'
                    : isLowStock 
                      ? 'text-amber-600'
                      : 'text-gray-600'
                }`}>
                  {isOutOfStock 
                    ? 'Out of stock!' 
                    : isLowStock
                      ? `Low stock: ${product.stock} remaining`
                      : `${product.stock} in stock`}
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}