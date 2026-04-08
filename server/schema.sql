-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mock Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100),
  stream VARCHAR(50),
  score INT DEFAULT 0,
  results TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question Bank Table
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  category VARCHAR(50),
  difficulty VARCHAR(20),
  stream VARCHAR(50)
);

-- Recordings Table
CREATE TABLE IF NOT EXISTS recordings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INT REFERENCES users(id),
  interview_id INT REFERENCES interviews(id),
  video_url TEXT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
