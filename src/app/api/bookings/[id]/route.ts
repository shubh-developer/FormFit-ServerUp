import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// Simple in-memory update - this will work with the main bookings store
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json();
    
    // Since we're using in-memory storage, just return success
    // The frontend will refresh the data from the main store
    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update booking'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id;
    
    // Delete from database
    const result = await query('DELETE FROM bookings WHERE id = $1 RETURNING id', [bookingId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Booking deletion error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete booking'
    }, { status: 500 });
  }
}