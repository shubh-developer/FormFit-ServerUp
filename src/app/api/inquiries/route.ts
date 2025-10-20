import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/database';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
  email: z.string().email('Please enter a valid email address').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});



export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    console.log('📥 Received inquiry request:', body);
    
    if (!body) {
      return NextResponse.json({
        success: false,
        message: 'Request body is empty'
      }, { status: 400 });
    }
    
    const data = JSON.parse(body);
    console.log('📋 Parsed inquiry data:', data);
    
    // Validate the request body
    const validatedData = inquirySchema.parse(data);
    console.log('✅ Validation passed:', validatedData);
    
    // Create new inquiry object
    const newInquiry = {
      id: Date.now(),
      name: validatedData.name.trim(),
      phone: validatedData.phone,
      email: validatedData.email || null,
      message: validatedData.message.trim(),
      status: 'new',
      created_at: new Date().toISOString()
    };
    
    // Insert inquiry into database
    const result = await query(`
      INSERT INTO inquiries (name, phone, email, message, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `, [
      newInquiry.name,
      newInquiry.phone,
      newInquiry.email,
      newInquiry.message,
      newInquiry.status
    ]);
    
    const inquiry = result.rows[0];
    
    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully! We will get back to you soon.',
      inquiry,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.issues);
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('❌ Inquiry API Error:', error);
    console.error('❌ Full error details:', error instanceof Error ? error.stack : error);
    return NextResponse.json({
      success: false,
      message: 'Failed to submit inquiry: ' + (error instanceof Error ? error.message : 'Unknown error'),
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM inquiries 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      inquiries: result.rows,
    });
  } catch (error) {
    console.error('Get Inquiries API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 