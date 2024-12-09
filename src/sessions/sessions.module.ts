import { Module } from "@nestjs/common";

import { SessionsController } from "./sessions.controller";

import { SessionsService } from "./sessions.service";
import { DatabaseService } from "src/database/database.service";

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, DatabaseService],
})
export class SessionsModule {}
