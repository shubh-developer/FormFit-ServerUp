import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'crypto';
import { query } from '@/lib/database';
import { verify } from 'jsonwebtoken';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name is too long').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number is too long').optional(),
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
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ).optional(),
});

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

function verifyUserToken(token: string): any {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars';
    const decoded = verify(token, jwtSecret) as any;
    
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
    return null;
  }
}

function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Skip session-based authentication for now to avoid async issues
  return null;
}

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required',
      }, { status: 401 });
    }

    const decoded = verifyUserToken(token);
    if (!decoded) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token',
      }, { status: 401 });
    }

    // Get user profile with all fields
    const userResult = await query(
      `SELECT id, name, email, phone, address, date_of_birth, emergency_contact, 
              medical_conditions, allergies, preferences, is_active, email_verified, 
              created_at, updated_at 
       FROM users WHERE id = $1`,
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Get user's booking history
    const bookingsResult = await query(
      'SELECT id, service_type, oil_type, date_time, status, payment_status, created_at FROM bookings WHERE email = $1 ORDER BY created_at DESC LIMIT 10',
      [user.email]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.date_of_birth,
        emergencyContact: user.emergency_contact,
        medicalConditions: user.medical_conditions,
        allergies: user.allergies,
        preferences: user.preferences,
        isActive: user.is_active,
        emailVerified: user.email_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      recentBookings: bookingsResult.rows,
    });

  } catch (error) {
    console.error('Get Profile API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required',
      }, { status: 401 });
    }

    const decoded = verifyUserToken(token);
    if (!decoded) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token',
      }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Get current user data
    const userResult = await query(
      'SELECT id, name, email, phone, address, date_of_birth, emergency_contact, medical_conditions, allergies, password_hash FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    const currentUser = userResult.rows[0];

    // If changing password, verify current password
    if (validatedData.newPassword) {
      if (!validatedData.currentPassword) {
        return NextResponse.json({
          success: false,
          message: 'Current password is required to change password',
        }, { status: 400 });
      }

      const currentPasswordHash = hashPassword(validatedData.currentPassword);
      if (currentPasswordHash !== currentUser.password_hash) {
        return NextResponse.json({
          success: false,
          message: 'Current password is incorrect',
        }, { status: 400 });
      }
    }

    // Prepare update fields
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (validatedData.name) {
      updateFields.push(`name = $${paramCount}`);
      updateValues.push(validatedData.name);
      paramCount++;
    }

    if (validatedData.phone) {
      updateFields.push(`phone = $${paramCount}`);
      updateValues.push(validatedData.phone);
      paramCount++;
    }

    if (validatedData.address !== undefined) {
      updateFields.push(`address = $${paramCount}`);
      updateValues.push(validatedData.address || null);
      paramCount++;
    }

    if (validatedData.dateOfBirth !== undefined) {
      updateFields.push(`date_of_birth = $${paramCount}`);
      updateValues.push(validatedData.dateOfBirth || null);
      paramCount++;
    }

    if (validatedData.emergencyContact !== undefined) {
      updateFields.push(`emergency_contact = $${paramCount}`);
      updateValues.push(validatedData.emergencyContact || null);
      paramCount++;
    }

    if (validatedData.medicalConditions !== undefined) {
      updateFields.push(`medical_conditions = $${paramCount}`);
      updateValues.push(validatedData.medicalConditions || null);
      paramCount++;
    }

    if (validatedData.allergies !== undefined) {
      updateFields.push(`allergies = $${paramCount}`);
      updateValues.push(validatedData.allergies || null);
      paramCount++;
    }

    if (validatedData.newPassword) {
      updateFields.push(`password_hash = $${paramCount}`);
      updateValues.push(hashPassword(validatedData.newPassword));
      paramCount++;
    }

    if (updateFields.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No fields to update',
      }, { status: 400 });
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(decoded.userId);

    // Update user profile
    const updateResult = await query(`
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, phone, address, date_of_birth, emergency_contact, 
                medical_conditions, allergies, updated_at
    `, updateValues);

    const updatedUser = updateResult.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        dateOfBirth: updatedUser.date_of_birth,
        emergencyContact: updatedUser.emergency_contact,
        medicalConditions: updatedUser.medical_conditions,
        allergies: updatedUser.allergies,
        updated_at: updatedUser.updated_at,
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

    console.error('Update Profile API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}
