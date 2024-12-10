import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from "axios";

@Injectable()
export class GoogleAuthService {
  private readonly googleClientId: string;
  private readonly googleClientSecret: string;
  private readonly redirectUri: string;

  constructor(private readonly configService: ConfigService) {
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

  async getUserProfile(accessToken: string) {
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
}
