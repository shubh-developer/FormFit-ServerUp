import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
        (SELECT COUNT(*) FROM inquiries WHERE status = 'new') as new_inquiries,
        (SELECT AVG(rating) FROM feedback) as avg_rating,
        (SELECT COUNT(*) FROM feedback) as total_feedback
    `);

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings: parseInt(stats.rows[0].total_bookings) || 0,
        pendingBookings: parseInt(stats.rows[0].pending_bookings) || 0,
        newInquiries: parseInt(stats.rows[0].new_inquiries) || 0,
        avgRating: parseFloat(stats.rows[0].avg_rating) || 0,
        totalFeedback: parseInt(stats.rows[0].total_feedback) || 0,
      }
    });

  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({
      success: true,
      stats: {
        totalBookings: 0,
        pendingBookings: 0,
        newInquiries: 0,
        avgRating: 0,
        totalFeedback: 0,
      }
    });
  }
}