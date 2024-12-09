import { Controller, Get, InternalServerErrorException, Query, Redirect } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GoogleAuthService } from "./google-auth.service";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { TokenService } from "./token.service";

import { RegisterUserDto } from "./dtos/register-user.dto";

import { IUser } from "src/interfaces/users";

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
      const tokenData = await this.googleAuthService.getGoogleAccessToken(code);
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

      const accessToken = this.tokenService.generateAccessToken(user);
      const refreshToken = this.tokenService.generateRefreshToken(user, 3);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
