-- ============================================
-- MIGRATION: 20260826120000_initial_schema
-- UP
-- ============================================

-- Note: Supabase gives you a dedicated database.
-- No "CREATE DATABASE" or "USE" statements are needed in PostgreSQL.

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,                          -- PostgreSQL equivalent of AUTO_INCREMENT
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(128) NOT NULL,
    category VARCHAR(128) NOT NULL,
    type VARCHAR(64) NOT NULL,
    salary VARCHAR(64) DEFAULT NULL,
    remote BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CVs table
CREATE TABLE IF NOT EXISTS cvs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    cover_letter TEXT,
    status VARCHAR(64) NOT NULL DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- ============================================
-- DOWN (Rollback - run this to undo the migration)
-- ============================================
-- DROP TABLE IF EXISTS applications;
-- DROP TABLE IF EXISTS cvs;
-- DROP TABLE IF EXISTS jobs;
-- DROP TABLE IF EXISTS users;