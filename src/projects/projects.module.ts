import { Module } from "@nestjs/common";

import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";

import { ProjectsController } from "./projects.controller";

import { ProjectsService } from "./projects.service";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
