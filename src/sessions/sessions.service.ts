import { Injectable } from "@nestjs/common";
import axios from "axios";

import { CreateSessionDto } from "./dtos/create-session.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class SessionsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createSession(userId: number, createSessionDto: CreateSessionDto): Promise<number> {
    const query = `
        INSERT INTO sessions (user_id, ip_address, device, location, expires_at)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
    `;

    const now = new Date();
    now.setDate(now.getDate() + 30);

    try {
      const location = await this.getUserLocation(createSessionDto.lat, createSessionDto.long);
      const values = [userId, createSessionDto.ip_address, createSessionDto.device, location, now];

      const result = await this.dbService.query<{ id: number }>(query, values);

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
}
