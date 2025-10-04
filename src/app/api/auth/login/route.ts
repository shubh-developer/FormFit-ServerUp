import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto';
import { query } from '@/lib/database';
import { SessionManager } from '@/lib/session';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// In-memory rate limiting for user login attempts
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkLoginRateLimit(identifier: string, limit: number = 5, windowMs: number = 300000): boolean {
  const now = Date.now();
  const record = loginAttempts.get(identifier);
  
  if (!record || now > record.resetTime) {
    loginAttempts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = loginSchema.parse(body);
    
    // Get client information for security logging
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Rate limiting for user login attempts
    if (!checkLoginRateLimit(`user_login_${clientIP}`, 5, 300000)) { // 5 attempts per 5 minutes
      console.log(`[SECURITY] User login rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json({
        success: false,
        message: 'Too many login attempts. Please try again later.',
      }, { status: 429 });
    }

    // Find user by email
    const userResult = await query(
      'SELECT id, name, email, phone, password_hash FROM users WHERE email = $1',
      [validatedData.email]
    );

    if (userResult.rows.length === 0) {
      // Log failed login attempt
      console.log(`[SECURITY] Failed user login attempt - Email: ${validatedData.email}, IP: ${clientIP}, User-Agent: ${userAgent}`);
      
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password',
      }, { status: 401 });
    }

    const user = userResult.rows[0];
    
    // Hash the provided password for comparison
    const hashedPassword = hashPassword(validatedData.password);
    
    // Validate password
    if (user.password_hash !== hashedPassword) {
      // Log failed login attempt
      console.log(`[SECURITY] Failed user login attempt - Email: ${validatedData.email}, IP: ${clientIP}, User-Agent: ${userAgent}`);
      
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password',
      }, { status: 401 });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars';
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: 'client',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      },
      jwtSecret
    );

    // Create user session
    const sessionId = SessionManager.createSession(user.id.toString(), 'client', token);

    // Log successful login
    console.log(`[SECURITY] Successful user login - Email: ${validatedData.email}, IP: ${clientIP}, User-Agent: ${userAgent}`);

    // Create user session record in database (optional)
    try {
      await query(`
        INSERT INTO user_sessions (user_id, ip_address, user_agent, login_time)
        VALUES ($1, $2, $3, NOW())
      `, [user.id, clientIP, userAgent]);
    } catch (dbError) {
      console.error('Failed to log user session:', dbError);
      // Don't fail login if session logging fails
    }

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'client',
      },
    });

    // Set session cookie
    return SessionManager.setSessionCookie(response, sessionId, 'client');

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('User Login API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}

