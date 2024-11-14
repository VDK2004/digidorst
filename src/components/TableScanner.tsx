import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QrCode, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

const isValidTableId = (tableId: string | null): boolean => {
  if (!tableId) return false;
  // Assuming table IDs are numbers between 1-50
  const numericId = parseInt(tableId, 10);
  return !isNaN(numericId) && numericId > 0 && numericId <= 50;
};

export function TableScanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setTableId = useStore((state) => state.setTableId);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const tableId = searchParams.get('table');
    
    if (tableId) {
      if (isValidTableId(tableId)) {
        setTableId(tableId);
        navigate(`/table/${tableId}`);
      } else {
        setError('Invalid table number. Please scan a valid QR code.');
      }
    }
  }, [searchParams, navigate, setTableId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      {error ? (
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <QrCode className="w-24 h-24 text-gray-400" />
          <h2 className="text-2xl font-semibold text-gray-900">Scan QR Code</h2>
          <p className="text-gray-600 text-center max-w-md">
            Scan the QR code at your table to start ordering drinks. Each table has a unique QR code that will direct you to your table's menu.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Example QR URL: https://your-domain.com?table=12
          </div>
        </>
      )}
    </div>
  );
}