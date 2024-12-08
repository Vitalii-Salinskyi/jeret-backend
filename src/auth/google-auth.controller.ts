import { Controller, Get, InternalServerErrorException, Query, Redirect } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GoogleAuthService } from "./google-auth.service";
import { AuthService } from "./auth.service";

import { RegisterUserDto } from "./dtos/register-user.dto";
import { UsersService } from "src/users/users.service";

@Controller("auth/google")
export class GoogleAuthController {
  private readonly googleClientId: string;
  private readonly redirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
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
  async googleCallback(@Query("code") code: string) {
    try {
      const tokenData = await this.googleAuthService.getAccessToken(code);
      const {
        email,
        name,
        picture: profile_picture,
        id: google_id,
      } = await this.googleAuthService.getUserProfile(tokenData.access_token);

      const registerUserDto: RegisterUserDto = {
        email,
        name,
        profile_picture,
        google_id,
      };

      return;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
