import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete feedback
    const result = await query(`
      DELETE FROM feedback 
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Feedback not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted successfully',
    });

  } catch (error) {
    console.error('Delete Feedback API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 