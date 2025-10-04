import { NextRequest, NextResponse } from 'next/server';
import { sendBookingStatusWhatsApp, sendAdminStatusUpdateNotification } from '@/lib/whatsapp-enhanced';

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

    if (type === 'booking_status_update') {
      if (!newStatus) {
        return NextResponse.json({
          success: false,
          message: 'Missing required field: newStatus',
        }, { status: 400 });
      }

      // Send WhatsApp notification to client
      const clientWhatsappSent = await sendBookingStatusWhatsApp(booking, newStatus, serviceName, oilName);
      
      // Send admin notification
      const adminWhatsappSent = await sendAdminStatusUpdateNotification(booking, newStatus);
      
      if (clientWhatsappSent && adminWhatsappSent) {
        return NextResponse.json({
          success: true,
          message: 'WhatsApp notifications sent successfully',
          details: {
            client: 'sent',
            admin: 'sent'
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to send some WhatsApp notifications',
          details: {
            client: clientWhatsappSent ? 'sent' : 'failed',
            admin: adminWhatsappSent ? 'sent' : 'failed'
          }
        }, { status: 500 });
      }
    }

                 if (type === 'payment_completed') {
               if (!paymentStatus) {
                 return NextResponse.json({
                   success: false,
                   message: 'Missing required field: paymentStatus',
                 }, { status: 400 });
               }
         
               // Send admin notification only for payment completion (no client notification)
               const adminWhatsappSent = await sendAdminStatusUpdateNotification(booking, `payment_${paymentStatus}`);
               
               if (adminWhatsappSent) {
                 return NextResponse.json({
                   success: true,
                   message: 'Payment completion admin notification sent successfully',
                   details: {
                     client: 'disabled',
                     admin: 'sent'
                   }
                 });
               } else {
                 return NextResponse.json({
                   success: false,
                   message: 'Failed to send payment completion admin notification',
                   details: {
                     client: 'disabled',
                     admin: 'failed'
                   }
                 }, { status: 500 });
               }
             }

    return NextResponse.json({
      success: false,
      message: 'Invalid notification type',
    }, { status: 400 });

  } catch (error) {
    console.error('Error in WhatsApp notification API:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 