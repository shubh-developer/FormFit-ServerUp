import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/database';
import { createHash } from 'crypto';

const feedbackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
  bookingId: z.string().min(1, 'Booking ID is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
  sessionToken: z.string().min(1, 'Session token is required'),
});

// In-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

function generateSessionToken(bookingId: string, email: string, phone: string): string {
  const data = `${bookingId}-${email}-${phone}-${process.env.FEEDBACK_SECRET || 'default-secret'}`;
  return createHash('sha256').update(data).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = feedbackSchema.parse(body);
    
    // Enhanced rate limiting with multiple identifiers
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Rate limit by IP
    if (!checkRateLimit(`ip_${clientIP}`, 3, 300000)) { // 3 attempts per 5 minutes
      return NextResponse.json({
        success: false,
        message: 'Too many attempts. Please try again later.',
      }, { status: 429 });
    }
    
    // Rate limit by email
    if (!checkRateLimit(`email_${validatedData.email}`, 2, 600000)) { // 2 attempts per 10 minutes
      return NextResponse.json({
        success: false,
        message: 'Too many attempts for this email. Please try again later.',
      }, { status: 429 });
    }
    
    // Verify booking exists and is completed
    const bookingResult = await query(`
      SELECT id, name, email, contact, status, date_time, created_at, service_type
      FROM bookings 
      WHERE id = $1 AND email = $2 AND contact = $3
    `, [validatedData.bookingId, validatedData.email, validatedData.phone]);

    if (bookingResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found or credentials do not match',
      }, { status: 404 });
    }

    const booking = bookingResult.rows[0];

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return NextResponse.json({
        success: false,
        message: 'Feedback can only be submitted for completed sessions',
      }, { status: 400 });
    }

    // Verify session token
    const expectedToken = generateSessionToken(validatedData.bookingId, validatedData.email, validatedData.phone);
    if (validatedData.sessionToken !== expectedToken) {
      return NextResponse.json({
        success: false,
        message: 'Invalid session token. Please verify your booking again.',
      }, { status: 401 });
    }

    // Enhanced time-based security checks
    const sessionDate = new Date(booking.date_time);
    const now = new Date();
    const daysSinceSession = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Allow feedback only for sessions completed within the last 30 days
    if (daysSinceSession > 30) {
      return NextResponse.json({
        success: false,
        message: 'Feedback can only be submitted for sessions completed within the last 30 days',
      }, { status: 400 });
    }

    // Prevent feedback for sessions that haven't happened yet
    if (sessionDate > now) {
      return NextResponse.json({
        success: false,
        message: 'Cannot submit feedback for future sessions',
      }, { status: 400 });
    }

    // Additional security: Check if booking was created recently (prevent fake bookings)
    // const bookingCreatedDate = new Date(booking.created_at);
    // const daysSinceBookingCreation = Math.floor((now.getTime() - bookingCreatedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // if (daysSinceBookingCreation < 1) {
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Booking must be at least 1 day old to submit feedback',
    //   }, { status: 400 });
    // }

    // Check if feedback already exists for this booking
    const existingFeedback = await query(`
      SELECT id FROM feedback WHERE booking_id = $1
    `, [validatedData.bookingId]);

    if (existingFeedback.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Feedback has already been submitted for this session',
      }, { status: 400 });
    }

    // Verify name matches booking (case-insensitive)
    if (validatedData.name.toLowerCase().trim() !== booking.name.toLowerCase().trim()) {
      return NextResponse.json({
        success: false,
        message: 'Name must match the booking information',
      }, { status: 400 });
    }

    // Additional fraud detection: Check for suspicious patterns
    const suspiciousPatterns = await query(`
      SELECT COUNT(*) as count 
      FROM feedback 
      WHERE client_email = $1 
      AND created_at > NOW() - INTERVAL '24 hours'
    `, [validatedData.email]);

    if (parseInt(suspiciousPatterns.rows[0].count) >= 3) {
      return NextResponse.json({
        success: false,
        message: 'Too many feedback submissions from this email address',
      }, { status: 429 });
    }
    
    // Insert feedback into database with additional security fields
    const result = await query(`
      INSERT INTO feedback (name, rating, comment, booking_id, client_email, client_phone, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      validatedData.name,
      validatedData.rating,
      validatedData.comment,
      validatedData.bookingId,
      validatedData.email,
      validatedData.phone,
      clientIP,
      userAgent
    ]);

    const feedback = result.rows[0];

    // Log successful feedback submission for security monitoring
    await query(`
      INSERT INTO feedback_security_audit (booking_id, client_email, client_phone, ip_address, user_agent, action_type, status, reason)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      validatedData.bookingId,
      validatedData.email,
      validatedData.phone,
      clientIP,
      userAgent,
      'feedback_submitted',
      'success',
      'Feedback submitted successfully'
    ]);

    console.log(`[SECURITY] Feedback submitted successfully: Booking ${validatedData.bookingId}, IP: ${clientIP}, User-Agent: ${userAgent}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('Feedback API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('Fetching feedback from database...');
    
    // Fetch all feedback from database with booking information
    const result = await query(`
      SELECT 
        f.id,
        f.name,
        f.rating,
        f.comment,
        f.booking_id,
        f.client_email,
        f.client_phone,
        f.created_at,
        f.updated_at,
        b.service_type,
        b.date_time as session_date
      FROM feedback f
      LEFT JOIN bookings b ON f.booking_id = b.id
      ORDER BY f.created_at DESC
    `);

    console.log(`Found ${result.rows.length} feedback entries`);

    return NextResponse.json({
      success: true,
      feedback: result.rows,
    });
  } catch (error) {
    console.error('Get Feedback API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Simple review schema for non-booking reviews
const simpleReviewSchema = z.object({
  name: z.string()
    .min(2, 'Name is required (minimum 2 characters)')
    .max(50, 'Name too long (maximum 50 characters)')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  rating: z.number().min(1, 'Rating is required').max(5, 'Invalid rating'),
  comment: z.string()
    .min(10, 'Review is required (minimum 10 characters)')
    .max(500, 'Review too long (maximum 500 characters)'),
});

// Handle simple reviews (without booking requirement)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body for simple review
    const validatedData = simpleReviewSchema.parse(body);
    
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(`simple_review_${clientIP}`, 3, 300000)) { // 3 reviews per 5 minutes
      return NextResponse.json({
        success: false,
        message: 'Too many review submissions. Please try again later.',
      }, { status: 429 });
    }
    
    // Sanitize inputs
    const sanitizedData = {
      name: validatedData.name.trim().replace(/\s+/g, ' '),
      rating: Math.max(1, Math.min(5, Math.floor(validatedData.rating))),
      comment: validatedData.comment.trim().replace(/\s+/g, ' '),
    };
    
    // Insert simple review into feedback table (without booking_id)
    const result = await query(`
      INSERT INTO feedback (name, rating, comment, client_email, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      sanitizedData.name,
      sanitizedData.rating,
      sanitizedData.comment,
      null, // No email for simple reviews
      clientIP,
      request.headers.get('user-agent') || 'unknown'
    ]);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your review!',
      review: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('Simple Review API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 