CREATE OR REPLACE FUNCTION create_chat_on_follow()
RETURNS TRIGGER AS $$
DECLARE
  existing_chat_id INTEGER;
  new_chat_id INTEGER;
BEGIN

  SELECT DISTINCT cp1.chat_id INTO existing_chat_id
  FROM chat_participants cp1
  JOIN chat_participants cp2 on cp2.chat_id = cp1.chat_id
  WHERE
    (cp1.user_id = NEW.follower_id AND cp2.user_id = NEW.following_id)
  OR
    (cp1.user_id = NEW.following_id AND cp2.user_id = NEW.follower_id);

  IF existing_chat_id IS NULL THEN
    INSERT INTO chats DEFAULT VALUES RETURNING id INTO new_chat_id;

    INSERT INTO chat_participants (chat_id, user_id)
    VALUES (new_chat_id, NEW.follower_id), (new_chat_id, NEW.following_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_follow_create_chat
AFTER INSERT ON followers
FOR EACH ROW
EXECUTE FUNCTION create_chat_on_follow();