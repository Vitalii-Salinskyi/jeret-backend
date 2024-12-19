import { Module } from "@nestjs/common";

import { UsersController } from "./users.controller";

import { DatabaseService } from "src/database/database.service";
import { UsersService } from "./users.service";
import { TokenService } from "src/auth/token.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [UsersController],
  providers: [UsersService, DatabaseService, JwtService, TokenService],
  exports: [UsersService],
})
export class UsersModule {}
