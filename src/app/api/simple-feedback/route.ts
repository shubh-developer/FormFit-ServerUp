import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>"'&]/g, '').replace(/\s+/g, ' ');
}

export async function POST(request: NextRequest) {
  let client;
  try {
    const body = await request.json();
    const { name, rating, comment } = body;
    
    // Basic validation
    if (!name || name.length < 2 || name.length > 50) {
      return NextResponse.json({ success: false, message: 'Invalid name' }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: 'Invalid rating' }, { status: 400 });
    }
    if (!comment || comment.length < 10 || comment.length > 500) {
      return NextResponse.json({ success: false, message: 'Invalid comment' }, { status: 400 });
    }
    
    const sanitizedData = {
      name: sanitizeInput(name),
      rating: Math.max(1, Math.min(5, Math.floor(rating))),
      comment: sanitizeInput(comment),
    };
    
    client = await pool.connect();
    
    // Create simple reviews table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS simple_reviews (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    
    const result = await client.query(`
      INSERT INTO simple_reviews (name, rating, comment, ip_address)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [sanitizedData.name, sanitizedData.rating, sanitizedData.comment, clientIP]);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your review!',
      review: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Simple Review API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to submit review',
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    
    const result = await client.query(`
      SELECT * FROM simple_reviews 
      ORDER BY created_at DESC 
      LIMIT 20
    `);

    return NextResponse.json({
      success: true,
      reviews: result.rows,
    });

  } catch (error) {
    console.error('Get Simple Reviews Error:', error);
    return NextResponse.json({
      success: false,
      reviews: [],
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}