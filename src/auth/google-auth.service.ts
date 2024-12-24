import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from "axios";

import { SessionsService } from "src/sessions/sessions.service";
import { UsersService } from "src/users/users.service";
import { TokenService } from "./token.service";
import { AuthService } from "./auth.service";

import { RegisterUserDto } from "./dtos/register-user.dto";

import { IUser } from "src/interfaces/users";

@Injectable()
export class GoogleAuthService {
  private readonly googleClientId: string;
  private readonly googleClientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly sessionsService: SessionsService,
  ) {
    this.googleClientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
    this.googleClientSecret = this.configService.get<string>("GOOGLE_CLIENT_SECRET");
    this.redirectUri = this.configService.get<string>("GOOGLE_REDIRECT_URL");
  }

  async getGoogleAccessToken(authorizationCode: string) {
    const tokenUrl = new URL("https://oauth2.googleapis.com/token");

    tokenUrl.searchParams.append("code", authorizationCode);
    tokenUrl.searchParams.append("client_id", this.googleClientId);
    tokenUrl.searchParams.append("client_secret", this.googleClientSecret);
    tokenUrl.searchParams.append("redirect_uri", this.redirectUri);
    tokenUrl.searchParams.append("grant_type", "authorization_code");

    try {
      const response = await axios.post(tokenUrl.toString(), null, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException("The Google token is invalid or expired. Please log in again.", error);
    }
  }

  private async getUserProfile(accessToken: string) {
    const url = "https://www.googleapis.com/oauth2/v2/userinfo";

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  async googleCallback(code: string, lat: number, long: number, device: string, ip_address: string) {
    try {
      const tokenData = await this.getGoogleAccessToken(JSON.parse(code));
      const {
        email,
        name,
        picture: profile_picture,
        id: google_id,
      } = await this.getUserProfile(tokenData.access_token);

      const registerUserDto: RegisterUserDto = {
        email,
        name,
        profile_picture,
        google_id,
      };

      const candidate = await this.userService.findUserByEmail(email);
      let user: IUser | undefined;

      if (candidate[0] && candidate[0].google_id === google_id) {
        user = candidate[0];
      } else {
        user = await this.authService.registerUser(registerUserDto);
      }

      const sessionId = await this.sessionsService.createSession(user.id, {
        lat,
        long,
        device,
        ip_address,
      });

      const accessToken = this.tokenService.generateAccessToken(user);
      const refreshToken = this.tokenService.generateRefreshToken(user, sessionId);

      debugger;

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
