const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function modifyFeedbackTable() {
  try {
    console.log('Modifying feedback table to allow simple reviews...');
    
    // Make booking_id nullable
    await pool.query(`
      ALTER TABLE feedback ALTER COLUMN booking_id DROP NOT NULL;
    `);
    
    // Make client_email nullable
    await pool.query(`
      ALTER TABLE feedback ALTER COLUMN client_email DROP NOT NULL;
    `);
    
    // Make client_phone nullable
    await pool.query(`
      ALTER TABLE feedback ALTER COLUMN client_phone DROP NOT NULL;
    `);
    
    // Remove unique constraint on booking_id
    await pool.query(`
      ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_booking_id_key;
    `);
    
    console.log('✅ Feedback table modified successfully!');
  } catch (error) {
    console.error('❌ Error modifying feedback table:', error);
  } finally {
    await pool.end();
  }
}

modifyFeedbackTable();