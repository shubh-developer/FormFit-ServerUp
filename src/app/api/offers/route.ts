import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        discount VARCHAR(10) NOT NULL,
        code VARCHAR(20) UNIQUE NOT NULL,
        valid_until DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const result = await query('SELECT * FROM offers ORDER BY created_at DESC');
    
    return NextResponse.json({
      success: true,
      offers: result.rows
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      offers: []
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, discount, code, validUntil, status } = await request.json();

    // Sanitize inputs
    const sanitizedData = {
      title: title?.trim().replace(/<[^>]*>/g, '').substring(0, 100),
      discount: discount?.trim().replace(/[^0-9%₹]/g, '').substring(0, 10),
      code: code?.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 20),
      validUntil: validUntil?.trim(),
      status: ['Active', 'Inactive'].includes(status) ? status : 'Active'
    };

    // Validation
    if (!sanitizedData.title || !sanitizedData.discount || !sanitizedData.code || !sanitizedData.validUntil) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required'
      }, { status: 400 });
    }

    if (sanitizedData.code.length < 3) {
      return NextResponse.json({
        success: false,
        message: 'Code must be at least 3 characters'
      }, { status: 400 });
    }

    await query(`
      INSERT INTO offers (title, discount, code, valid_until, status)
      VALUES ($1, $2, $3, $4, $5)
    `, [sanitizedData.title, sanitizedData.discount, sanitizedData.code, sanitizedData.validUntil, sanitizedData.status]);

    return NextResponse.json({
      success: true,
      message: 'Offer created successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create offer'
    }, { status: 500 });
  }
}