// Comprehensive Session Management System
import { NextRequest, NextResponse } from 'next/server';

// Session configuration
const SESSION_CONFIG = {
  ADMIN_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  CLIENT_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days
  SESSION_CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour
};

// In-memory session store (for server-side)
const sessionStore = new Map<string, {
  userId: string;
  userType: 'admin' | 'client';
  token: string;
  refreshToken: string;
  expiresAt: number;
  lastActivity: number;
  ipAddress: string;
  userAgent: string;
}>();

// Session cleanup
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessionStore.entries()) {
    if (session.expiresAt < now) {
      sessionStore.delete(sessionId);
    }
  }
}, SESSION_CONFIG.SESSION_CLEANUP_INTERVAL);

export class SessionManager {
  // Create a new session
  static createSession(
    userId: string,
    userType: 'admin' | 'client',
    token: string,
    refreshToken: string,
    request: NextRequest
  ): string {
    const sessionId = this.generateSessionId();
    const expiresAt = Date.now() + (
      userType === 'admin' 
        ? SESSION_CONFIG.ADMIN_TOKEN_EXPIRY 
        : SESSION_CONFIG.CLIENT_TOKEN_EXPIRY
    );

    sessionStore.set(sessionId, {
      userId,
      userType,
      token,
      refreshToken,
      expiresAt,
      lastActivity: Date.now(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return sessionId;
  }

  // Get session by ID
  static getSession(sessionId: string) {
    const session = sessionStore.get(sessionId);
    if (!session || session.expiresAt < Date.now()) {
      sessionStore.delete(sessionId);
      return null;
    }
    
    // Update last activity
    session.lastActivity = Date.now();
    return session;
  }

  // Get session by token
  static getSessionByToken(token: string) {
    for (const [sessionId, session] of sessionStore.entries()) {
      if (session.token === token && session.expiresAt > Date.now()) {
        session.lastActivity = Date.now();
        return { sessionId, session };
      }
    }
    return null;
  }

  // Remove session
  static removeSession(sessionId: string): boolean {
    return sessionStore.delete(sessionId);
  }

  // Remove all sessions for a user
  static removeUserSessions(userId: string, userType: 'admin' | 'client'): number {
    let removedCount = 0;
    for (const [sessionId, session] of sessionStore.entries()) {
      if (session.userId === userId && session.userType === userType) {
        sessionStore.delete(sessionId);
        removedCount++;
      }
    }
    return removedCount;
  }

  // Generate unique session ID
  private static generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Set session cookie
  static setSessionCookie(
    response: NextResponse,
    sessionId: string,
    userType: 'admin' | 'client'
  ): NextResponse {
    const cookieName = userType === 'admin' ? 'adminSessionId' : 'clientSessionId';
    const maxAge = userType === 'admin' 
      ? SESSION_CONFIG.ADMIN_TOKEN_EXPIRY / 1000
      : SESSION_CONFIG.CLIENT_TOKEN_EXPIRY / 1000;

    response.cookies.set(cookieName, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return response;
  }

  // Get session ID from request
  static getSessionId(request: NextRequest, userType: 'admin' | 'client'): string | null {
    const cookieName = userType === 'admin' ? 'adminSessionId' : 'clientSessionId';
    return request.cookies.get(cookieName)?.value || null;
  }

  // Clear session cookie
  static clearSessionCookie(
    response: NextResponse,
    userType: 'admin' | 'client'
  ): NextResponse {
    const cookieName = userType === 'admin' ? 'adminSessionId' : 'clientSessionId';
    response.cookies.delete(cookieName);
    return response;
  }

  // Validate session
  static validateSession(request: NextRequest, userType: 'admin' | 'client'): boolean {
    const sessionId = this.getSessionId(request, userType);
    if (!sessionId) return false;

    const session = this.getSession(sessionId);
    if (!session) return false;

    // Check if session matches user type
    if (session.userType !== userType) return false;

    // Check IP address (optional security measure)
    const currentIP = request.headers.get('x-forwarded-for') || 'unknown';
    if (session.ipAddress !== currentIP) {
      console.warn(`Session IP mismatch: ${session.ipAddress} vs ${currentIP}`);
      // Don't invalidate for IP changes in development
      if (process.env.NODE_ENV === 'production') {
        return false;
      }
    }

    return true;
  }

  // Get session statistics
  static getSessionStats() {
    const stats = {
      totalSessions: sessionStore.size,
      adminSessions: 0,
      clientSessions: 0,
      expiredSessions: 0,
    };

    const now = Date.now();
    for (const session of sessionStore.values()) {
      if (session.userType === 'admin') {
        stats.adminSessions++;
      } else {
        stats.clientSessions++;
      }
      
      if (session.expiresAt < now) {
        stats.expiredSessions++;
      }
    }

    return stats;
  }
}

// Client-side session management
export const clientSession = {
  // Store session data in localStorage
  setSession: (userType: 'admin' | 'client', data: any): void => {
    if (typeof window === 'undefined') return;
    
    const key = `${userType}Session`;
    const sessionData = {
      ...data,
      timestamp: Date.now(),
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to store session data:', error);
    }
  },

  // Get session data from localStorage
  getSession: (userType: 'admin' | 'client'): any => {
    if (typeof window === 'undefined') return null;
    
    const key = `${userType}Session`;
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const sessionData = JSON.parse(data);
      const maxAge = userType === 'admin' 
        ? SESSION_CONFIG.ADMIN_TOKEN_EXPIRY 
        : SESSION_CONFIG.CLIENT_TOKEN_EXPIRY;
      
      // Check if session is expired
      if (Date.now() - sessionData.timestamp > maxAge) {
        localStorage.removeItem(key);
        return null;
      }
      
      return sessionData;
    } catch (error) {
      console.warn('Failed to retrieve session data:', error);
      return null;
    }
  },

  // Clear session data
  clearSession: (userType: 'admin' | 'client'): void => {
    if (typeof window === 'undefined') return;
    
    const key = `${userType}Session`;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear session data:', error);
    }
  },

  // Check if session exists and is valid
  hasValidSession: (userType: 'admin' | 'client'): boolean => {
    const session = clientSession.getSession(userType);
    return session !== null;
  },

  // Get token from session
  getToken: (userType: 'admin' | 'client'): string | null => {
    const session = clientSession.getSession(userType);
    return session?.token || null;
  },
};

// Cache management with session awareness
export class SessionAwareCache {
  private cache = new Map<string, {
    data: any;
    timestamp: number;
    ttl: number;
    sessionId?: string;
  }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000, sessionId?: string) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      sessionId,
    });
  }

  get(key: string, sessionId?: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Check session-specific cache
    if (sessionId && item.sessionId && item.sessionId !== sessionId) {
      return null;
    }

    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear(sessionId?: string) {
    if (sessionId) {
      // Clear only session-specific cache
      for (const [key, item] of this.cache.entries()) {
        if (item.sessionId === sessionId) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const sessionCache = new SessionAwareCache();

// Clean up cache periodically
setInterval(() => {
  sessionCache.cleanup();
}, 5 * 60 * 1000); // Every 5 minutes 