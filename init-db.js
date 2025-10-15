const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id BIGINT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact VARCHAR(15) NOT NULL,
        email VARCHAR(255) NOT NULL,
        service VARCHAR(500) NOT NULL,
        date VARCHAR(20) NOT NULL,
        time VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'Pending',
        payment VARCHAR(20) DEFAULT 'Pending',
        amount INTEGER DEFAULT 999,
        package_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Bookings table created/verified');
    
    // Check existing bookings
    const result = await client.query('SELECT COUNT(*) as count FROM bookings');
    console.log(`📊 Current bookings in database: ${result.rows[0].count}`);
    
    client.release();
    console.log('✅ Database initialization complete');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await pool.end();
  }
}

initDatabase();