import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// In-memory storage as fallback
let packageBookingsStore: any[] = [
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
  return NextResponse.json({
    success: true,
    bookings: packageBookingsStore
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    if (!body) {
      return NextResponse.json({
        success: false,
        message: 'Request body is empty'
      }, { status: 400 });
    }
    
    const { name, contact, email, packageId, packageName, date, time, status, payment, amount } = JSON.parse(body);

    // Validation
    if (!name || !contact || !email || !packageId || !date || !time) {
      return NextResponse.json({
        success: false,
        message: 'All required fields must be filled'
      }, { status: 400 });
    }

    if (contact.replace(/[^0-9]/g, '').length !== 10) {
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

    packageBookingsStore.unshift(newBooking);

    // Also try to save to database
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS package_bookings (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          contact VARCHAR(15) NOT NULL,
          email VARCHAR(255) NOT NULL,
          package_id VARCHAR(50) NOT NULL,
          package_name VARCHAR(255) NOT NULL,
          date VARCHAR(20) NOT NULL,
          time VARCHAR(20) NOT NULL,
          status VARCHAR(20) DEFAULT 'Pending',
          payment VARCHAR(20) DEFAULT 'Pending',
          amount INTEGER DEFAULT 2599,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await query(`
        INSERT INTO package_bookings (name, contact, email, package_id, package_name, date, time, status, payment, amount)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [newBooking.name, newBooking.contact, newBooking.email, newBooking.packageId, newBooking.packageName, newBooking.date, newBooking.time, newBooking.status, newBooking.payment, newBooking.amount]);
    } catch (dbError) {
      console.log('Database save failed, using in-memory only:', dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Package booking created successfully'
    });
  } catch (error) {
    console.error('Package booking creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create package booking'
    }, { status: 500 });
  }
}