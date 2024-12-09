import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GoogleAuthController } from "./google-auth.controller";
import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { GoogleAuthService } from "./google-auth.service";
import { UsersService } from "src/users/users.service";
import { DatabaseService } from "src/database/database.service";
import { TokenService } from "./token.service";
import { JwtService } from "@nestjs/jwt";
import { SessionsService } from "src/sessions/sessions.service";

@Module({
  controllers: [AuthController, GoogleAuthController],
  providers: [
    AuthService,
    DatabaseService,
    GoogleAuthService,
    ConfigService,
    UsersService,
    TokenService,
    JwtService,
    SessionsService,
  ],
})
export class AuthModule {}
