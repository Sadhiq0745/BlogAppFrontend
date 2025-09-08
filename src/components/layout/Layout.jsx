import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import { useAuthStore } from '../../store/useAuthStore';

const Layout = () => {
  const { initializeAuth } = useAuthStore();

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '16px',
            fontSize: '14px',
            maxWidth: '400px'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            },
            style: {
              borderLeft: '4px solid #10b981'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            },
            style: {
              borderLeft: '4px solid #ef4444'
            }
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff'
            },
            style: {
              borderLeft: '4px solid #3b82f6'
            }
          }
        }}
      />
    </div>
  );
};

export default Layout;