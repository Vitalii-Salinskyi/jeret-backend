import { Controller, Get, ParseFloatPipe, Query, Redirect } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GoogleAuthService } from "./google-auth.service";

@Controller("auth/google")
export class GoogleAuthController {
  private readonly googleClientId: string;
  private readonly redirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
  ) {
    this.googleClientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
    this.redirectUri = this.configService.get<string>("GOOGLE_REDIRECT_URL");
  }

  @Get()
  @Redirect()
  redirectToGoogle() {
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

    googleAuthUrl.searchParams.append("client_id", this.googleClientId);
    googleAuthUrl.searchParams.append("redirect_uri", this.redirectUri);
    googleAuthUrl.searchParams.append("response_type", "code");
    googleAuthUrl.searchParams.append("scope", "email profile");

    return {
      url: googleAuthUrl,
    };
  }

  @Get("callback")
  async googleCallback(
    @Query("code") code: string,
    @Query("lat", ParseFloatPipe) lat: number,
    @Query("long", ParseFloatPipe) long: number,
    @Query("device") device: string,
    @Query("ip_address") ip_address: string,
  ) {
    return this.googleAuthService.googleCallback(code, lat, long, device, ip_address);
  }
}
