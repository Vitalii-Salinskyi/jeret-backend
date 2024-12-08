import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { genSalt, hash, compare } from "bcrypt";

import { DatabaseService } from "src/database/database.service";
import { UsersService } from "src/users/users.service";
import { TokenService } from "./token.service";

import { RegisterUserDto } from "src/auth/dtos/register-user.dto";
import { LoginDto } from "./dtos/login.dto";

import { IUser } from "src/interfaces/users";

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<IUser> {
    const { name, email, profile_picture, google_id, password } = registerUserDto;

    if (!google_id && !password) throw new BadRequestException("Either password or google id is required!");

    const query = `
        INSERT INTO users (name, email, profile_picture, password, google_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;

    try {
      const hashedPassword = password?.length ? await this.hashPassword(password) : null;

      const values = [name, email, profile_picture, hashedPassword, google_id || null];

      const result = await this.dbService.query(query, values);

      return result.rows[0] as IUser;
    } catch (error) {
      if (
        error.message ===
        'Database query failed: duplicate key value violates unique constraint "users_email_key"'
      ) {
        throw new ConflictException(`User with email: ${email} already exist`);
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const candidate = await this.userService.findUserByEmail(loginDto.email);

      if (!candidate.length) {
        throw new NotFoundException(`User with email: ${loginDto.email} doesn't exist`);
      }

      if (!candidate[0].password && candidate[0].google_id) {
        throw new ConflictException(
          `User with email: ${loginDto.email} was registered via Google and does not have a password associated with this account.`,
        );
      }

      const isCorrectPassword = await compare(loginDto.password, candidate[0].password);

      if (!isCorrectPassword) {
        throw new UnauthorizedException("Invalid password");
      }

      const accessToken = this.tokenService.generateAccessToken(candidate[0]);
      const refreshToken = this.tokenService.generateRefreshToken(candidate[0], "mock_session_id");

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  private async hashPassword(password: string) {
    const salt = await genSalt(10);
    return hash(password, salt);
  }
}
