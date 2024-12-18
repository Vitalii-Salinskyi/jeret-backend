CREATE OR REPLACE FUNCTION update_profile_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_role IS NOT NULL AND NEW.description IS NOT NULL THEN
    NEW.profile_completed := TRUE;
  ELSE
    NEW.profile_completed := FALSE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_completed
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_profile_completed();