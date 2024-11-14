import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Plus, Minus, Ticket } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Toast } from './Toast';

export function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, submitOrder, loading, error, tableId } = useStore();
  const [showToast, setShowToast] = useState(false);
  
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      await submitOrder();
      setShowToast(true);
      setTimeout(() => {
        navigate(`/table/${tableId}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {showToast && (
        <Toast
          message="Order submitted successfully! Redirecting to menu..."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Menu</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Order</h2>

        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty. Add some drinks to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between py-4 border-b"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    {item.product.price} {item.product.price === 1 ? 'token' : 'tokens'} each
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-lg font-bold items-center">
                <span>Total</span>
                <span className="flex items-center gap-1">
                  <Ticket className="h-5 w-5 text-amber-600" />
                  {total} {total === 1 ? 'token' : 'tokens'}
                </span>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button 
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className={`w-full py-3 ${
                  loading || cart.length === 0
                    ? 'bg-amber-400 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700'
                } text-white rounded-md transition-colors`}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}