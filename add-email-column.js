const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'home_massage_service',
  user: 'postgres',
  password: 'Admin@1234',
});

async function addEmailColumn() {
  try {
    console.log('🔄 Adding email column to inquiries table...');
    
    const client = await pool.connect();
    
    // Add email column if it doesn't exist
    await client.query(`
      ALTER TABLE inquiries 
      ADD COLUMN IF NOT EXISTS email VARCHAR(255)
    `);
    
    console.log('✅ Email column added to inquiries table');
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error adding email column:', error);
  } finally {
    await pool.end();
  }
}

addEmailColumn();