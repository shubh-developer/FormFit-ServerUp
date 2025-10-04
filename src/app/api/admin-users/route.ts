import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { query } from '@/lib/database';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function GET() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15),
        address TEXT,
        photo_url VARCHAR(500),
        pan_card VARCHAR(10),
        aadhar_card VARCHAR(12),
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const result = await query('SELECT id, username, full_name, email, contact_number, address, photo_url, pan_card, aadhar_card, role, is_active, last_login FROM admin_users ORDER BY created_at DESC');
    
    return NextResponse.json({
      success: true,
      admins: result.rows
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      admins: []
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, fullName, email, password, role, contactNumber, address, photoUrl, panCard, aadharCard } = await request.json();

    // Sanitize inputs
    const sanitizedData = {
      username: username?.trim().replace(/[^a-zA-Z0-9_]/g, '').substring(0, 50),
      fullName: fullName?.trim().replace(/<[^>]*>/g, '').substring(0, 100),
      email: email?.trim().toLowerCase().substring(0, 255),
      contactNumber: contactNumber?.replace(/[^0-9+]/g, '').substring(0, 15),
      address: address?.trim().replace(/<[^>]*>/g, '').substring(0, 500),
      photoUrl: photoUrl?.trim().substring(0, 500),
      panCard: panCard?.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10),
      aadharCard: aadharCard?.replace(/[^0-9]/g, '').substring(0, 12),
      role: ['admin', 'master'].includes(role) ? role : 'admin'
    };

    // Validation
    if (!sanitizedData.username || !sanitizedData.fullName || !sanitizedData.email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Required fields missing'
      }, { status: 400 });
    }

    if (sanitizedData.panCard && sanitizedData.panCard.length !== 10) {
      return NextResponse.json({
        success: false,
        message: 'Invalid PAN card format'
      }, { status: 400 });
    }

    if (sanitizedData.aadharCard && sanitizedData.aadharCard.length !== 12) {
      return NextResponse.json({
        success: false,
        message: 'Invalid Aadhar card format'
      }, { status: 400 });
    }

    const hashedPassword = hashPassword(password);

    await query(`
      INSERT INTO admin_users (username, password_hash, email, full_name, contact_number, address, photo_url, pan_card, aadhar_card, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
    `, [sanitizedData.username, hashedPassword, sanitizedData.email, sanitizedData.fullName, sanitizedData.contactNumber, sanitizedData.address, sanitizedData.photoUrl, sanitizedData.panCard, sanitizedData.aadharCard, sanitizedData.role]);

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create admin'
    }, { status: 500 });
  }
}