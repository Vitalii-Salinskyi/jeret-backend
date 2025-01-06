import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class ChatsService {
  constructor(private readonly dbService: DatabaseService) {}

  async getUsersChats(userId: number) {
    const query = `
      SELECT cp.chat_id, u.id AS user_id, u.name, u.job_role, u.profile_picture,
      CASE
        WHEN lm.message IS NOT NULL THEN
          jsonb_build_object(
            'sender_id', lm.sender_id,
            'message', lm.message,
            'seen', lm.seen,
            'created_at', lm.created_at,
            'files_attached', lm.files_attached,
            'id', lm.id
          )
        ELSE NULL
      END AS last_message
      FROM chat_participants cp
      INNER JOIN users u ON u.id = cp.user_id
      LEFT JOIN LATERAL (
        SELECT m.message, m.seen, m.created_at, m.sender_id, m.id, m.files_attached
        FROM messages m
        WHERE m.chat_id = cp.chat_id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) lm ON TRUE
      WHERE cp.chat_id IN (
        SELECT chat_id
        FROM chat_participants
        WHERE user_id = $1
      )
      AND cp.user_id != $1;
    `;

    try {
      const result = await this.dbService.query(query, [userId]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async getChatMessages(chatId: number) {
    const query = `
      SELECT m.*,
      COALESCE (
        (
          SELECT jsonb_agg(row_to_json(f))
          FROM files f
          WHERE f.message_id = m.id
        ),
        NULL
      ) AS files
      FROM messages m
      WHERE chat_id = $1
      ORDER BY created_at ASC
    `;

    try {
      const result = await this.dbService.query(query, [chatId]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}
