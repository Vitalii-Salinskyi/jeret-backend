import { Module } from "@nestjs/common";
import { FollowersService } from "./followers.service";
import { FollowersController } from "./followers.controller";
import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [FollowersController],
  providers: [FollowersService],
})
export class FollowersModule {}
