CREATE TYPE task_status AS (
  pending INTEGER,
  progress INTEGER,
  completed INTEGER,
  review INTEGER
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255) NOT NULL,
  members_count INTEGER DEFAULT 0,
  status task_status DEFAULT (0, 0, 0, 0),
  owner_id INTEGER,
  
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  
  CONSTRAINT unique_project_name_per_owner UNIQUE (name, owner_id)
);

CREATE TABLE IF NOT EXISTS projects_members (
  project_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (project_id, member_id),
  
  FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_projects_owner_id ON projects(owner_id);

CREATE INDEX idx_projects_members_project_id ON projects_members(project_id);
CREATE INDEX idx_projects_members_member_id ON projects_members(member_id);

CREATE OR REPLACE FUNCTION update_members_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects
    SET members_count = members_count + 1
    WHERE id = NEW.project_id;

  ELSIF TG_OP = 'DELETE' THEN
     UPDATE projects
     SET members_count = members_count - 1
     WHERE id = OLD.project_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_members_insert_or_update
AFTER INSERT OR DELETE ON projects_members
FOR EACH ROW
EXECUTE FUNCTION update_members_count();

CREATE OR REPLACE FUNCTION create_initial_member()
RETURNS TRIGGER AS $$
BEGIN
     INSERT INTO projects_members
     (project_id, member_id)
     VALUES (NEW.id, NEW.owner_id);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_project_create
AFTER INSERT ON projects
FOR EACH ROW
EXECUTE FUNCTION create_initial_member();