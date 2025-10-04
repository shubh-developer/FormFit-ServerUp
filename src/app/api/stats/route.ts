import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, today, week, month

    // Build date filter based on period
    let dateFilter = '';
    switch (period) {
      case 'today':
        dateFilter = "WHERE DATE(created_at) = CURRENT_DATE";
        break;
      case 'week':
        dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'month':
        dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      default:
        dateFilter = '';
    }

    // Get comprehensive statistics
    const [
      totalBookings,
      totalInquiries,
      totalFeedback,
      averageRating,
      serviceDistribution,
      oilDistribution,
      paymentStatusDistribution,
      monthlyTrends,
      recentBookings,
      recentInquiries,
      recentFeedback,
      urgentBookings,
      completedBookings
    ] = await Promise.all([
      // Total bookings
      query(`SELECT COUNT(*) as count FROM bookings ${dateFilter}`),
      
      // Total inquiries
      query(`SELECT COUNT(*) as count FROM inquiries ${dateFilter}`),
      
      // Total feedback
      query(`SELECT COUNT(*) as count FROM feedback ${dateFilter}`),
      
      // Average rating
      query(`SELECT AVG(rating) as average FROM feedback ${dateFilter}`),
      
      // Service type distribution
      query(`
        SELECT service_type, COUNT(*) as count
        FROM bookings
        ${dateFilter}
        GROUP BY service_type
        ORDER BY count DESC
      `),
      
      // Oil type distribution
      query(`
        SELECT oil_type, COUNT(*) as count
        FROM bookings
        ${dateFilter}
        GROUP BY oil_type
        ORDER BY count DESC
      `),
      
      // Payment status distribution
      query(`
        SELECT payment_status, COUNT(*) as count
        FROM bookings
        ${dateFilter}
        GROUP BY payment_status
        ORDER BY count DESC
      `),
      
      // Monthly trends (last 12 months)
      query(`
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as count
        FROM bookings
        WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
      `),
      
      // Recent bookings (last 10)
      query(`
        SELECT * FROM bookings 
        ORDER BY created_at DESC 
        LIMIT 10
      `),
      
      // Recent inquiries (last 10)
      query(`
        SELECT * FROM inquiries 
        ORDER BY created_at DESC 
        LIMIT 10
      `),
      
      // Recent feedback (last 10)
      query(`
        SELECT * FROM feedback 
        ORDER BY created_at DESC 
        LIMIT 10
      `),
      
      // Urgent bookings
      query(`
        SELECT COUNT(*) as count 
        FROM bookings 
        WHERE is_urgent = true ${dateFilter ? 'AND ' + dateFilter.replace('WHERE ', '') : ''}
      `),
      
      // Completed bookings
      query(`
        SELECT COUNT(*) as count 
        FROM bookings 
        WHERE status = 'completed' ${dateFilter ? 'AND ' + dateFilter.replace('WHERE ', '') : ''}
      `)
    ]);

    // Calculate revenue (if payment_status is 'paid')
    const revenueResult = await query(`
      SELECT 
        COALESCE(SUM(s.price), 0) as total_revenue
      FROM bookings b
      LEFT JOIN services s ON b.service_type = s.id
      WHERE b.payment_status = 'paid' ${dateFilter ? 'AND ' + dateFilter.replace('WHERE ', '') : ''}
    `);

    return NextResponse.json({
      success: true,
      data: {
        period,
        statistics: {
          totalBookings: parseInt(totalBookings.rows[0].count),
          totalInquiries: parseInt(totalInquiries.rows[0].count),
          totalFeedback: parseInt(totalFeedback.rows[0].count),
          averageRating: parseFloat(averageRating.rows[0].average || '0').toFixed(1),
          urgentBookings: parseInt(urgentBookings.rows[0].count),
          completedBookings: parseInt(completedBookings.rows[0].count),
          totalRevenue: parseFloat(revenueResult.rows[0].total_revenue || '0').toFixed(2),
        },
        distributions: {
          services: serviceDistribution.rows,
          oils: oilDistribution.rows,
          paymentStatus: paymentStatusDistribution.rows,
        },
        trends: {
          monthly: monthlyTrends.rows,
        },
        recent: {
          bookings: recentBookings.rows,
          inquiries: recentInquiries.rows,
          feedback: recentFeedback.rows,
        },
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 