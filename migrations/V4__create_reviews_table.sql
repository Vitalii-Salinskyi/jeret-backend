ALTER TABLE users
  ALTER COLUMN rating TYPE FLOAT,
  ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE,
  ALTER COLUMN name TYPE VARCHAR(100),
  ALTER COLUMN password TYPE VARCHAR(60),
  ALTER COLUMN google_id TYPE VARCHAR(25);
  ADD COLUMN description TEXT;

ALTER TABLE users
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN rating SET DEFAULT 0.0,
  ALTER COLUMN name SET NOT NULL;

ALTER TABLE users
  ADD CONSTRAINT rating_check CHECK (rating BETWEEN 0.0 AND 5.0);

CREATE TABLE IF NOT EXISTS user_reviews (
    id INTEGER  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reviewed_user_id INTEGER NOT NULL,
    reviewer_user_id INTEGER NOT NULL,
    rating FLOAT NOT NULL CHECK (rating BETWEEN 0.0 AND 5.0),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_user_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT different_users_check CHECK (reviewed_user_id != reviewer_user_id)
);

CREATE INDEX idx_user_reviews_reviewed_user ON user_reviews(reviewed_user_id);
CREATE INDEX idx_user_reviews_reviewer ON user_reviews(reviewer_user_id);