import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";

import { DatabaseException } from "src/exceptions/database.exception";

import { UpdateUserDto } from "./dtos/upadte-user.dto";

import { PaginationParams, PaginationResponse } from "src/interfaces";
import { IUser, JobRolesEnum, UserSortType } from "src/interfaces/users";

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async findUserByEmail(email: string): Promise<IUser[]> {
    const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";

    try {
      const result = await this.dbService.query<IUser>(query, [email]);

      return result.rows;
    } catch (error) {
      throw new error();
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, userId: number) {
    const { isEmpty, updatedParts, updatedValues } = this.dbService.constructUpdateObject(updateUserDto);

    if (isEmpty) return;

    updatedValues.push(userId);
    const query = `UPDATE users SET ${updatedParts.join(", ")} WHERE id = $${updatedValues.length}`;

    try {
      const result = await this.dbService.query(query, updatedValues);

      if (result.rowCount === 0) {
        throw new NotFoundException("User not found.");
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId: number): Promise<Partial<IUser>> {
    const query = `
      SELECT id, name, email, profile_picture, description, job_role, profile_completed, tasks_completed, tasks_pending, is_online, followers_count, followed, rating, review_count, created_at
      FROM users WHERE id = $1 AND is_deleted = FALSE
    `;

    try {
      const result = await this.dbService.query(query, [userId]);

      if (!result.rows[0]) throw new NotFoundException("User not found.");

      return result.rows[0];
    } catch (error) {
      throw error;
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

    try {
      const baseQuery = `FROM users ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}`;

      const { offset, total } = await this.dbService.getPaginationMetadata(baseQuery, parameters, {
        page,
        limit,
      });

      const query = `
        SELECT created_at, tasks_completed, review_count, rating, job_role, profile_picture, description, name, email, id
        ${baseQuery}    
        ${sortBy ? `ORDER BY ${sortBy} DESC` : ""}
        LIMIT $${parameters.length + 1}
        OFFSET $${parameters.length + 2}
      `;

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
      if (error instanceof DatabaseException) {
        const dbError = error.getResponse();

        if (dbError.code === "22P02") {
          error.setMessage(`${category} is not a valid jor role`);
        } else if (dbError.code === "42703") {
          error.setMessage(`${sortBy} is not a valid sort option`);
        }

        error.setStatusCode(HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }

  async getRecentUser(userId: number, limit: number = 8): Promise<IUser[]> {
    const query = `
      SELECT created_at, tasks_completed, review_count, rating, job_role, profile_picture, name, id
      FROM users
      WHERE id != $1 AND profile_completed = TRUE
      ORDER BY created_at DESC
      LIMIT $2
      `;

    try {
      const result = await this.dbService.query(query, [userId, limit]);

      return result.rows as IUser[];
    } catch (error) {
      throw error;
    }
  }
}
