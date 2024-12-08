CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ip_address VARCHAR(255),
    device VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

DROP INDEX IF EXISTS idx_users_name;
DROP INDEX IF EXISTS idx_users_rating;
DROP INDEX IF EXISTS idx_users_job_role;
DROP INDEX IF EXISTS idx_users_followers_count;
DROP INDEX IF EXISTS idx_users_tasks_completed;
DROP INDEX IF EXISTS idx_users_is_deleted;

DROP INDEX IF EXISTS idx_sessions_user_id;

CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_rating ON users(rating);
CREATE INDEX idx_users_job_role ON users(job_role);
CREATE INDEX idx_users_followers_count ON users(followers_count);
CREATE INDEX idx_users_tasks_completed ON users(tasks_completed);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);