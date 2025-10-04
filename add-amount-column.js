const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'home_massage_service',
  user: 'postgres',
  password: 'Admin@1234',
});

async function addAmountColumn() {
  try {
    console.log('🔄 Adding amount column to bookings table...');
    
    const client = await pool.connect();
    
    // Add amount column if it doesn't exist
    await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2) DEFAULT 999.00
    `);
    
    console.log('✅ Amount column added to bookings table');
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error adding amount column:', error);
  } finally {
    await pool.end();
  }
}

addAmountColumn();