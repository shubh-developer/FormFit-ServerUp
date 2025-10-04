import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter, generateCSRFToken, validateCSRFToken } from './validation';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Security configuration
const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars-long',
  JWT_EXPIRES_IN: '24h',
  RATE_LIMIT_MAX: 1000, // Increased for development
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:3003',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3003'
  ],
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-in-production'
};

// Rate limiter instance
const rateLimiter = createRateLimiter(SECURITY_CONFIG.RATE_LIMIT_MAX, SECURITY_CONFIG.RATE_LIMIT_WINDOW);

// Security headers middleware
export function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  };
}

// Rate limiting middleware
export function rateLimitMiddleware(request: NextRequest) {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const identifier = `${ip}-${userAgent}`;
  
  if (!rateLimiter(identifier)) {
    console.log(`[SECURITY] Rate limit exceeded for: ${identifier}`);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  
  return null;
}

// CORS middleware
export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Allow requests without origin (same-origin requests)
  if (!origin) {
    return null;
  }
  
  // In development, be more permissive
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  
  if (!SECURITY_CONFIG.CORS_ORIGINS.includes(origin)) {
    console.log(`[SECURITY] CORS violation from origin: ${origin}`);
    return NextResponse.json(
      { error: 'CORS policy violation' },
      { status: 403 }
    );
  }
  
  return null;
}

// Input validation middleware
export function validateInput(data: any, schema: any) {
  try {
    const result = schema.safeParse(data);
    if (!result.success) {
      return {
        valid: false,
        errors: result.error.errors.map((err: any) => err.message)
      };
    }
    return { valid: true, data: result.data };
  } catch (error) {
    return {
      valid: false,
      errors: ['Input validation failed']
    };
  }
}

// JWT token generation
export function generateJWT(payload: any): string {
  return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
    expiresIn: '24h'
  });
}

// JWT token verification
export function verifyJWT(token: string): any {
  try {
    return jwt.verify(token, SECURITY_CONFIG.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Password verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// SQL injection prevention
export function sanitizeSQL(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove common SQL injection patterns
  const dangerousPatterns = [
    /union\s+select/gi,
    /drop\s+table/gi,
    /insert\s+into/gi,
    /delete\s+from/gi,
    /update\s+set/gi,
    /alter\s+table/gi,
    /create\s+table/gi,
    /exec\s*\(/gi,
    /xp_cmdshell/gi,
    /sp_executesql/gi
  ];
  
  let sanitized = input;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized.trim();
}

// XSS prevention
export function preventXSS(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '');
}

// Request logging for security monitoring
export function logSecurityEvent(event: string, details: any) {
  const timestamp = new Date().toISOString();
  console.log(`[SECURITY] ${timestamp} - ${event}:`, JSON.stringify(details));
  
  // In production, you would send this to a security monitoring service
  // Example: sendToSecurityService({ timestamp, event, details });
}

// Admin authentication middleware
export function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = verifyJWT(token);
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    return decoded;
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

// Comprehensive security middleware
export function securityMiddleware(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimitMiddleware(request);
  if (rateLimitResult) return rateLimitResult;
  
  // CORS check
  const corsResult = corsMiddleware(request);
  if (corsResult) return corsResult;
  
  // Log security events
  logSecurityEvent('request', {
    method: request.method,
    url: request.url,
    ip: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent')
  });
  
  return null;
} 