// Security Configuration
export const SECURITY_CONFIG = {
  // JWT Configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars',
    EXPIRES_IN: '24h',
    ISSUER: 'massage-home-service',
    AUDIENCE: 'massage-home-service-users'
  },
  
  // Session Configuration
  SESSION: {
    SECRET: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-in-production',
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
    HTTP_ONLY: true,
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'strict' as const
  },
  
  // Rate Limiting
  RATE_LIMIT: {
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    SKIP_SUCCESSFUL_REQUESTS: false,
    SKIP_FAILED_REQUESTS: false
  },
  
  // CORS Configuration
  CORS: {
    ORIGINS: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://yourdomain.com'
    ],
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
    CREDENTIALS: true
  },
  
  // Security Headers
  HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': process.env.NODE_ENV === 'production' 
      ? "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
      : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  },
  
  // Password Policy
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    SALT_ROUNDS: 12
  },
  
  // Input Validation
  VALIDATION: {
    MAX_NAME_LENGTH: 50,
    MAX_EMAIL_LENGTH: 254,
    MAX_PHONE_LENGTH: 15,
    MAX_ADDRESS_LENGTH: 200,
    MAX_MESSAGE_LENGTH: 1000
  },
  
  // Logging
  LOGGING: {
    LEVEL: process.env.LOG_LEVEL || 'info',
    SECURITY_ENABLED: process.env.SECURITY_LOGGING_ENABLED === 'true',
    MAX_LOG_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_LOG_FILES: 5
  },
  
  // Environment
  ENV: {
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_TEST: process.env.NODE_ENV === 'test'
  }
};

// Admin Configuration
export const ADMIN_CONFIG = {
  EMAIL: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
  PASSWORD: process.env.ADMIN_PASSWORD || 'change-this-in-production',
  ROLE: 'admin',
  PERMISSIONS: ['read', 'write', 'delete', 'admin']
};

// Database Security Configuration
export const DB_SECURITY_CONFIG = {
  CONNECTION_LIMIT: 20,
  IDLE_TIMEOUT: 30000,
  CONNECTION_TIMEOUT: 2000,
  MAX_USES: 7500,
  SSL: process.env.NODE_ENV === 'production',
  SSL_REJECT_UNAUTHORIZED: process.env.NODE_ENV === 'production'
};

// API Security Configuration
export const API_SECURITY_CONFIG = {
  MAX_REQUEST_SIZE: '10mb',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  CACHE_CONTROL: 'no-cache, no-store, must-revalidate',
  PRAGMA: 'no-cache',
  EXPIRES: '0'
}; 