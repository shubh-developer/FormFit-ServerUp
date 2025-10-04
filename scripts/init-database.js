#!/usr/bin/env node

/**
 * Database Initialization Script
 * 
 * This script ensures all required database tables exist,
 * including the feedback security audit table.
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'home_massage_service',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Initializing database tables...');
    
    // Create feedback table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        booking_id INTEGER REFERENCES bookings(id) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(15) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(booking_id)
      )
    `);
    console.log('✅ Feedback table created/verified');

    // Create feedback security audit table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback_security_audit (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id),
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(15) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        action_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Feedback security audit table created/verified');

    // Create bookings table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        contact VARCHAR(15) NOT NULL,
        email VARCHAR(255) NOT NULL,
        service VARCHAR(100) NOT NULL,
        booking_date DATE NOT NULL,
        booking_time TIME NOT NULL,
        photo_url TEXT,
        status VARCHAR(20) DEFAULT 'Pending',
        payment_status VARCHAR(20) DEFAULT 'Pending',
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Bookings table created/verified');

    // Create admin_users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15),
        address TEXT,
        photo_url VARCHAR(500),
        pan_card VARCHAR(10),
        aadhar_card VARCHAR(12),
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admin users table created/verified');

    // Create inquiries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Inquiries table created/verified');

    // Create offers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        discount VARCHAR(50) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        valid_until DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Offers table created/verified');

    // Create users table (for client authentication)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('📋 Tables ready:');
    console.log('   - bookings');
    console.log('   - admin_users');
    console.log('   - inquiries');
    console.log('   - offers');
    console.log('   - users');
    console.log('   - feedback');
    console.log('   - feedback_security_audit');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('\n✅ Database is ready for the feedback system!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed to initialize database:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase }; 