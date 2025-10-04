const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/massage_service',
});

async function createUserTables() {
  const client = await pool.connect();
  
  try {
    console.log('Creating user authentication tables...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created');
    
    // Create user_sessions table for tracking user logins
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ip_address VARCHAR(45),
        user_agent TEXT,
        login_time TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ User sessions table created');
    
    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    console.log('✅ Email index created');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
    `);
    console.log('✅ User sessions index created');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_login_time ON user_sessions(login_time);
    `);
    console.log('✅ Login time index created');
    
    console.log('\n🎉 User authentication tables created successfully!');
    console.log('\nTables created:');
    console.log('- users: Store user account information');
    console.log('- user_sessions: Track user login sessions');
    console.log('\nIndexes created for optimal performance');
    
  } catch (error) {
    console.error('❌ Error creating user tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the script
createUserTables()
  .then(() => {
    console.log('\n✅ Database setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  });

