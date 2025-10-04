'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminSession } from '@/lib/adminAuth';
import LoadingSpinner from './LoadingSpinner';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = adminSession.isAuthenticated();
        
        if (!authenticated) {
          // Redirect to admin login
          router.push('/admin/login');
          return;
        }

        // Verify token with server
        const token = adminSession.getToken();
        if (token) {
          const response = await fetch('/api/admin/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            // Token is invalid, clear session and redirect
            adminSession.removeToken();
            router.push('/admin/login');
            return;
          }
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        adminSession.removeToken();
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    adminSession.removeToken();
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Verifying admin access..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Secure Area
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {adminSession.getUser()?.username || 'Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Security Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>🔒 Secure Admin Area - All activities are logged and monitored</p>
            <p className="mt-1">© 2024 Massage Home Service - Admin Panel</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 