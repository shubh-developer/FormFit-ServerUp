-- Create master_login_attempts table for tracking login activity
CREATE TABLE IF NOT EXISTS master_login_attempts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45), -- Supports both IPv4 and IPv6
    user_agent TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'blocked')),
    email_sent BOOLEAN DEFAULT FALSE,
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_master_login_username ON master_login_attempts(username);
CREATE INDEX IF NOT EXISTS idx_master_login_status ON master_login_attempts(status);
CREATE INDEX IF NOT EXISTS idx_master_login_created_at ON master_login_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_master_login_ip ON master_login_attempts(ip_address);

-- Add comments for documentation
COMMENT ON TABLE master_login_attempts IS 'Tracks all master admin login attempts with security logging';
COMMENT ON COLUMN master_login_attempts.username IS 'Username attempted during login';
COMMENT ON COLUMN master_login_attempts.ip_address IS 'IP address of the login attempt';
COMMENT ON COLUMN master_login_attempts.user_agent IS 'Browser/device information';
COMMENT ON COLUMN master_login_attempts.status IS 'Login result: success, failed, or blocked';
COMMENT ON COLUMN master_login_attempts.email_sent IS 'Whether security alert email was sent';
COMMENT ON COLUMN master_login_attempts.whatsapp_sent IS 'Whether security alert WhatsApp was sent';
COMMENT ON COLUMN master_login_attempts.created_at IS 'Timestamp of the login attempt';