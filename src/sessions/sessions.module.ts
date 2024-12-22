import { Module } from "@nestjs/common";

import { DatabaseModule } from "src/database/database.module";

import { SessionsController } from "./sessions.controller";

import { SessionsService } from "./sessions.service";

@Module({
  imports: [DatabaseModule],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
