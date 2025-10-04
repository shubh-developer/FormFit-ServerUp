import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, discount, code, validUntil, status } = await request.json();
    const { id } = params;

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

    await query(`
      UPDATE offers 
      SET title = $1, discount = $2, code = $3, valid_until = $4, status = $5
      WHERE id = $6
    `, [sanitizedData.title, sanitizedData.discount, sanitizedData.code, sanitizedData.validUntil, sanitizedData.status, id]);

    return NextResponse.json({
      success: true,
      message: 'Offer updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update offer'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await query('DELETE FROM offers WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete offer'
    }, { status: 500 });
  }
}