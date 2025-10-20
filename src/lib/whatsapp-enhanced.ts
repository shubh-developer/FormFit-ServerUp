// Enhanced WhatsApp service for sending booking status notifications
// This uses the WhatsApp Business API or a simple WhatsApp link

export async function sendBookingStatusWhatsApp(booking: any, newStatus: string, serviceName: string, oilName: string): Promise<boolean> {
  try {
    const phoneNumber = booking.contact;
    let message = '';

    switch (newStatus) {
      case 'confirmed':
        message = `✅ *Booking Confirmed - FormaFit*

Dear ${booking.name},

Great news! Your massage booking has been confirmed and we're excited to provide you with a relaxing and therapeutic experience at your home.

*Confirmed Booking Details:*
• Booking ID: #${booking.id}
• Service: ${serviceName}
• Date & Time: ${new Date(booking.date_time).toLocaleString('en-IN')}
• Address: ${booking.address}
• Oil Type: ${oilName}

*Important Reminders:*
• Our certified therapist will arrive 10-15 minutes before your scheduled time
• Please ensure a clean, quiet space is available
• Have a towel or sheet ready for the massage
• Payment can be made in cash or online after the session

*Need to make changes?*
Contact us immediately: +91 7875671417

Thank you for choosing FormaFit! 🙏`;
        break;

      case 'cancelled':
        message = `❌ *Booking Cancelled - FormaFit*

Dear ${booking.name},

We regret to inform you that your massage booking has been cancelled. We understand this may be disappointing and we apologize for any inconvenience caused.

*Cancelled Booking Details:*
• Booking ID: #${booking.id}
• Service: ${serviceName}
• Original Date & Time: ${new Date(booking.date_time).toLocaleString('en-IN')}
• Address: ${booking.address}

*Would you like to reschedule?*
We'd be happy to help you book a new appointment at a time that works better for you.

*Contact us to reschedule:*
Phone: +91 7875671417
WhatsApp: +91 7875671417

Thank you for your understanding. We hope to serve you again soon! 🙏`;
        break;

      case 'completed':
        message = `🎉 *Service Completed - FormaFit*

Dear ${booking.name},

Your massage service has been successfully completed! We hope you enjoyed your relaxing and therapeutic experience.

*Completed Service Details:*
• Booking ID: #${booking.id}
• Service: ${serviceName}
• Completed Date & Time: ${new Date(booking.date_time).toLocaleString('en-IN')}
• Oil Type: ${oilName}

*Post-Massage Care Tips:*
• Stay hydrated - drink plenty of water
• Rest for at least 30 minutes after the massage
• Avoid strenuous activities for the next few hours
• Take a warm bath or shower to enhance the benefits

*Share Your Experience:*
We'd love to hear about your experience! Your feedback helps us improve our services.

Thank you for choosing FormaFit! We look forward to serving you again soon. 🙏`;
        break;

      default:
        message = `📋 *Booking Status Update - FormaFit*

Dear ${booking.name},

Your massage booking status has been updated to: *${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}*

*Booking Details:*
• Booking ID: #${booking.id}
• Service: ${serviceName}
• Date & Time: ${new Date(booking.date_time).toLocaleString('en-IN')}
• Address: ${booking.address}
• Current Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}

*Questions?*
Contact us: +91 7875671417

Thank you for choosing FormaFit! 🙏`;
    }

    // For now, we'll log the WhatsApp message
    // In production, you would integrate with WhatsApp Business API
    // WhatsApp status update message details logged for debugging
    
    // You can also create a WhatsApp link for manual sending
    const whatsappLink = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    // WhatsApp link generated for manual sending
    
    return true;
  } catch (error) {
    console.error('❌ Error sending WhatsApp status update message:', error);
    return false;
  }
}

export async function sendAdminStatusUpdateNotification(booking: any, newStatus: string): Promise<boolean> {
  try {
    const adminPhone = process.env.ADMIN_PHONE || '7875671417';
    let message = '';

    if (newStatus.startsWith('payment_')) {
      const paymentType = newStatus.replace('payment_', '');
      message = `💰 *Payment Completed*

Customer: ${booking.name}
Phone: ${booking.contact}
Email: ${booking.email}
Service: ${booking.service_type.replace('-', ' ').toUpperCase()}
Date: ${new Date(booking.date_time).toLocaleString('en-IN')}
Booking ID: #${booking.id}
Payment Method: ${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}

Payment has been completed successfully.`;
    } else {
      message = `📋 *Booking Status Updated*

Customer: ${booking.name}
Phone: ${booking.contact}
Email: ${booking.email}
Service: ${booking.service_type.replace('-', ' ').toUpperCase()}
Date: ${new Date(booking.date_time).toLocaleString('en-IN')}
Booking ID: #${booking.id}
New Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}

Status has been updated successfully.`;
    }

    // Admin status update WhatsApp notification details logged for debugging
    
    const whatsappLink = `https://wa.me/91${adminPhone}?text=${encodeURIComponent(message)}`;
    // Admin WhatsApp link generated for manual sending
    
    return true;
  } catch (error) {
    console.error('❌ Error sending admin status update WhatsApp notification:', error);
    return false;
  }
}

export async function sendSecurityWhatsApp(username: string, ipAddress: string, userAgent: string): Promise<boolean> {
  try {
    const adminPhone = process.env.ADMIN_PHONE || '7875671417';
    
    const message = `🚨 *SECURITY ALERT - FormaFit*

⚠️ *Maximum login attempts reached on Master Admin panel*

*Incident Details:*
• Username: ${username || 'Not provided'}
• IP Address: ${ipAddress || 'Unknown'}
• User Agent: ${userAgent || 'Unknown'}
• Failed Attempts: 5 (Maximum reached)
• Timestamp: ${new Date().toLocaleString('en-IN')}
• Account Status: Locked for 30 minutes

*Action Required:*
• Monitor this IP for suspicious activity
• Review access logs immediately
• Verify admin credentials are secure

*Auto-Response:*
Account has been locked for 30 minutes to prevent unauthorized access.

*FormaFit Security System*`;

    // Security alert WhatsApp notification details logged for debugging
    
    const whatsappLink = `https://wa.me/91${adminPhone}?text=${encodeURIComponent(message)}`;
    // Security alert WhatsApp link generated for manual sending
    
    return true;
  } catch (error) {
    console.error('❌ Error sending security alert WhatsApp:', error);
    return false;
  }
} 