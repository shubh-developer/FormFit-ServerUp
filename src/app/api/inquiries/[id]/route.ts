import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({
        success: false,
        message: 'Status is required',
      }, { status: 400 });
    }

    // Update inquiry status
    const result = await query(`
      UPDATE inquiries 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Inquiry not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry status updated successfully',
      inquiry: result.rows[0],
    });

  } catch (error) {
    console.error('Update Inquiry API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 