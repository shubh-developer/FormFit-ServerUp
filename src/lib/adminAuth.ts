import { verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AdminUser {
  username: string;
  role: 'admin';
  iat: number;
  exp: number;
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars';
    const decoded = verify(token, jwtSecret) as AdminUser;
    
    // Check if token is expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    // Check if user has admin role
    if (decoded.role !== 'admin') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookies
  const tokenCookie = request.cookies.get('adminToken');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = getAdminTokenFromRequest(request);
  if (!token) {
    return false;
  }
  
  const adminUser = verifyAdminToken(token);
  return adminUser !== null;
}

export function getAdminUser(request: NextRequest): AdminUser | null {
  const token = getAdminTokenFromRequest(request);
  if (!token) {
    return null;
  }
  
  return verifyAdminToken(token);
}

// Client-side admin session management
export const adminSession = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('adminToken');
  },
  
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('adminToken', token);
  },
  
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminSession');
  },
  
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('adminToken');
    if (!token) return false;
    
    try {
      // Basic token validation (expiration check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  },
  
  getUser: (): any => {
    if (typeof window === 'undefined') return null;
    const session = localStorage.getItem('adminSession');
    return session ? JSON.parse(session) : null;
  },
  
  setUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('adminSession', JSON.stringify(user));
  }
}; 