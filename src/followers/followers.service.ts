import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";

import { DatabaseException } from "src/exceptions/database.exception";

import { PaginationParams, PaginationResponse } from "src/interfaces";

import { followType, IFollowUser } from "src/interfaces/users";

@Injectable()
export class FollowersService {
  constructor(private readonly dbService: DatabaseService) {}

  async followUser(userId: number, following_id: number) {
    if (userId === following_id) throw new BadRequestException("You cannot follow yourself");

    const query = `INSERT INTO followers (following_id, follower_id) VALUES($1, $2)`;

    try {
      await this.dbService.query(query, [following_id, userId]);
    } catch (error) {
      if (error instanceof DatabaseException) {
        const dbError = error.getResponse();

        if (dbError.constraints === "followers_pkey") {
          error.setMessage("You already follow that user");
        }
      }

      throw error;
    }
  }

  async unfollowUser(userId: number, following_id: number) {
    if (userId === following_id) return;

    const query = `DELETE FROM followers WHERE following_id = $1 AND follower_id = $2`;

    try {
      await this.dbService.query(query, [following_id, userId]);
    } catch (error) {
      throw error;
    }
  }

  async getBulkFollowStatus(userId: number, targetUserIds: number[]) {
    const query = `SELECT following_id as id FROM followers WHERE follower_id = $1 AND following_id = ANY($2::int[])`;

    try {
      const { rows } = await this.dbService.query(query, [userId, targetUserIds]);

      const followStatusMap = targetUserIds.reduce((acc, userId) => {
        acc[userId] = false;
        return acc;
      }, {});

      rows.forEach((row: { id: number }) => {
        followStatusMap[row.id] = true;
      });

      return followStatusMap;
    } catch (error) {
      throw error;
    }
  }

  async getFollows(
    userId: number,
    type: followType = "followers",
    { page = 1, limit = 20 }: PaginationParams = {},
  ): Promise<PaginationResponse<IFollowUser>> {
    const parameters: any[] = [userId];

    try {
      const followClause = `${type === "followers" ? "following_id" : "follower_id"}`;

      const countQuery = `FROM followers WHERE ${followClause} = $1`;

      const { offset, total, totalPages } = await this.dbService.getPaginationMetadata(
        countQuery,
        parameters,
        {
          page,
          limit,
        },
      );

      if (page > totalPages) {
        return {
          data: [],
          total,
          page,
          limit,
          totalPages,
        };
      }

      parameters.push(limit);
      parameters.push(offset);

      const query = `
        SELECT u.id, u.name, u.email, u.profile_picture, u.job_role, u.description FROM followers f
        INNER JOIN users u ON f.${type === "followers" ? "follower_id" : "following_id"} = u.id
        WHERE f.${followClause} = $1
        LIMIT $2
        OFFSET $3
      `;

      const { rows } = await this.dbService.query<IFollowUser>(query, parameters);

      return {
        data: rows,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }
}
