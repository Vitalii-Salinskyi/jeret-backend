import { Module } from "@nestjs/common";

import { DatabaseModule } from "src/database/database.module";
import { StorageModule } from "src/storage/storage.module";

import { MessagesService } from "./messages.service";
import { FilesService } from "./files.service";

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [MessagesService, FilesService],
  exports: [MessagesService, FilesService],
})
export class MessagesModule {}
