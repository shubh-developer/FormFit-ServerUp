import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { status } = body;
    const { id } = await params;

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status is required' },
        { status: 400 }
      );
    }

    const result = await query(
      'UPDATE packages SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Package status updated successfully',
      package: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update package' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params;

    if (!title || !originalPrice || !discountedPrice || !sessions || !validityDays) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE packages SET 
        package_type = $1, title = $2, description = $3, discount_percentage = $4, 
        original_price = $5, discounted_price = $6, sessions = $7, validity_days = $8, 
        features = $9
      WHERE id = $10 RETURNING *`,
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
        id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Package updated successfully',
      package: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update package' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const result = await query(
      'DELETE FROM packages WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete package' },
      { status: 500 }
    );
  }
}