import { verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface User {
  userId: string;
  email: string;
  role: 'client';
  iat: number;
  exp: number;
}

export function verifyUserToken(token: string): User | null {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars';
    const decoded = verify(token, jwtSecret) as User;
    
    // Check if token is expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    // Check if user has client role
    if (decoded.role !== 'client') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('User token verification failed:', error);
    return null;
  }
}

export function getUserTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check session-based authentication
  const { SessionManager } = require('./session');
  const sessionId = SessionManager.getSessionId(request, 'client');
  if (sessionId) {
    const session = SessionManager.getSession(sessionId);
    if (session && session.userType === 'client') {
      return session.token;
    }
  }
  
  return null;
}

export function isUserAuthenticated(request: NextRequest): boolean {
  const token = getUserTokenFromRequest(request);
  if (!token) {
    return false;
  }
  
  const user = verifyUserToken(token);
  return user !== null;
}

export function getUser(request: NextRequest): User | null {
  const token = getUserTokenFromRequest(request);
  if (!token) {
    return null;
  }
  
  return verifyUserToken(token);
}

// Client-side user session management
export const userSession = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('clientToken');
  },
  
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('clientToken', token);
  },
  
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientSession');
  },
  
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('clientToken');
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
    const session = localStorage.getItem('clientSession');
    return session ? JSON.parse(session) : null;
  },
  
  setUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('clientSession', JSON.stringify(user));
  }
};
