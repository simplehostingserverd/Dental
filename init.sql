-- Cognident Database Initialization Script
-- This script sets up the initial database structure and data

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    author VARCHAR(100) NOT NULL,
    category_id INTEGER REFERENCES blog_categories(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Create admin users table for blog management
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('patient', 'dentist', 'employee', 'admin')),
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_type VARCHAR(20),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Patient Care', 'patient-care', 'Tips and best practices for patient care and experience'),
('Technology', 'technology', 'Latest dental technology and digital innovations'),
('Business', 'business', 'Practice management and business growth strategies'),
('Compliance', 'compliance', 'HIPAA, regulations, and legal compliance'),
('Marketing', 'marketing', 'Patient acquisition and practice marketing')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, status, featured_image, published_at) VALUES
(
    '10 Ways to Improve Patient Experience in Your Dental Practice',
    '10-ways-improve-patient-experience',
    'Discover proven strategies to enhance patient satisfaction and build lasting relationships that drive practice growth.',
    '<p>Patient experience is the cornerstone of a successful dental practice. In today''s competitive healthcare landscape, providing exceptional patient care goes beyond clinical excellence—it encompasses every touchpoint of the patient journey.</p><h2>1. Streamline Your Appointment Scheduling</h2><p>Modern patients expect convenience and flexibility when booking appointments. Implement online scheduling systems that allow patients to book, reschedule, or cancel appointments 24/7.</p>',
    'Dr. Sarah Johnson',
    (SELECT id FROM blog_categories WHERE slug = 'patient-care'),
    'published',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
    'The Complete Guide to HIPAA Compliance for Dental Practices',
    'complete-guide-hipaa-compliance',
    'Everything you need to know about maintaining HIPAA compliance in your dental practice, from patient records to digital communications.',
    '<p>HIPAA compliance is not optional for dental practices—it''s a legal requirement that protects patient privacy and your practice from costly violations.</p><h2>Understanding HIPAA Basics</h2><p>The Health Insurance Portability and Accountability Act (HIPAA) establishes national standards for protecting patient health information.</p>',
    'Michael Chen',
    (SELECT id FROM blog_categories WHERE slug = 'compliance'),
    'published',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    CURRENT_TIMESTAMP - INTERVAL '8 days'
)
ON CONFLICT (slug) DO NOTHING;

-- Create default admin user (password: cognident2024)
-- Note: In production, change this password immediately
INSERT INTO admin_users (username, password_hash, email, role) VALUES
(
    'admin',
    crypt('cognident2024', gen_salt('bf')),
    'admin@cognident.org',
    'admin'
)
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cognident_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cognident_user;
