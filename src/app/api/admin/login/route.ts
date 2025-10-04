import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto';
import { query } from '@/lib/database';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

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
    const validatedData = loginSchema.parse(body);
    
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    if (!checkLoginRateLimit(`admin_login_${clientIP}`, 5, 300000)) {
      console.log(`[SECURITY] Admin login rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json({
        success: false,
        message: 'Too many login attempts. Please try again later.',
      }, { status: 429 });
    }

    // Fallback authentication (database not available)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (validatedData.username !== adminUsername || validatedData.password !== adminPassword) {
      console.log(`[SECURITY] Failed admin login attempt - Username: ${validatedData.username}, IP: ${clientIP}`);
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
      }, { status: 401 });
    }

    const admin = {
      id: 1,
      username: adminUsername,
      full_name: 'Administrator',
      email: 'admin@formafit.com',
      role: 'admin'
    };

    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars';
    const token = sign(
      {
        userId: admin.id,
        username: admin.username,
        role: admin.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      },
      jwtSecret
    );

    console.log(`[SECURITY] Successful admin login - Username: ${admin.username}, IP: ${clientIP}`);

    try {
      await query(`
        INSERT INTO admin_sessions (username, ip_address, user_agent, login_time)
        VALUES ($1, $2, $3, NOW())
      `, [admin.username, clientIP, userAgent]);
    } catch (dbError) {
      console.error('Failed to log admin session:', dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        fullName: admin.full_name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('Admin Login API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}