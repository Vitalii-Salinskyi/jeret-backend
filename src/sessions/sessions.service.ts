import { Injectable } from "@nestjs/common";

import { CreateSessionDto } from "./dtos/create-session.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class SessionsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createSession(userId: number, createSessionDto: CreateSessionDto) {
    const query = `
        INSERT INTO sessions (user_id, ip_address, device, location, expires_at)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
    `;

    const now = new Date();
    now.setDate(now.getDate() + 30);

    const values = [
      userId,
      createSessionDto.ip_address,
      createSessionDto.device,
      createSessionDto.location,
      now,
    ];

    try {
      const result = await this.dbService.query<{ id: number }>(query, values);

      return result.rows[0].id;
    } catch (error) {
      throw error;
    }
  }
}
