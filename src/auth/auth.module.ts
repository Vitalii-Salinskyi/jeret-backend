import { forwardRef, Module } from "@nestjs/common";

import { DatabaseModule } from "src/database/database.module";
import { SessionsModule } from "src/sessions/sessions.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";

import { GoogleAuthController } from "./google-auth.controller";
import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { GoogleAuthService } from "./google-auth.service";
import { TokenService } from "./token.service";

@Module({
  imports: [forwardRef(() => UsersModule), DatabaseModule, JwtModule, SessionsModule],
  controllers: [AuthController, GoogleAuthController],
  providers: [GoogleAuthService, AuthService, TokenService],
  exports: [TokenService],
})
export class AuthModule {}
