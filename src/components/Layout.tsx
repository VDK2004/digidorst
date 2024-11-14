import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { useStore } from '../store/useStore';

function CartPreview({ onClose }: { onClose: () => void }) {
  const { cart, updateQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center text-primary-light/60">Your cart is empty</div>
    );
  }

  const handleCheckoutClick = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex-1">
              <h4 className="font-medium text-primary">{item.product.name}</h4>
              <p className="text-sm text-primary-light/70">
                {item.product.price} token(s) each
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(
                    item.product.id,
                    Math.max(0, item.quantity - 1)
                  )
                }
                className="p-1 hover:bg-secondary-light/20 rounded"
              >
                <Minus className="h-4 w-4 text-primary" />
              </button>
              <span className="w-8 text-center text-primary">{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
                className="p-1 hover:bg-secondary-light/20 rounded"
              >
                <Plus className="h-4 w-4 text-primary" />
              </button>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-secondary-dark/10 pt-4">
        <div className="flex justify-between font-medium mb-4 text-primary">
          <span>Total:</span>
          <span>{total} token(s)</span>
        </div>
        <button
          onClick={handleCheckoutClick}
          className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          View Cart & Checkout
        </button>
      </div>
    </div>
  );
}

export function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cart = useStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-secondary-light/10">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.svg" alt="DigiDorst Logo" className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-primary">DrinkEasy</h1>
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 hover:bg-secondary-light/20 rounded-full transition-colors"
              >
                <ShoppingCart className="h-6 w-6 text-primary" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              {isCartOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCartOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 border border-secondary-dark/10">
                    <CartPreview onClose={() => setIsCartOpen(false)} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}