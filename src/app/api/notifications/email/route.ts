import { NextRequest, NextResponse } from 'next/server';
import { sendBookingStatusUpdate } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, booking, newStatus, paymentStatus, serviceName, oilName } = body;

    if (!type || !booking) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: type, booking',
      }, { status: 400 });
    }

    if (type === 'booking_confirmation') {
      const { to, subject, bookingData } = body;
      
      if (!to || !bookingData) {
        return NextResponse.json({
          success: false,
          message: 'Missing required fields for booking confirmation',
        }, { status: 400 });
      }

      try {
        const { sendBookingConfirmation } = await import('@/lib/email');
        const emailSent = await sendBookingConfirmation(to, bookingData);
        
        if (emailSent) {
          return NextResponse.json({
            success: true,
            message: 'Booking confirmation email sent successfully',
          });
        } else {
          return NextResponse.json({
            success: false,
            message: 'Failed to send booking confirmation email',
          }, { status: 500 });
        }
      } catch (error) {
        console.error('Error sending booking confirmation:', error);
        return NextResponse.json({
          success: false,
          message: 'Failed to send booking confirmation email',
        }, { status: 500 });
      }
    }
    
    if (type === 'booking_status_update') {
      if (!newStatus) {
        return NextResponse.json({
          success: false,
          message: 'Missing required field: newStatus',
        }, { status: 400 });
      }

      const emailSent = await sendBookingStatusUpdate(booking, newStatus, serviceName, oilName);
      
      if (emailSent) {
        return NextResponse.json({
          success: true,
          message: 'Email notification sent successfully',
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to send email notification',
        }, { status: 500 });
      }
    }

                 // Payment completion emails are disabled - only WhatsApp notifications are sent
             if (type === 'payment_completed') {
               return NextResponse.json({
                 success: true,
                 message: 'Payment completion email notifications are disabled',
               });
             }

    return NextResponse.json({
      success: false,
      message: 'Invalid notification type',
    }, { status: 400 });

  } catch (error) {
    console.error('Error in email notification API:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 