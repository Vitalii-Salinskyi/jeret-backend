import { Injectable, InternalServerErrorException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { IUser } from "src/interfaces/users";

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
}
