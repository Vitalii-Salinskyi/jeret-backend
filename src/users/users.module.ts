import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";

import { UsersController } from "./users.controller";

import { UsersService } from "./users.service";
import { UsersGateway } from "./user.gateway";

@Module({
  imports: [forwardRef(() => AuthModule), DatabaseModule, JwtModule],
  controllers: [UsersController],
  providers: [UsersService, UsersGateway],
  exports: [UsersService],
})
export class UsersModule {}
