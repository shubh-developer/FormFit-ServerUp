import { Pool, PoolClient } from 'pg';

// Database configuration - Use DATABASE_URL if available (for Vercel/Supabase), otherwise use individual env vars
const dbConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  maxUses: 7500,
} : {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'home_massage_service',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxUses: 7500,
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('❌ Config:', process.env.DATABASE_URL ? 'Using DATABASE_URL' : 'Using individual env vars');
    return false;
  }
}

// Get a client from the pool
export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

// Execute a query with parameters and security measures
export async function query(text: string, params?: unknown[]): Promise<any> {
  const client = await getClient();
  try {
    // Validate and sanitize parameters
    const sanitizedParams = params?.map(param => {
      if (typeof param === 'string') {
        // Prevent SQL injection
        const dangerousPatterns = [
          /union\s+select/gi,
          /drop\s+table/gi,
          /insert\s+into/gi,
          /delete\s+from/gi,
          /update\s+set/gi,
          /alter\s+table/gi,
          /create\s+table/gi,
          /exec\s*\(/gi,
          /xp_cmdshell/gi,
          /sp_executesql/gi
        ];
        
        let sanitized = param;
        dangerousPatterns.forEach(pattern => {
          sanitized = sanitized.replace(pattern, '');
        });
        
        return sanitized;
      }
      return param;
    });
    
    console.log('🔍 Executing query:', text.substring(0, 100) + '...');
    
    const result = await client.query(text, sanitizedParams);
    console.log('✅ Query successful, rows affected:', result.rowCount);
    return result;
  } catch (error) {
    console.error('❌ [DB] Query error:', error);
    console.error('❌ Query text:', text);
    console.error('❌ Query params:', params);
    throw error;
  } finally {
    client.release();
  }
}

// Initialize database tables
export async function initializeDatabase(): Promise<void> {
  try {
    // Initializing database tables

    // Create bookings table
    await query(`
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
        payment_method VARCHAR(20),
        transaction_id VARCHAR(255),
        payment_proof TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        therapist_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add new payment columns to existing bookings table
    await query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20),
      ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS payment_proof TEXT,
      ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2) DEFAULT 999.00
    `);

    // Add new health fields to existing bookings table
    await query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS date_of_birth DATE,
      ADD COLUMN IF NOT EXISTS height INTEGER,
      ADD COLUMN IF NOT EXISTS weight INTEGER,
      ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10),
      ADD COLUMN IF NOT EXISTS nutrition_guide VARCHAR(20)
    `);

    // Create inquiries table
    await query(`
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

    // Create feedback table
    await query(`
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

    // Create feedback security audit table
    await query(`
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

    // Create admin sessions table
    await query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        logout_time TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);

    // Create services table
    await query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        duration VARCHAR(20) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        benefits JSONB NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table for client authentication
    await query(`
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

    // Ensure password_hash column exists and is NOT NULL (for existing tables)
    await query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    `);
    await query(`
      ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
    `);

    // Create admin_users table for admin authentication
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create client_sessions table
    await query(`
      CREATE TABLE IF NOT EXISTS client_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        logout_time TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP NOT NULL
      )
    `);

    // Create user_sessions table for our authentication system
    await query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ip_address VARCHAR(45),
        user_agent TEXT,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create oils table
    await query(`
      CREATE TABLE IF NOT EXISTS oils (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        benefits JSONB NOT NULL,
        best_for JSONB NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create packages table
    await query(`
      CREATE TABLE IF NOT EXISTS packages (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sessions INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        discount INTEGER,
        duration VARCHAR(50) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create real-time tracking table
    await query(`
      CREATE TABLE IF NOT EXISTS real_time_data (
        id SERIAL PRIMARY KEY,
        metric_name VARCHAR(100) NOT NULL,
        metric_value JSONB NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create therapist availability table
    await query(`
      CREATE TABLE IF NOT EXISTS therapist_availability (
        id SERIAL PRIMARY KEY,
        therapist_id VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(therapist_id, date, start_time)
      )
    `);

    // Create appointment tracking table
    await query(`
      CREATE TABLE IF NOT EXISTS appointment_tracking (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id),
        status VARCHAR(50) NOT NULL,
        notes TEXT,
        therapist_id VARCHAR(50),
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default services if they don't exist
    await query(`
      INSERT INTO services (id, name, duration, price, description, benefits) 
      VALUES 
        ('full-body', 'Full Body Massage', '60 mins', 999.00, 'Complete body relaxation and rejuvenation therapy', '["Relieves full body tension", "Improves blood circulation", "Reduces stress and anxiety", "Promotes better sleep", "Enhances overall wellness"]'),
        ('upper-body', 'Upper Body Massage', '30 mins', 499.00, 'Focused therapy for neck, shoulders, arms, and back', '["Relieves neck and shoulder pain", "Reduces upper back tension", "Improves posture", "Alleviates arm fatigue", "Perfect for desk workers"]'),
        ('lower-body', 'Lower Body Massage', '30 mins', 499.00, 'Therapeutic massage for legs, feet, and lower back', '["Relieves leg fatigue", "Reduces lower back pain", "Improves foot circulation", "Alleviates muscle soreness", "Great for athletes"]'),
        ('head-massage', 'Head Massage', '15-20 mins', 399.00, 'Soothing scalp and head massage for instant relief', '["Relieves headaches", "Reduces stress", "Improves hair health", "Promotes relaxation", "Quick stress buster"]'),
        ('injury-therapy', 'Injury-Specific Therapy', 'Custom', 799.00, 'Specialized therapy for specific injuries and pain areas', '["Targeted pain relief", "Faster injury recovery", "Professional assessment", "Customized treatment", "Long-term healing"]')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        duration = EXCLUDED.duration,
        price = EXCLUDED.price,
        description = EXCLUDED.description,
        benefits = EXCLUDED.benefits,
        updated_at = CURRENT_TIMESTAMP
    `);

    // Insert default oils if they don't exist
    await query(`
      INSERT INTO oils (id, name, description, benefits, best_for) 
      VALUES 
        ('ayurvedic-herbal', 'Ayurvedic Herbal Oil', 'Traditional Ayurvedic blend for holistic healing', '["Natural healing properties", "Deep tissue penetration", "Anti-inflammatory effects", "Balances body energies"]', '["pain-relief", "injury-recovery", "general wellness"]'),
        ('pain-relief', 'Pain Relief Oil', 'Specialized oil for muscle and joint pain relief', '["Targeted pain relief", "Muscle relaxation", "Anti-inflammatory", "Quick pain reduction"]', '["pain-relief", "injury-recovery"]'),
        ('relaxation', 'Relaxation Oil', 'Lavender and Eucalyptus blend for deep relaxation', '["Deep relaxation", "Stress reduction", "Aromatherapy benefits", "Better sleep quality"]', '["relaxation", "stress-relief"]'),
        ('coconut', 'Coconut Oil', 'Pure natural coconut oil for gentle massage', '["Natural and gentle", "Skin nourishment", "No artificial additives", "Suitable for sensitive skin"]', '["rejuvenation", "skin-care", "sensitive-skin"]'),
        ('therapist-choice', 'Therapist Choice', 'Let our expert therapist choose the best oil for your needs', '["Professional recommendation", "Tailored to your condition", "Optimal results", "Expert selection"]', '["all-purposes"]')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        benefits = EXCLUDED.benefits,
        best_for = EXCLUDED.best_for,
        updated_at = CURRENT_TIMESTAMP
    `);

    // Insert default packages if they don't exist
    await query(`
      INSERT INTO packages (id, name, sessions, price, original_price, discount, duration, description) 
      VALUES 
        ('weekly-3', 'Weekly 3 Sessions', 3, 2599.00, 2997.00, 13, '1 Week', 'Perfect for regular wellness maintenance'),
        ('monthly-10', 'Monthly 10 Sessions', 10, 8499.00, 9990.00, 15, '1 Month', 'Best value for long-term wellness commitment')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        sessions = EXCLUDED.sessions,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        discount = EXCLUDED.discount,
        duration = EXCLUDED.duration,
        description = EXCLUDED.description,
        updated_at = CURRENT_TIMESTAMP
    `);

    // Database tables initialized successfully
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Real-time data functions
export async function updateRealTimeData(metricName: string, metricValue: any): Promise<void> {
  await query(`
    INSERT INTO real_time_data (metric_name, metric_value)
    VALUES ($1, $2)
  `, [metricName, JSON.stringify(metricValue)]);
}

export async function getRealTimeData(metricName: string, limit: number = 100): Promise<any[]> {
  const result = await query(`
    SELECT * FROM real_time_data 
    WHERE metric_name = $1 
    ORDER BY timestamp DESC 
    LIMIT $2
  `, [metricName, limit]);
  return result.rows;
}

export async function getDashboardStats(): Promise<any> {
  const stats = await query(`
    SELECT 
      (SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURRENT_DATE) as today_bookings,
      (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
      (SELECT COUNT(*) FROM inquiries WHERE status = 'new') as new_inquiries,
      (SELECT AVG(rating) FROM feedback) as avg_rating,
      (SELECT COUNT(*) FROM feedback) as total_feedback
  `);
  return stats.rows[0];
}

// Close the pool when the application shuts down
export async function closePool(): Promise<void> {
  await pool.end();
}

// Export the pool for direct access if needed
export { pool }; 