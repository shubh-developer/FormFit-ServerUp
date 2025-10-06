import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// In-memory storage as fallback
const bookingsStore: any[] = [
  {
    id: 1,
    name: 'John Doe',
    contact: '9876543210',
    email: 'john@example.com',
    service: 'Full Body Massage',
    date: '2024-01-20',
    time: '10:00',
    status: 'Confirmed',
    payment: 'Paid',
    amount: 999,
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    // Fetch from actual database table
    const result = await query('SELECT * FROM bookings ORDER BY created_at DESC');
    if (result.rows && result.rows.length > 0) {
      return NextResponse.json({
        success: true,
        bookings: result.rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          contact: row.contact,
          email: row.email,
          dateOfBirth: row.date_of_birth,
          height: row.height,
          weight: row.weight,
          bloodGroup: row.blood_group,
          service: row.service_type,
          date: row.date_time ? new Date(row.date_time).toISOString().split('T')[0] : '',
          time: row.date_time ? new Date(row.date_time).toTimeString().split(' ')[0].substring(0, 5) : '',
          dateTime: row.date_time,
          status: row.status,
          payment: row.payment_status,
          amount: row.amount || 999,
          createdAt: row.created_at,
          address: row.address,
          oilType: row.oil_type,
          injuryNote: row.injury_note,
          painAreas: row.pain_areas,
          isUrgent: row.is_urgent
        }))
      });
    }
  } catch (error) {
    console.log('Database fetch failed, using in-memory:', error);
  }
  
  // Fallback to in-memory
  return NextResponse.json({
    success: true,
    bookings: bookingsStore
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    console.log('📥 Received booking request:', body);
    
    if (!body) {
      return NextResponse.json({
        success: false,
        message: 'Request body is empty'
      }, { status: 400 });
    }
    
    const data = JSON.parse(body);
    console.log('📋 Parsed booking data:', data);
    
    const { name, contact, email, service, date, time, status, payment, amount, packageId, serviceType, dateTime, fitnessService } = data;

    // Handle different booking types
    const bookingService = service || serviceType || fitnessService || 'Unknown Service';
    const bookingDate = date || (dateTime ? new Date(dateTime).toISOString().split('T')[0] : null);
    const bookingTime = time || (dateTime ? new Date(dateTime).toTimeString().split(' ')[0].substring(0, 5) : null);

    // Validation
    if (!name || !contact || !email || !bookingService || !bookingDate || !bookingTime) {
      const missing = [];
      if (!name) missing.push('name');
      if (!contact) missing.push('contact');
      if (!email) missing.push('email');
      if (!bookingService) missing.push('service');
      if (!bookingDate) missing.push('date');
      if (!bookingTime) missing.push('time');
      
      console.log('❌ Validation failed: Missing required fields:', missing.join(', '));
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      }, { status: 400 });
    }

    if (contact.replace(/[^0-9]/g, '').length !== 10) {
      console.log('❌ Validation failed: Invalid phone number');
      return NextResponse.json({
        success: false,
        message: 'Contact number must be exactly 10 digits'
      }, { status: 400 });
    }

    // Create new booking
    const newBooking = {
      id: Date.now(), // Use timestamp as ID for uniqueness
      name: name.trim(),
      contact: contact.replace(/[^0-9]/g, ''),
      email: email.toLowerCase().trim(),
      service: bookingService.trim(),
      date: bookingDate,
      time: bookingTime,
      status: status || 'Pending',
      payment: payment || 'Pending',
      amount: amount || 999,
      packageId: packageId || null,
      createdAt: new Date().toISOString()
    };

    // Save to existing database table
    let dbSaved = false;
    try {
      // Insert into existing bookings table with correct column names
      const dbResult = await query(`
        INSERT INTO bookings (name, contact, email, address, service_type, oil_type, date_time, payment_status, status, amount)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `, [
        newBooking.name,
        newBooking.contact, 
        newBooking.email,
        data.address || 'Home address',
        newBooking.service,
        data.oilType || 'ayurvedic-herbal',
        `${newBooking.date} ${newBooking.time}`,
        newBooking.payment,
        newBooking.status,
        newBooking.amount
      ]);
      
      if (dbResult.rows && dbResult.rows[0]) {
        newBooking.id = dbResult.rows[0].id;
      }
      
      dbSaved = true;
      console.log('✅ BOOKING SAVED TO DATABASE:', newBooking.id);
      
      // Send confirmation email
      try {
        console.log('📧 Attempting to send email to:', newBooking.email);
        const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: newBooking.email,
            subject: 'Booking Confirmation - FormaFit Therapy',
            type: 'booking_confirmation',
            bookingData: {
              name: newBooking.name,
              service: newBooking.service,
              date: newBooking.date,
              time: newBooking.time,
              bookingId: newBooking.id,
              address: data.address || 'Home address',
              contact: newBooking.contact,
              oilType: data.oilType || data.nutritionGuide || 'Standard',
              amount: newBooking.amount
            }
          })
        });
        
        const emailResult = await emailResponse.json();
        console.log('📧 Email API response:', emailResult);
        
        if (emailResult.success) {
          console.log('✅ Confirmation email sent successfully');
        } else {
          console.error('❌ Email API returned error:', emailResult.message);
        }
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
      }
    } catch (dbError) {
      console.error('❌ DATABASE ERROR:', dbError);
      console.error('❌ Error details:', dbError instanceof Error ? dbError.message : 'Unknown error');
      console.error('❌ Error code:', (dbError as any).code);
    }

    // Always save to memory as backup
    bookingsStore.unshift(newBooking);

    console.log('✅ Booking created successfully:', {
      id: newBooking.id,
      name: newBooking.name,
      dbSaved
    });
    
    return NextResponse.json({
      success: true,
      message: dbSaved ? 'Booking saved to database successfully' : 'Booking saved to memory (database unavailable)',
      bookingId: newBooking.id,
      dbSaved
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create booking: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}