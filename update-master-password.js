const { Pool } = require('pg');
const { createHash } = require('crypto');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'home_massage_service',
  user: 'postgres',
  password: 'Admin@1234',
});

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

async function updateMasterPassword() {
  try {
    console.log('🔄 Updating master password...');
    
    const client = await pool.connect();
    
    // Set password to "admin123"
    const newPassword = 'admin123';
    const hashedPassword = hashPassword(newPassword);
    
    await client.query(`
      UPDATE master_login 
      SET password_hash = $1, updated_at = NOW()
      WHERE username = 'admin'
    `, [hashedPassword]);
    
    console.log('✅ Master password updated successfully');
    console.log(`Username: admin`);
    console.log(`Password: ${newPassword}`);
    console.log(`Hash: ${hashedPassword}`);
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    await pool.end();
  }
}

updateMasterPassword();