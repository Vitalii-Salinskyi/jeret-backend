import { Module } from "@nestjs/common";

import { UsersController } from "./users.controller";

import { DatabaseService } from "src/database/database.service";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, DatabaseService],
  exports: [UsersService],
})
export class UsersModule {}
