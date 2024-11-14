import React, { useState, useEffect, useRef } from 'react';
import { Ticket } from 'lucide-react';
import { Order } from '../../types';
import { Toast } from '../Toast';
import { formatRelativeTime } from '../../utils/dateFormatter';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
}

export function OrderList({ orders, onUpdateStatus }: OrderListProps) {
  const [showToast, setShowToast] = useState(false);
  const previousOrderIdsRef = useRef<Set<string>>(new Set());

  // Filter out paid orders and sort by creation date (oldest first)
  const activeOrders = orders
    .filter(order => order.status !== 'PAID')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  useEffect(() => {
    const currentOrderIds = new Set(activeOrders.map(order => order.id));
    const hasNewOrders = activeOrders.some(
      order => !previousOrderIdsRef.current.has(order.id)
    );

    if (hasNewOrders && previousOrderIdsRef.current.size > 0) {
      setShowToast(true);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(console.error);
    }

    previousOrderIdsRef.current = currentOrderIds;
  }, [activeOrders]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING': return 'bg-blue-100 text-blue-800';
      case 'READY': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {showToast && (
        <Toast
          message="New order received!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      {activeOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No active orders at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Table {order.table?.number}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatRelativeTime(order.created_at)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.product.name} x {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Ticket className="h-4 w-4" />
                          {item.product.price} {item.product.price === 1 ? 'token' : 'tokens'} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      <Ticket className="h-4 w-4" />
                      {order.total} {order.total === 1 ? 'token' : 'tokens'}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'PREPARING')}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'READY')}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'READY' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'PAID')}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Mark Collected
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}