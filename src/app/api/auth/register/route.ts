import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'crypto';
import { query } from '@/lib/database';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number is too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ),
  address: z.string().optional(),
  dateOfBirth: z.string().optional().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 16 && age <= 120;
  }, 'You must be at least 16 years old'),
  emergencyContact: z.string().optional(),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
});

// In-memory rate limiting for user registration attempts
const registrationAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRegistrationRateLimit(identifier: string, limit: number = 3, windowMs: number = 300000): boolean {
  const now = Date.now();
  const record = registrationAttempts.get(identifier);
  
  if (!record || now > record.resetTime) {
    registrationAttempts.set(identifier, { count: 1, resetTime: now + windowMs });
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
    const validatedData = registerSchema.parse(body);
    
    // Get client information for security logging
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Rate limiting for user registration attempts
    if (!checkRegistrationRateLimit(`user_registration_${clientIP}`, 3, 300000)) { // 3 attempts per 5 minutes
      console.log(`[SECURITY] User registration rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json({
        success: false,
        message: 'Too many registration attempts. Please try again later.',
      }, { status: 429 });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [validatedData.email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists',
      }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = hashPassword(validatedData.password);
    
    // Create user account with all profile information
    const result = await query(`
      INSERT INTO users (
        name, email, phone, password_hash, address, date_of_birth, 
        emergency_contact, medical_conditions, allergies, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING id, name, email, phone, address, date_of_birth, 
                emergency_contact, medical_conditions, allergies, created_at
    `, [
      validatedData.name,
      validatedData.email,
      validatedData.phone,
      hashedPassword,
      validatedData.address || null,
      validatedData.dateOfBirth || null,
      validatedData.emergencyContact || null,
      validatedData.medicalConditions || null,
      validatedData.allergies || null
    ]);

    const newUser = result.rows[0];

    // Log successful registration
    console.log(`[SECURITY] Successful user registration - Email: ${validatedData.email}, IP: ${clientIP}, User-Agent: ${userAgent}`);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        dateOfBirth: newUser.date_of_birth,
        emergencyContact: newUser.emergency_contact,
        medicalConditions: newUser.medical_conditions,
        allergies: newUser.allergies,
        created_at: newUser.created_at,
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

    console.error('User Registration API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}
