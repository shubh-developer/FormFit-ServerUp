import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/database';
import { sendBookingStatusUpdate } from '@/lib/email';

const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'booked', 'in-progress', 'completed', 'cancelled']),
  notes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const body = await request.json();
    
    // Validate the request body
    const validatedData = statusUpdateSchema.parse(body);
    
    // Check if booking exists
    const bookingResult = await query(`
      SELECT id, status, name, email, contact
      FROM bookings 
      WHERE id = $1
    `, [bookingId]);

    if (bookingResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found',
      }, { status: 404 });
    }

    const booking = bookingResult.rows[0];

    // Update booking status
    const result = await query(`
      UPDATE bookings 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [validatedData.status, bookingId]);

    const updatedBooking = result.rows[0];

    // If status is being set to completed, add a note about feedback eligibility
    if (validatedData.status === 'completed') {
      await query(`
        UPDATE bookings 
        SET therapist_notes = CASE 
          WHEN therapist_notes IS NULL OR therapist_notes = '' 
          THEN 'Session completed. Client is now eligible to submit feedback.'
          ELSE therapist_notes || '\n\nSession completed. Client is now eligible to submit feedback.'
        END
        WHERE id = $1
      `, [bookingId]);
    }

    // Send email notification based on status
    try {
      let emailStatus: string = validatedData.status;
      if (validatedData.status === 'booked') emailStatus = 'confirmed';
      
      await sendBookingStatusUpdate(
        updatedBooking, 
        emailStatus, 
        updatedBooking.service_type || 'Massage Service',
        'Premium Oil'
      );
    } catch (emailError) {
      console.error('Failed to send status email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${validatedData.status}`,
      booking: updatedBooking,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('Booking Status Update API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    
    // Get booking status and feedback eligibility
    const result = await query(`
      SELECT 
        b.id, b.name, b.email, b.contact, b.status, b.date_time, b.created_at,
        CASE 
          WHEN f.id IS NOT NULL THEN 'submitted'
          WHEN b.status = 'completed' THEN 'eligible'
          ELSE 'not_eligible'
        END as feedback_status,
        f.created_at as feedback_submitted_at
      FROM bookings b
      LEFT JOIN feedback f ON b.id = f.booking_id
      WHERE b.id = $1
    `, [bookingId]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found',
      }, { status: 404 });
    }

    const booking = result.rows[0];

    return NextResponse.json({
      success: true,
      booking,
    });

  } catch (error) {
    console.error('Booking Status Get API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 