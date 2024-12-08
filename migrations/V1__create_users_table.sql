DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_roles') THEN
    CREATE TYPE job_roles AS ENUM (
      'Project Manager',
      'Front-end Developer',
      'Back-end Developer',
      'Web Developer',
      'Android Developer',
      'IOS Developer',
      'UI/UX Design',
      '3D Design',
      '2D Design'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  profile_picture VARCHAR(255),
  job_role job_roles,
  password VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  profile_completed BOOLEAN DEFAULT FALSE,
  tasks_completed INTEGER DEFAULT 0,
  tasks_pending INTEGER DEFAULT 0,
  is_online BOOLEAN DEFAULT FALSE,
  followers_count INTEGER DEFAULT 0,
  followed INTEGER DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);