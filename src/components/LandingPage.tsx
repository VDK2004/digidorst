import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Clock, CreditCard } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    const isAuthenticated =
      localStorage.getItem('adminAuthenticated') === 'true';
    navigate(isAuthenticated ? '/admin' : '/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-light/20 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <img src="/logo.svg" alt="DigiDorst Logo" className="h-24 w-24 mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
          Welcome to DigiDorst
        </h1>
        <p className="text-xl text-primary-light/80 max-w-2xl mx-auto mb-8">
          Order your drinks with ease using our digital token system. No cash
          needed!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleAdminClick}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
          >
            Admin Dashboard
          </button>
          <Link
            to="/scan"
            className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-white hover:bg-secondary-light/20"
          >
            Scan Table QR
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <QrCode className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">
              Easy Ordering
            </h3>
            <p className="text-primary-light/80">
              Simply scan your table's QR code to start ordering drinks
              instantly
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Clock className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">
              Real-time Updates
            </h3>
            <p className="text-primary-light/80">
              Track your order status in real-time from preparation to delivery
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <CreditCard className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">
              Token System
            </h3>
            <p className="text-primary-light/80">
              Use our convenient token system - no need for cash or cards
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary-light/10 border-t border-secondary-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-primary-light/60 text-sm">
            © {new Date().getFullYear()} DrinkEasy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}