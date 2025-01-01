import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
