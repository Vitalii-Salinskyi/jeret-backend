import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { PoolClient } from "pg";
import axios from "axios";

import { DatabaseService } from "src/database/database.service";

import { CreateSessionDto } from "./dtos/create-session.dto";

@Injectable()
export class SessionsService {
  constructor(private readonly dbService: DatabaseService) {}

  async validateSession(sessionId: number) {
    const query = `SELECT * FROM sessions WHERE id = $1 AND expires_at > NOW()`;

    try {
      const result = await this.dbService.query(query, [sessionId]);

      return !!result.rows.length;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createSession(
    userId: number,
    createSessionDto: CreateSessionDto,
    client?: PoolClient,
  ): Promise<number> {
    const query = `
        INSERT INTO sessions (user_id, ip_address, device, location, expires_at)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
    `;

    const now = new Date();
    now.setDate(now.getDate() + 30);

    try {
      const location = await this.getUserLocation(createSessionDto.lat, createSessionDto.long);
      const values = [userId, createSessionDto.ip_address, createSessionDto.device, location, now];

      const result = client
        ? await client.query<{ id: number }>(query, values)
        : await this.dbService.query<{ id: number }>(query, values);

      return result.rows[0].id;
    } catch (error) {
      throw error;
    }
  }

  private async getUserLocation(lat: number, long: number) {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&accept-language=en`,
      );

      const { city, town, village, country } = res.data.address;
      const residence = (city ?? town ?? village) + `, ${country}`;

      return residence;
    } catch (error) {
      throw error;
    }
  }

  async removeSession(sessionId: number, client?: PoolClient) {
    const query = `DELETE FROM sessions WHERE id = $1`;

    try {
      const result = client
        ? await client.query<{ id: number }>(query, [sessionId])
        : await this.dbService.query(query, [sessionId]);

      if (result.rowCount === 0) {
        throw new NotFoundException("Session not found or already deleted");
      }
    } catch (error) {
      throw error;
    }
  }
}
