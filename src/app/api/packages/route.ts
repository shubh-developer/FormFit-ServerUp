import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packageType,
      title,
      description,
      discountPercentage,
      originalPrice,
      discountedPrice,
      sessions,
      validityDays,
      features
    } = body;

    // Validate required fields
    if (!title || !originalPrice || !discountedPrice || !sessions || !validityDays) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert package into database
    const result = await query(
      `INSERT INTO packages (
        package_type, title, description, discount_percentage, original_price, 
        discounted_price, sessions, validity_days, features, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) RETURNING *`,
      [
        packageType || 'massage',
        title,
        description || '',
        parseInt(discountPercentage) || 0,
        parseInt(originalPrice),
        parseInt(discountedPrice),
        parseInt(sessions),
        parseInt(validityDays),
        JSON.stringify(features.filter((f: string) => f.trim() !== '')),
        'active'
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Package created successfully',
      package: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create package' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM packages WHERE status = $1 ORDER BY created_at DESC',
      ['active']
    );

    return NextResponse.json({
      success: true,
      packages: result.rows.map((row: any) => ({
        id: row.id,
        package_type: row.package_type,
        title: row.title,
        description: row.description,
        discount_percentage: row.discount_percentage,
        original_price: row.original_price,
        discounted_price: row.discounted_price,
        sessions: row.sessions,
        validity_days: row.validity_days,
        features: row.features,
        status: row.status,
        created_at: row.created_at
      }))
    });

  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}