const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'home_massage_service',
  user: 'postgres',
  password: 'Admin@1234',
});

async function createPackagesTable() {
  try {
    console.log('🔄 Creating packages table...');
    
    const client = await pool.connect();
    
    // Create packages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        package_type VARCHAR(50) DEFAULT 'massage',
        title VARCHAR(255) NOT NULL,
        description TEXT,
        discount_percentage INTEGER DEFAULT 0,
        original_price INTEGER NOT NULL,
        discounted_price INTEGER NOT NULL,
        sessions INTEGER NOT NULL,
        validity_days INTEGER NOT NULL,
        features JSONB,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Packages table created');
    
    // Insert default packages
    await client.query(`
      INSERT INTO packages (title, original_price, discounted_price, sessions, validity_days, features, package_type)
      VALUES 
        ('Weekly 3 Sessions', 2997, 2599, 3, 7, '["3 Full Body Massages", "Home Service", "Professional Therapist", "All Equipment Provided"]', 'massage'),
        ('Monthly 10 Sessions', 9990, 8499, 10, 30, '["10 Full Body Massages", "Home Service", "Professional Therapist", "All Equipment Provided", "Best Value Package"]', 'massage')
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ Default packages inserted');
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error creating packages table:', error);
  } finally {
    await pool.end();
  }
}

createPackagesTable();