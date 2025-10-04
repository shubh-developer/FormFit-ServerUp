import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { query } from '@/lib/database';
import { sign } from 'jsonwebtoken';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Table already exists, no need to create

    // Validate credentials against existing master_login table
    const masterResult = await query(
      'SELECT id, username, password_hash, full_name, email, role, is_active FROM master_login WHERE username = $1 AND is_active = true',
      [username]
    );

    if (masterResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
      }, { status: 401 });
    }

    const master = masterResult.rows[0];
    const hashedPassword = hashPassword(password);
    
    // Compare hashed passwords
    if (hashedPassword !== master.password_hash) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
      }, { status: 401 });
    }

    // Update last login
    await query(
      'UPDATE master_login SET last_login = NOW() WHERE id = $1',
      [master.id]
    );

    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars';
    const token = sign(
      {
        userId: master.id,
        username: master.username,
        role: master.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      },
      jwtSecret
    );

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: master.id,
        username: master.username,
        fullName: master.full_name,
        email: master.email,
        role: master.role,
      },
    });

  } catch (error) {
    console.error('Master Login Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}