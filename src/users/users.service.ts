import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";

import { UpdateUserDto } from "./dtos/upadte-user.dto";

import { IUser, JobRolesEnum, UserSortType } from "src/interfaces/users";
import { PaginationParams, PaginationResponse, CountResult } from "src/interfaces";

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async findUserByEmail(email: string): Promise<IUser[]> {
    const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";

    try {
      const result = await this.dbService.query<IUser>(query, [email]);

      return result.rows;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, userId: number) {
    const { isEmpty, updatedParts, updatedValues } = this.dbService.constructUpdateObject(updateUserDto);

    if (isEmpty) return;

    const query = `UPDATE users SET ${updatedParts.join(", ")} WHERE id = ${userId}`;

    try {
      const result = await this.dbService.query(query, updatedValues);

      if (result.rowCount === 0) {
        throw new NotFoundException("User not found.");
      }
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  async getUserProfile(userId: number): Promise<Partial<IUser>> {
    const query = `SELECT * FROM users WHERE id = ${userId}`;

    try {
      const result = await this.dbService.query(query);

      if (!result.rows[0]) throw new NotFoundException("User not found.");

      const { password: _password, google_id: _google_id, ...user } = result.rows[0] as IUser;

      return user;
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  async filterUsers(
    userId: number,
    category?: JobRolesEnum,
    sortBy?: UserSortType,
    input?: string,
    { page = 1, limit = 10 }: PaginationParams = {},
  ): Promise<PaginationResponse<IUser>> {
    const conditions: string[] = ["is_deleted = $1", "profile_completed = $2"];
    const parameters: any[] = [false, true];

    parameters.push(userId);
    conditions.push(`id != $${parameters.length}`);

    if (category) {
      parameters.push(category);
      conditions.push(`job_role = $${parameters.length}`);
    }

    if (input) {
      parameters.push(`%${input}%`);
      conditions.push(`name ILIKE $${parameters.length}`);
    }

    const baseQuery = `FROM users ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}`;

    const { offset, total } = await this.dbService.getPaginationMetadata(baseQuery, parameters, {
      page,
      limit,
    });

    const query = `SELECT created_at, tasks_completed, review_count, rating, job_role, profile_picture, description, name, email, id ${baseQuery}    
      ${sortBy ? `ORDER BY ${sortBy} DESC` : ""}
      LIMIT $${parameters.length + 1}
      OFFSET $${parameters.length + 2}
    `;

    try {
      const queryParameters = [...parameters, limit, offset];

      const result = await this.dbService.query(query, queryParameters);

      return {
        data: result.rows as IUser[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  async getRecentUser(userId: number, limit: number = 8): Promise<IUser[]> {
    const query = `SELECT created_at, tasks_completed, review_count, rating, job_role, profile_picture, name, id
      FROM users
      WHERE id != $1 AND profile_completed = TRUE
      ORDER BY created_at DESC
      LIMIT $2`;

    try {
      const result = await this.dbService.query(query, [userId, limit]);

      return result.rows as IUser[];
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) throw error;

      throw new InternalServerErrorException(error);
    }
  }
}
