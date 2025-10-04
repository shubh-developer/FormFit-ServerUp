'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminSession } from '@/lib/adminAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = adminSession.isAuthenticated();
      setIsAuthenticated(isAuth);
      setIsLoading(false);
      
      if (!isAuth) {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}