import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getRealTimeData, query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric');
    const limit = parseInt(searchParams.get('limit') || '100');

    if (metric) {
      // Get specific real-time data
      const data = await getRealTimeData(metric, limit);
      return NextResponse.json({
        success: true,
        data,
        metric,
        limit
      });
    } else {
      // Get dashboard statistics
      const stats = await getDashboardStats();
      
      // Get recent bookings
      const recentBookingsResult = await query(`
        SELECT id, name, service_type, created_at 
        FROM bookings 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      
      // Get counts
      const countsResult = await query(`
        SELECT 
          (SELECT COUNT(*) FROM bookings) as bookings,
          (SELECT COUNT(*) FROM inquiries) as inquiries,
          (SELECT COUNT(*) FROM feedback) as feedback
      `);
      
      const data = {
        connection: 'Connected',
        counts: countsResult.rows[0],
        recentBookings: recentBookingsResult.rows,
        timestamp: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        data
      });
    }
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metricName, metricValue } = body;

    if (!metricName || metricValue === undefined) {
      return NextResponse.json({
        success: false,
        message: 'metricName and metricValue are required',
      }, { status: 400 });
    }

    const { updateRealTimeData } = await import('@/lib/database');
    await updateRealTimeData(metricName, metricValue);

    return NextResponse.json({
      success: true,
      message: 'Real-time data updated successfully',
    });
  } catch (error) {
    console.error('Dashboard POST API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 