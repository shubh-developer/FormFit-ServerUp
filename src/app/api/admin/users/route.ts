import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { verifyAdminToken, getAdminTokenFromRequest } from '@/lib/adminAuth';

// GET - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getAdminTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Admin authentication required',
      }, { status: 401 });
    }

    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired admin token',
      }, { status: 401 });
    }

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // Build query conditions
    const whereConditions = [];
    const queryParams = [];
    let paramCount = 1;

    if (search) {
      whereConditions.push(`(name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR phone ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    if (status) {
      if (status === 'active') {
        whereConditions.push(`is_active = $${paramCount}`);
        queryParams.push(true);
        paramCount++;
      } else if (status === 'inactive') {
        whereConditions.push(`is_active = $${paramCount}`);
        queryParams.push(false);
        paramCount++;
      } else if (status === 'verified') {
        whereConditions.push(`email_verified = $${paramCount}`);
        queryParams.push(true);
        paramCount++;
      } else if (status === 'unverified') {
        whereConditions.push(`email_verified = $${paramCount}`);
        queryParams.push(false);
        paramCount++;
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
    `, queryParams);

    const total = parseInt(countResult.rows[0].total);

    // Get users with pagination
    const usersResult = await query(`
      SELECT id, name, email, phone, address, date_of_birth, emergency_contact, 
             medical_conditions, allergies, is_active, email_verified, 
             created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...queryParams, limit, offset]);

    const users = usersResult.rows.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      dateOfBirth: user.date_of_birth,
      emergencyContact: user.emergency_contact,
      medicalConditions: user.medical_conditions,
      allergies: user.allergies,
      isActive: user.is_active,
      emailVerified: user.email_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Get Users API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}

// PUT - Update user status (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getAdminTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Admin authentication required',
      }, { status: 401 });
    }

    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired admin token',
      }, { status: 401 });
    }

    const body = await request.json();
    const { userId, isActive, emailVerified } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required',
      }, { status: 400 });
    }

    // Update user status
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (typeof isActive === 'boolean') {
      updateFields.push(`is_active = $${paramCount}`);
      updateValues.push(isActive);
      paramCount++;
    }

    if (typeof emailVerified === 'boolean') {
      updateFields.push(`email_verified = $${paramCount}`);
      updateValues.push(emailVerified);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No fields to update',
      }, { status: 400 });
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(userId);

    const updateResult = await query(`
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, is_active, email_verified, updated_at
    `, updateValues);

    if (updateResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    const updatedUser = updateResult.rows[0];

    return NextResponse.json({
      success: true,
      message: 'User status updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isActive: updatedUser.is_active,
        emailVerified: updatedUser.email_verified,
        updatedAt: updatedUser.updated_at,
      },
    });

  } catch (error) {
    console.error('Update User API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}

