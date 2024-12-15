CREATE OR REPLACE FUNCTION update_user_review_count_and_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET review_count = review_count + 1,
    rating = (
        SELECT AVG(rating)
        FROM user_reviews
        WHERE reviewed_user_id = NEW.reviewed_user_id
    )
  WHERE id = NEW.reviewed_user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_review_count_and_rating
AFTER INSERT ON user_reviews
FOR EACH ROW
EXECUTE FUNCTION update_user_review_count_and_rating();