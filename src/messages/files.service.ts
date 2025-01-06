import { Injectable } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { StorageService } from "src/storage/storage.service";

import { PoolClient } from "pg";

import { IFile, IFileDto } from "src/interfaces/chats";

@Injectable()
export class FilesService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly storageService: StorageService,
  ) {}

  async createFileRecords(files: IFileDto[], senderId: number, messageId: number, client?: PoolClient) {
    const query = `
      INSERT INTO files (id, sender_id, message_id, file_name, file_type, file_size, s3_path, uploaded_at)
      OVERRIDING SYSTEM VALUE
      SELECT * FROM UNNEST($1::int[], $2::int[], $3::int[], $4::text[], $5::text[], $6::int[], $7::text[], $8::timestamp[]);
    `;

    const ids = files.map((file) => file.id);
    const filenames = files.map((file) => file.file_name);
    const fileTypes = files.map((file) => file.file_type);
    const sizes = files.map((file) => file.file_size);
    const s3Paths = files.map((file) => file.s3_path);
    const uploadedAts = files.map((file) => file.uploaded_at);

    const parameters = [
      ids,
      Array(files.length).fill(senderId),
      Array(files.length).fill(messageId),
      filenames,
      fileTypes,
      sizes,
      s3Paths,
      uploadedAts,
    ];

    const uploadPromises = files.map((file) => this.storageService.upload(file.s3_path, file.buffer));

    try {
      await Promise.all([
        uploadPromises,
        client ? client.query(query, parameters) : this.dbService.query(query, parameters),
      ]);
    } catch (error) {
      throw error;
    }
  }
}
