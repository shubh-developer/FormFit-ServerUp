import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { query } from '@/lib/database';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, email, fullName } = await request.json();

    if (!username || !password || !email || !fullName) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required',
      }, { status: 400 });
    }

    // Create table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if admin already exists
    const existingAdmin = await query(
      'SELECT id FROM admin_users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingAdmin.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
      }, { status: 400 });
    }

    // Create admin user
    const hashedPassword = hashPassword(password);
    
    await query(`
      INSERT INTO admin_users (username, password_hash, email, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, 'master', true)
    `, [username, hashedPassword, email, fullName]);

    return NextResponse.json({
      success: true,
      message: 'Master admin created successfully',
    });

  } catch (error) {
    console.error('Create master admin error:', error);
    
    // Check if it's a database connection error
    if (error instanceof Error && (error.message?.includes('connect') || (error as any).code === 'ECONNREFUSED')) {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed. Please check if PostgreSQL is running.',
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: false,
      message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }, { status: 500 });
  }
}