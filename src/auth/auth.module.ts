import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GoogleAuthService } from "./google-auth.service";
import { UsersService } from "src/users/users.service";
import { DatabaseService } from "src/database/database.service";
import { GoogleAuthController } from "./google-auth.controller";

@Module({
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, DatabaseService, GoogleAuthService, ConfigService, UsersService],
})
export class AuthModule {}
