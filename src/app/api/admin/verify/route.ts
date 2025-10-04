import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    const adminUser = getAdminUser(request);
    
    if (!adminUser) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      user: {
        username: adminUser.username,
        role: adminUser.role,
      },
    });

  } catch (error) {
    console.error('Admin Token Verification Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 