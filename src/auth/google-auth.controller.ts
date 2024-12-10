import { Controller, Get, ParseFloatPipe, Query, Redirect } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GoogleAuthService } from "./google-auth.service";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { TokenService } from "./token.service";

import { RegisterUserDto } from "./dtos/register-user.dto";

import { IUser } from "src/interfaces/users";
import { SessionsService } from "src/sessions/sessions.service";

@Controller("auth/google")
export class GoogleAuthController {
  private readonly googleClientId: string;
  private readonly redirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly sessionsService: SessionsService,
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
    try {
      const tokenData = await this.googleAuthService.getGoogleAccessToken(JSON.parse(code));
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

      const candidate = await this.userService.findUserByEmail(email);
      let user: IUser | undefined;

      if (candidate[0] && candidate[0].google_id === google_id) {
        user = candidate[0];
      } else {
        user = await this.authService.registerUser(registerUserDto);
      }

      const sessionId = await this.sessionsService.createSession(user.id, {
        lat: lat,
        long: long,
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
