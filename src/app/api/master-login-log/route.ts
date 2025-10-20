import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, ip_address, user_agent, status, email_sent, whatsapp_sent } = body;

    if (!username || !status) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: username, status',
      }, { status: 400 });
    }

    // Get real IP address from headers
    const realIp = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   ip_address || 
                   'Unknown';

    const result = await query(`
      INSERT INTO master_login_attempts 
      (username, ip_address, user_agent, status, email_sent, whatsapp_sent, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING id
    `, [username, realIp, user_agent, status, email_sent || false, whatsapp_sent || false]);

    return NextResponse.json({
      success: true,
      message: 'Login attempt logged successfully',
      id: result.rows[0].id
    });

  } catch (error) {
    console.error('Error logging master login attempt:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to log login attempt',
    }, { status: 500 });
  }
}