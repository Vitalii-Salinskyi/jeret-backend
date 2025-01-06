import { Injectable } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { StorageService } from "src/storage/storage.service";

import { SaveMessageDto } from "./dtos/save-message.dto";
import { EditMessageDto } from "./dtos/edit-message.dto";
import { FilesService } from "./files.service";

@Injectable()
export class MessagesService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly filesService: FilesService,
  ) {}

  async saveMessage(saveMessageDto: SaveMessageDto) {
    const { chat_id, created_at, message, sender_id, id: message_id, files } = saveMessageDto;

    const query = `
      INSERT INTO messages
      (sender_id, chat_id, message, created_at, id ${files.length ? ", files_attached" : ""})
      OVERRIDING SYSTEM VALUE
      VALUES ($1, $2, $3, $4, $5${files.length ? ",TRUE" : ""});
    `;

    if (files.length) {
      await this.filesService.createFileRecords(files, sender_id, message_id);
    }

    try {
      await this.dbService.query(query, [sender_id, chat_id, message, created_at, message_id]);
    } catch (error) {
      throw error;
    }
  }

  async bulkSaveMessages(messages: SaveMessageDto[]) {
    const query = `
      INSERT INTO messages (sender_id, chat_id, message, created_at)
      SELECT * FROM UNNEST($1::int[], $2::int[], $3::text[], $4::timestamp[]);
    `;

    const senderIds = messages.map((m) => m.sender_id);
    const chatIds = messages.map((m) => m.chat_id);
    const messageTexts = messages.map((m) => m.message);
    const createdAts = messages.map((m) => m.created_at);

    try {
      await this.dbService.query(query, [senderIds, chatIds, messageTexts, createdAts]);
    } catch (error) {
      throw error;
    }
  }

  async editMessage(editMessageDto: EditMessageDto) {
    const { edited_at, message, id } = editMessageDto;

    const query = `
      UPDATE messages
      SET edited_at = $1, message = $2
      WHERE id = $3
    `;

    try {
      await this.dbService.query(query, [edited_at, message, id]);
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(messageId: number) {
    const query = `DELETE FROM messages WHERE id = $1`;

    try {
      await this.dbService.query(query, [messageId]);
    } catch (error) {
      throw error;
    }
  }

  async bulkSeenUpdate(messageIds: number[]) {
    const query = `
      UPDATE messages
      SET seen = TRUE
      WHERE id = ANY($1);
    `;

    try {
      await this.dbService.query(query, [messageIds]);
    } catch (error) {
      throw error;
    }
  }
}
