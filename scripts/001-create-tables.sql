-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  party VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  candidate_id INTEGER REFERENCES candidates(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id) -- Ensures one vote per user
);

-- Insert sample candidates
INSERT INTO candidates (name, party) VALUES
  ('Alice Johnson', 'Progressive Party'),
  ('Bob Smith', 'Conservative Party'),
  ('Carol Williams', 'Independent')
ON CONFLICT DO NOTHING;

-- Insert a test user (password: "password123")
-- Hash generated with bcrypt for "password123"
INSERT INTO users (email, password_hash, name) VALUES
  ('test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User')
ON CONFLICT (email) DO NOTHING;
