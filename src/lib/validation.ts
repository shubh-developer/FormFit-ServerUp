import { z } from 'zod';
import { randomBytes } from 'crypto';
import DOMPurify from 'isomorphic-dompurify';

// Enhanced validation schemas with security measures
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number')
  .max(15, 'Phone number too long');

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Please enter a valid email address')
  .max(254, 'Email address too long')
  .refine((email) => {
    // Additional email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, 'Invalid email format');

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
  .refine((name) => {
    // Prevent common attack patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i,
      /vbscript:/i
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(name));
  }, 'Invalid characters in name');

export const addressSchema = z
  .string()
  .trim()
  .min(10, 'Please enter your complete address')
  .max(200, 'Address must be less than 200 characters')
  .refine((address) => {
    // Prevent XSS and injection attacks
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i,
      /vbscript:/i,
      /union\s+select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /delete\s+from/i
    ];
    return !dangerousPatterns.some(pattern => pattern.test(address));
  }, 'Invalid characters in address');

// Validation functions
export const validatePhone = (phone: string): boolean => {
  return phoneSchema.safeParse(phone).success;
};

export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validateName = (name: string): boolean => {
  return nameSchema.safeParse(name).success;
};

export const validateAddress = (address: string): boolean => {
  return addressSchema.safeParse(address).success;
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// Enhanced sanitization functions
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Use DOMPurify for comprehensive sanitization
  const sanitized = DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
  
  // Additional manual sanitization
  return sanitized
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '');
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier);
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (userRequests.count >= maxRequests) {
      return false;
    }
    
    userRequests.count++;
    return true;
  };
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  return randomBytes(32).toString('hex');
};

// Validate CSRF token
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length === 64;
}; 