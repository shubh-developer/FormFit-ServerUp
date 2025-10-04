import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/database';
import { createHash } from 'crypto';

const verifySchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
});

function generateSessionToken(bookingId: string, email: string, phone: string): string {
  const data = `${bookingId}-${email}-${phone}-${process.env.FEEDBACK_SECRET || 'default-secret'}`;
  return createHash('sha256').update(data).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = verifySchema.parse(body);
    
    // Get client information for security logging
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Check if booking exists and is completed
    const bookingResult = await query(`
      SELECT id, name, email, contact, status, date_time, created_at
      FROM bookings 
      WHERE email = $1 AND contact = $2 AND status = 'completed'
      ORDER BY date_time DESC
      LIMIT 1
    `, [validatedData.email, validatedData.phone]);

    if (bookingResult.rows.length === 0) {
      // Log failed verification attempt (with error handling)
      try {
        await query(`
          INSERT INTO feedback_security_audit (booking_id, client_email, client_phone, ip_address, user_agent, action_type, status, reason)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          null,
          validatedData.email,
          validatedData.phone,
          clientIP,
          userAgent,
          'verification_attempt',
          'failed',
          'No completed booking found for this email and phone'
        ]);
      } catch (auditError) {
        console.error('Failed to log audit entry:', auditError);
      }

      return NextResponse.json({
        success: false,
        message: 'No completed booking found for this email and phone number',
        canSubmit: false,
      }, { status: 404 });
    }

    const booking = bookingResult.rows[0];

    // Booking is already filtered to be completed, so no need to check status again

    // Additional security: Check if the session was completed within a reasonable timeframe
    const sessionDate = new Date(booking.date_time);
    const now = new Date();
    const daysSinceSession = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Allow feedback only for sessions completed within the last 30 days
    if (daysSinceSession > 30) {
      return NextResponse.json({
        success: false,
        message: 'Feedback can only be submitted for sessions completed within the last 30 days',
        canSubmit: false,
      }, { status: 400 });
    }

    // Additional security: Check if booking was created recently (prevent fake bookings)
    // Commented out for now - allows immediate feedback after session completion
    /*
    const bookingCreatedDate = new Date(booking.created_at);
    const daysSinceBookingCreation = Math.floor((now.getTime() - bookingCreatedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceBookingCreation < 1) {
      return NextResponse.json({
        success: false,
        message: 'Booking must be at least 1 day old to submit feedback',
        canSubmit: false,
      }, { status: 400 });
    }
    */

    // Check if feedback already exists for this booking
    const feedbackResult = await query(`
      SELECT id FROM feedback WHERE booking_id = $1
    `, [booking.id]);

    if (feedbackResult.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Feedback has already been submitted for this session',
        canSubmit: false,
      }, { status: 400 });
    }

    // Generate session token for secure feedback submission
    const sessionToken = generateSessionToken(booking.id, validatedData.email, validatedData.phone);

    // Log successful verification (with error handling)
    try {
      await query(`
        INSERT INTO feedback_security_audit (booking_id, client_email, client_phone, ip_address, user_agent, action_type, status, reason)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        booking.id,
        validatedData.email,
        validatedData.phone,
        clientIP,
        userAgent,
        'verification_attempt',
        'success',
        'Booking verified successfully'
      ]);
    } catch (auditError) {
      console.error('Failed to log audit entry:', auditError);
    }

    return NextResponse.json({
      success: true,
      message: 'You can submit feedback for this session',
      canSubmit: true,
      sessionToken,
      booking: {
        id: booking.id,
        name: booking.name,
        serviceDate: booking.date_time,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('Feedback Verification API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 