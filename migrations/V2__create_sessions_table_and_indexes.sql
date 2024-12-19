CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    device VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_rating ON users(rating);
CREATE INDEX idx_users_job_role ON users(job_role);
CREATE INDEX idx_users_followers_count ON users(followers_count);
CREATE INDEX idx_users_tasks_completed ON users(tasks_completed);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);
CREATE INDEX idx_users_profile_completed ON users(profile_completed);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);