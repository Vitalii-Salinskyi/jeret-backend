import { Module } from "@nestjs/common";

import { StorageController } from "./storage.controller";

import { DatabaseModule } from "src/database/database.module";
import { StorageService } from "./storage.service";

@Module({
  imports: [DatabaseModule],
  providers: [StorageService],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
