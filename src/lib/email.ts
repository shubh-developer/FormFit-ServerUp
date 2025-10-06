import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || 'your-app-password',
  },
});

interface BookingEmailData {
  name: string;
  email: string;
  serviceType: string;
  dateTime: string;
  address: string;
  contact: string;
  oilType: string;
  bookingId: number;
}

export async function sendBookingConfirmation(to: string, bookingData: any): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.DEFAULT_FROM_EMAIL || process.env.SMTP_USER || 'formafit503@gmail.com',
      to: to,
      subject: '🎉 Booking Submitted - Under Review - FormaFit',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Under Review</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #555; }
            .detail-value { color: #333; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .contact-info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Booking Under Review!</h1>
              <p>Thank you for choosing FormaFit</p>
            </div>
            
            <div class="content">
              <p>Dear <strong>${bookingData.name}</strong>,</p>
              
              <p>Your massage booking has been successfully submitted and is currently under review. We will confirm your appointment shortly and send you a confirmation email once approved.</p>
              
              <div class="booking-details">
                <h3>📋 Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value">#${bookingData.bookingId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Service:</span>
                  <span class="detail-value">${bookingData.service}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date & Time:</span>
                  <span class="detail-value">${bookingData.date} at ${bookingData.time}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">${bookingData.address}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Contact:</span>
                  <span class="detail-value">${bookingData.contact}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Oil Type:</span>
                  <span class="detail-value">${bookingData.oilType}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Price:</span>
                  <span class="detail-value">₹${bookingData.amount}</span>
                </div>
              </div>
              
              <div class="contact-info">
                <h4>📞 Need assistance?</h4>
                <p>If you have any questions or need to make changes, please contact us:</p>
                <p><strong>Phone:</strong> +91 7875671417</p>
                <p><strong>WhatsApp:</strong> +91 7875671417</p>
              </div>
              
              <h4>✨ What happens next:</h4>
              <ul>
                <li>We will review your booking within 2-4 hours</li>
                <li>You will receive a confirmation email once approved</li>
                <li>Our certified therapist will contact you before the appointment</li>
                <li>Payment can be made after the session</li>
              </ul>
              
              <div class="footer">
                <p>Thank you for choosing FormaFit!</p>
                <p>We will confirm your booking soon.</p>
                <hr style="margin: 20px 0;">
                <p><small>This is an automated email. Please do not reply to this address.</small></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    return false;
  }
}

export async function sendBookingConfirmationOld(booking: any, serviceName: string, oilName: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.DEFAULT_FROM_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER || 'your-email@gmail.com',
      to: booking.email,
      subject: '🎉 Booking Confirmation - FormaFit',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #555; }
            .detail-value { color: #333; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .contact-info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .urgent { background: #fff3e0; border-left: 4px solid #ff9800; padding: 10px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
                    <div class="header">
          <h1>📋 Booking Submitted!</h1>
          <p>Thank you for choosing FormaFit</p>
        </div>
            
            <div class="content">
              <p>Dear <strong>${booking.name}</strong>,</p>
              
              <p>Your massage booking has been successfully submitted! We're reviewing your appointment and will confirm it shortly. We're excited to provide you with a relaxing and therapeutic experience at your home.</p>
              
              <div class="booking-details">
                <h3>📋 Submitted Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value">#${booking.id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Service:</span>
                  <span class="detail-value">${serviceName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date & Time:</span>
                  <span class="detail-value">${new Date(booking.date_time).toLocaleString('en-IN')}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">${booking.address}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Oil Type:</span>
                  <span class="detail-value">${oilName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Contact:</span>
                  <span class="detail-value">${booking.contact}</span>
                </div>
              </div>
              
              <div class="contact-info">
                <h4>📞 Need to make changes?</h4>
                <p>If you need to reschedule or have any questions, please contact us:</p>
                <p><strong>Phone:</strong> +91 7875671417</p>
                <p><strong>WhatsApp:</strong> +91 7875671417</p>
              </div>
              
              <h4>✨ What to expect:</h4>
              <ul>
                <li>Our certified therapist will arrive 10-15 minutes before your scheduled time</li>
                <li>Please ensure a clean, quiet space is available</li>
                <li>Have a towel or sheet ready for the massage</li>
                <li>Payment can be made in cash or online after the session</li>
              </ul>
              
              <div class="footer">
                <p>Thank you for choosing FormaFit!</p>
                <p>We look forward to providing you with an exceptional massage experience.</p>
                <hr style="margin: 20px 0;">
                <p><small>This is an automated email. Please do not reply to this address.</small></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    // Booking confirmation email sent successfully
    
    // Update the booking to mark email as sent
    const { query } = await import('@/lib/database');
    await query(`
      UPDATE bookings 
      SET email_sent = true, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `, [booking.id]);
    
    return true;
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    return false;
  }
}

export async function sendAdminNotification(booking: any): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@formafit.com';
    
    const mailOptions = {
      from: process.env.DEFAULT_FROM_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER || 'your-email@gmail.com',
      to: adminEmail,
      subject: '🆕 New Booking Received - FormaFit',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2196f3; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .content { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .booking-info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .detail { margin: 8px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🆕 New Booking Received</h2>
            </div>
            
            <div class="content">
              <div class="booking-info">
                <div class="detail">
                  <span class="label">Customer:</span> ${booking.name}
                </div>
                <div class="detail">
                  <span class="label">Email:</span> ${booking.email}
                </div>
                <div class="detail">
                  <span class="label">Phone:</span> ${booking.contact}
                </div>
                <div class="detail">
                  <span class="label">Service:</span> ${booking.service_type.replace('-', ' ').toUpperCase()}
                </div>
                <div class="detail">
                  <span class="label">Date & Time:</span> ${new Date(booking.date_time).toLocaleString('en-IN')}
                </div>
                <div class="detail">
                  <span class="label">Address:</span> ${booking.address}
                </div>
                <div class="detail">
                  <span class="label">Booking ID:</span> #${booking.id}
                </div>
              </div>
              
              <p><strong>Action Required:</strong> Please review and confirm this booking.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    // Admin notification email sent successfully
    return true;
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
    return false;
  }
} 

export async function sendBookingStatusUpdate(booking: any, newStatus: string, serviceName: string, oilName: string): Promise<boolean> {
  try {
    let subject = '';
    let emailContent = '';

    switch (newStatus) {
      case 'confirmed':
        subject = '✅ Booking Confirmed - FormaFit';
        emailContent = generateConfirmedEmailContent(booking, serviceName, oilName);
        break;
      case 'pending':
        subject = '⏳ Booking Pending - FormaFit';
        emailContent = generatePendingEmailContent(booking, serviceName, oilName);
        break;
      case 'cancelled':
        subject = '❌ Booking Cancelled - FormaFit';
        emailContent = generateCancelledEmailContent(booking, serviceName, oilName);
        break;
      case 'completed':
        subject = '✅ Session Completed Successfully - FormaFit';
        emailContent = generateCompletedEmailContent(booking, serviceName, oilName);
        break;
      default:
        subject = '📋 Booking Status Update - FormaFit';
        emailContent = generateStatusUpdateEmailContent(booking, newStatus, serviceName, oilName);
    }

    const mailOptions = {
      from: process.env.DEFAULT_FROM_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER || 'your-email@gmail.com',
      to: booking.email,
      subject: subject,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    // Status email sent successfully
    return true;
  } catch (error) {
    console.error(`❌ Error sending ${newStatus} status email:`, error);
    return false;
  }
}

function generatePendingEmailContent(booking: any, serviceName: string, oilName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Pending</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .contact-info { background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .pending-info { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏳ Booking Pending</h1>
          <p>Your booking is being reviewed</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${booking.name}</strong>,</p>
          
          <p>Thank you for your booking request! Your appointment is currently pending and will be confirmed soon. We are reviewing your request and will get back to you shortly.</p>
          
          <div class="booking-details">
            <h3>📋 Pending Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">#${booking.id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">${serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Requested Date & Time:</span>
              <span class="detail-value">${new Date(booking.date_time).toLocaleString('en-IN')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">${booking.address}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Oil Type:</span>
              <span class="detail-value">${oilName}</span>
            </div>
          </div>
          
          <div class="pending-info">
            <h4>⏰ What happens next?</h4>
            <ul>
              <li>We will review your booking request within 2-4 hours</li>
              <li>You will receive a confirmation email once approved</li>
              <li>Our team may contact you if any clarification is needed</li>
              <li>You can contact us anytime for updates</li>
            </ul>
          </div>
          
          <div class="contact-info">
            <h4>📞 Need immediate assistance?</h4>
            <p>If you have any urgent questions or need to make changes, please contact us:</p>
            <p><strong>Phone:</strong> +91 7875671417</p>
            <p><strong>WhatsApp:</strong> +91 7875671417</p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing FormaFit!</p>
            <p>We will confirm your booking soon.</p>
            <hr style="margin: 20px 0;">
            <p><small>This is an automated email. Please do not reply to this address.</small></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateConfirmedEmailContent(booking: any, serviceName: string, oilName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .contact-info { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .reminder { background: #fff3e0; border-left: 4px solid #ff9800; padding: 10px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Booking Confirmed!</h1>
          <p>Your massage appointment is confirmed and ready</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${booking.name}</strong>,</p>
          
          <p>Great news! Your massage booking has been confirmed and we're excited to provide you with a relaxing and therapeutic experience at your home.</p>
          
          <div class="booking-details">
            <h3>📋 Confirmed Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">#${booking.id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">${serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date & Time:</span>
              <span class="detail-value">${new Date(booking.date_time).toLocaleString('en-IN')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">${booking.address}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Oil Type:</span>
              <span class="detail-value">${oilName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Contact:</span>
              <span class="detail-value">${booking.contact}</span>
            </div>
          </div>
          
          <div class="reminder">
            <h4>⏰ Important Reminders:</h4>
            <ul>
              <li>Our certified therapist will arrive 10-15 minutes before your scheduled time</li>
              <li>Please ensure a clean, quiet space is available</li>
              <li>Have a towel or sheet ready for the massage</li>
              <li>Payment can be made in cash or online after the session</li>
            </ul>
          </div>
          
          <div class="contact-info">
            <h4>📞 Need to make changes?</h4>
            <p>If you need to reschedule or have any questions, please contact us immediately:</p>
            <p><strong>Phone:</strong> +91 7875671417</p>
            <p><strong>WhatsApp:</strong> +91 7875671417</p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing FormaFit!</p>
            <p>We look forward to providing you with an exceptional massage experience.</p>
            <hr style="margin: 20px 0;">
            <p><small>This is an automated email. Please do not reply to this address.</small></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCancelledEmailContent(booking: any, serviceName: string, oilName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Cancelled</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .contact-info { background: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .reschedule { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Booking Cancelled</h1>
          <p>Your massage appointment has been cancelled</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${booking.name}</strong>,</p>
          
          <p>We regret to inform you that your massage booking has been cancelled. We understand this may be disappointing and we apologize for any inconvenience caused.</p>
          
          <div class="booking-details">
            <h3>📋 Cancelled Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">#${booking.id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">${serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Original Date & Time:</span>
              <span class="detail-value">${new Date(booking.date_time).toLocaleString('en-IN')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">${booking.address}</span>
            </div>
          </div>
          
          <div class="reschedule">
            <h4>🔄 Would you like to reschedule?</h4>
            <p>We'd be happy to help you book a new appointment at a time that works better for you. Please contact us to reschedule:</p>
            <p><strong>Phone:</strong> +91 7875671417</p>
            <p><strong>WhatsApp:</strong> +91 7875671417</p>
          </div>
          
          <div class="contact-info">
            <h4>📞 Questions or Concerns?</h4>
            <p>If you have any questions about this cancellation or would like to discuss rescheduling, please don't hesitate to contact us:</p>
            <p><strong>Phone:</strong> +91 7875671417</p>
            <p><strong>WhatsApp:</strong> +91 7875671417</p>
          </div>
          
          <div class="footer">
            <p>Thank you for your understanding.</p>
            <p>We hope to serve you again soon!</p>
            <hr style="margin: 20px 0;">
            <p><small>This is an automated email. Please do not reply to this address.</small></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCompletedEmailContent(booking: any, serviceName: string, oilName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Service Completed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .feedback { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .next-steps { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Session Completed Successfully!</h1>
          <p>Your session has completed successfully</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${booking.name}</strong>,</p>
          
          <p>Your session has completed successfully! We hope you enjoyed your relaxing and therapeutic experience.</p>
          
          <div class="booking-details">
            <h3>📋 Completed Service Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">#${booking.id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">${serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Completed Date & Time:</span>
              <span class="detail-value">${new Date(booking.date_time).toLocaleString('en-IN')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Oil Type:</span>
              <span class="detail-value">${oilName}</span>
            </div>
          </div>
          
          <div class="next-steps">
            <h4>💆‍♀️ Post-Massage Care Tips:</h4>
            <ul>
              <li>Stay hydrated - drink plenty of water</li>
              <li>Rest for at least 30 minutes after the massage</li>
              <li>Avoid strenuous activities for the next few hours</li>
              <li>Take a warm bath or shower to enhance the benefits</li>
            </ul>
          </div>
          
          <div class="feedback">
            <h4>⭐ Share Your Experience</h4>
            <p>We'd love to hear about your experience! Your feedback helps us improve our services and helps other customers make informed decisions.</p>
            <p>Please take a moment to share your thoughts with us.</p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing FormaFit!</p>
            <p>We look forward to serving you again soon.</p>
            <hr style="margin: 20px 0;">
            <p><small>This is an automated email. Please do not reply to this address.</small></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateStatusUpdateEmailContent(booking: any, newStatus: string, serviceName: string, oilName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Status Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .contact-info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Booking Status Update</h1>
          <p>Your booking status has been updated</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${booking.name}</strong>,</p>
          
          <p>Your massage booking status has been updated to: <strong>${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</strong></p>
          
          <div class="booking-details">
            <h3>📋 Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">#${booking.id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">${serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date & Time:</span>
              <span class="detail-value">${new Date(booking.date_time).toLocaleString('en-IN')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">${booking.address}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Current Status:</span>
              <span class="detail-value"><strong>${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</strong></span>
            </div>
          </div>
          
          <div class="contact-info">
            <h4>📞 Questions?</h4>
            <p>If you have any questions about this status update, please contact us:</p>
            <p><strong>Phone:</strong> +91 7875671417</p>
            <p><strong>WhatsApp:</strong> +91 7875671417</p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing FormaFit!</p>
            <hr style="margin: 20px 0;">
            <p><small>This is an automated email. Please do not reply to this address.</small></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
} 