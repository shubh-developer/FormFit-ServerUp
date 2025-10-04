// Session Management System
import { NextRequest, NextResponse } from 'next/server';

// Session configuration
const SESSION_CONFIG = {
  ADMIN_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  CLIENT_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// In-memory session store - using global to persist across requests
declare global {
  var __sessionStore: Map<string, {
    userId: string;
    userType: 'admin' | 'client';
    token: string;
    expiresAt: number;
    lastActivity: number;
  }> | undefined;
}

const sessionStore = globalThis.__sessionStore || new Map<string, {
  userId: string;
  userType: 'admin' | 'client';
  token: string;
  expiresAt: number;
  lastActivity: number;
}>();

if (!globalThis.__sessionStore) {
  globalThis.__sessionStore = sessionStore;
  console.log(`[SESSION] Initialized global session store`);
} else {
  console.log(`[SESSION] Using existing global session store with ${sessionStore.size} sessions`);
}

// Session cleanup every hour
setInterval(() => {
  const now = Date.now();
  const expiredSessions: string[] = [];
  
  for (const [sessionId, session] of sessionStore.entries()) {
    if (session.expiresAt < now) {
      expiredSessions.push(sessionId);
    }
  }
  
  // Batch delete expired sessions for better performance
  expiredSessions.forEach(sessionId => {
    sessionStore.delete(sessionId);
    sessionPerformance.recordSessionExpired();
  });
  
  if (expiredSessions.length > 0) {
    console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
  }
}, 60 * 60 * 1000);

export class SessionManager {
  // Create session
  static createSession(userId: string, userType: 'admin' | 'client', token: string): string {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = Date.now() + (
      userType === 'admin' ? SESSION_CONFIG.ADMIN_TOKEN_EXPIRY : SESSION_CONFIG.CLIENT_TOKEN_EXPIRY
    );

    const sessionData = {
      userId,
      userType,
      token,
      expiresAt,
      lastActivity: Date.now(),
    };
    
    sessionStore.set(sessionId, sessionData);
    console.log(`[SESSION] Created session for ${userType}:`, { sessionId, userId });
    console.log(`[SESSION] Session store size after creation: ${sessionStore.size}`);
    console.log(`[SESSION] Session store keys after creation:`, Array.from(sessionStore.keys()));
    console.log(`[SESSION] Session data stored:`, sessionData);
    
    // Record session creation for performance monitoring
    sessionPerformance.recordSessionCreated();

    return sessionId;
  }

  // Get session
  static getSession(sessionId: string) {
    console.log(`[SESSION] Getting session: ${sessionId}`);
    console.log(`[SESSION] Session store size: ${sessionStore.size}`);
    console.log(`[SESSION] Session store keys:`, Array.from(sessionStore.keys()));
    
    const session = sessionStore.get(sessionId);
    console.log(`[SESSION] Found session:`, session);
    
    if (!session) {
      console.log(`[SESSION] Session not found in store`);
      return null;
    }
    
    if (session.expiresAt < Date.now()) {
      console.log(`[SESSION] Session expired. Expires at: ${new Date(session.expiresAt)}, Now: ${new Date()}`);
      sessionStore.delete(sessionId);
      return null;
    }
    
    session.lastActivity = Date.now();
    console.log(`[SESSION] Returning valid session`);
    return session;
  }

  // Remove session
  static removeSession(sessionId: string): boolean {
    return sessionStore.delete(sessionId);
  }

  // Set session cookie
  static setSessionCookie(response: NextResponse, sessionId: string, userType: 'admin' | 'client'): NextResponse {
    const cookieName = userType === 'admin' ? 'adminSessionId' : 'clientSessionId';
    const maxAge = userType === 'admin' 
      ? SESSION_CONFIG.ADMIN_TOKEN_EXPIRY / 1000
      : SESSION_CONFIG.CLIENT_TOKEN_EXPIRY / 1000;

    console.log(`[SESSION] Setting cookie for ${userType}:`, { cookieName, sessionId, maxAge });

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
  static clearSessionCookie(response: NextResponse, userType: 'admin' | 'client'): NextResponse {
    const cookieName = userType === 'admin' ? 'adminSessionId' : 'clientSessionId';
    response.cookies.delete(cookieName);
    return response;
  }

  // Validate session
  static validateSession(request: NextRequest, userType: 'admin' | 'client'): boolean {
    const sessionId = this.getSessionId(request, userType);
    console.log(`[SESSION] Session ID for ${userType}:`, sessionId);
    
    if (!sessionId) {
      console.log(`[SESSION] No session ID found for ${userType}`);
      return false;
    }

    const session = this.getSession(sessionId);
    console.log(`[SESSION] Session data for ${userType}:`, session);
    
    if (!session || session.userType !== userType) {
      console.log(`[SESSION] Invalid session for ${userType}:`, { session, userType });
      return false;
    }

    console.log(`[SESSION] Valid session for ${userType}`);
    return true;
  }
}

// Client-side session management
export const clientSession = {
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

  clearSession: (userType: 'admin' | 'client'): void => {
    if (typeof window === 'undefined') return;
    
    const key = `${userType}Session`;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear session data:', error);
    }
  },

  hasValidSession: (userType: 'admin' | 'client'): boolean => {
    const session = clientSession.getSession(userType);
    return session !== null;
  },

  getToken: (userType: 'admin' | 'client'): string | null => {
    const session = clientSession.getSession(userType);
    return session?.token || null;
  },
};

// Session performance monitoring
export const sessionPerformance = {
  activeSessions: 0,
  totalSessions: 0,
  expiredSessions: 0,
  
  recordSessionCreated() {
    this.totalSessions++;
    this.activeSessions++;
  },
  
  recordSessionExpired() {
    this.expiredSessions++;
    this.activeSessions = Math.max(0, this.activeSessions - 1);
  },
  
  getStats() {
    return {
      activeSessions: this.activeSessions,
      totalSessions: this.totalSessions,
      expiredSessions: this.expiredSessions,
      sessionStoreSize: sessionStore.size,
    };
  },
  
  reset() {
    this.activeSessions = 0;
    this.totalSessions = 0;
    this.expiredSessions = 0;
  }
}; 