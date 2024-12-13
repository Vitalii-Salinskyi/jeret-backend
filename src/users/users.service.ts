import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";

import { IUser } from "src/interfaces/users";
import { UpdateUserDto } from "./dtos/upadte-user.dto";

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
}
