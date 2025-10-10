import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/database';

// In-memory storage as fallback
const packageBookingsStore: any[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    contact: '9876543210',
    email: 'alice@example.com',
    packageName: 'Weekly 3 Sessions',
    packageId: 'weekly-3',
    date: '2024-01-20',
    time: '10:00',
    status: 'Confirmed',
    payment: 'Paid',
    amount: 2599,
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    console.log('🔍 Database connection status:', dbConnected);
    
    // Try to fetch from database
    if (dbConnected) {
      try {
        const dbResult = await query(`
          SELECT * FROM bookings 
          WHERE service_type LIKE 'Package:%' 
          ORDER BY created_at DESC
        `);
        
        const dbBookings = dbResult.rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          contact: row.contact,
          email: row.email,
          packageName: row.service_type.replace('Package: ', ''),
          packageId: row.oil_type === 'package-booking' ? 'weekly-3' : row.oil_type,
          date: row.date_time ? row.date_time.split(' ')[0] : '',
          time: row.date_time ? row.date_time.split(' ')[1] : '',
          status: row.status || 'Pending',
          payment: row.payment_status || 'Pending',
          amount: row.amount || 2599,
          createdAt: row.created_at
        }));
        
        console.log('✅ Fetched', dbBookings.length, 'package bookings from database');
        
        return NextResponse.json({
          success: true,
          bookings: dbBookings.length > 0 ? dbBookings : packageBookingsStore,
          source: dbBookings.length > 0 ? 'database' : 'memory'
        });
      } catch (dbError) {
        console.error('❌ Database fetch failed:', dbError);
      }
    }
    
    // Fallback to memory store
    return NextResponse.json({
      success: true,
      bookings: packageBookingsStore,
      source: 'memory'
    });
  } catch (error) {
    console.error('❌ GET package bookings error:', error);
    return NextResponse.json({
      success: true,
      bookings: packageBookingsStore,
      source: 'memory'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📦 Package booking API called');
    
    const body = await request.text();
    if (!body) {
      console.error('❌ Request body is empty');
      return NextResponse.json({
        success: false,
        message: 'Request body is empty'
      }, { status: 400 });
    }
    
    const { name, contact, email, packageId, packageName, date, time, status, payment, amount } = JSON.parse(body);
    console.log('📝 Received data:', { name, contact, email, packageId, packageName, date, time, status, payment, amount });

    // Validation
    if (!name || !contact || !email || !packageId || !date || !time) {
      console.error('❌ Missing required fields');
      return NextResponse.json({
        success: false,
        message: 'All required fields must be filled'
      }, { status: 400 });
    }

    if (contact.replace(/[^0-9]/g, '').length !== 10) {
      console.error('❌ Invalid contact number length');
      return NextResponse.json({
        success: false,
        message: 'Contact number must be exactly 10 digits'
      }, { status: 400 });
    }

    // Create new package booking in memory
    const newBooking = {
      id: packageBookingsStore.length + 1,
      name: name.trim(),
      contact: contact.replace(/[^0-9]/g, ''),
      email: email.toLowerCase().trim(),
      packageId: packageId.trim(),
      packageName: packageName.trim(),
      date,
      time,
      status: status || 'Pending',
      payment: payment || 'Pending',
      amount: amount || 2599,
      createdAt: new Date().toISOString()
    };

    console.log('💾 Saving to memory store...');
    packageBookingsStore.unshift(newBooking);

    // Save to main bookings table - THIS IS CRITICAL
    console.log('💾 Saving to database...');
    const dbResult = await query(`
      INSERT INTO bookings (name, contact, email, address, service_type, oil_type, date_time, payment_status, status, amount, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [
      newBooking.name,
      newBooking.contact,
      newBooking.email,
      'Package booking',
      `Package: ${newBooking.packageName}`,
      'package-booking',
      `${newBooking.date} ${newBooking.time}`,
      newBooking.payment,
      newBooking.status,
      newBooking.amount,
      new Date().toISOString(),
      new Date().toISOString()
    ]);
    
    if (dbResult.rows && dbResult.rows[0]) {
      newBooking.id = dbResult.rows[0].id;
      console.log('✅ Package booking saved to database with ID:', newBooking.id);
    } else {
      console.error('❌ No ID returned from database insert');
    }

    return NextResponse.json({
      success: true,
      message: 'Package booking created successfully',
      bookingId: newBooking.id
    });
  } catch (error) {
    console.error('❌ Package booking creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create package booking: ' + (error as Error).message
    }, { status: 500 });
  }
}