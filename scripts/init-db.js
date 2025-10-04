const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'home_massage_service',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
};

const pool = new Pool(dbConfig);

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Initializing database tables...');
    
    // Create users table with correct schema
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        address TEXT,
        date_of_birth DATE,
        emergency_contact VARCHAR(255),
        medical_conditions TEXT,
        allergies TEXT,
        preferences JSONB,
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/updated');

    // Create user_sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ip_address VARCHAR(45),
        user_agent TEXT,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ User sessions table created/updated');

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact VARCHAR(15) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        service_type VARCHAR(50) NOT NULL,
        oil_type VARCHAR(50) NOT NULL,
        date_time TIMESTAMP NOT NULL,
        injury_note TEXT,
        pain_areas JSONB,
        wellness_assessment JSONB,
        is_urgent BOOLEAN DEFAULT FALSE,
        payment_status VARCHAR(20) DEFAULT 'pending',
        status VARCHAR(20) DEFAULT 'pending',
        therapist_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Bookings table created/updated');

    // Create inquiries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new',
        response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Inquiries table created/updated');

    // Create feedback table
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
    console.log('✅ Feedback table created/updated');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    console.log('✅ Email index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
    `);
    console.log('✅ User sessions index created');

    console.log('\n🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('\n✅ Database setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  });

