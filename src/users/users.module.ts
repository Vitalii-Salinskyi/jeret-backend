import { Module } from "@nestjs/common";

import { UsersController } from "./users.controller";

import { DatabaseService } from "src/database/database.service";
import { UsersService } from "./users.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [UsersController],
  providers: [UsersService, DatabaseService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
