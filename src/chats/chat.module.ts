import { Module } from "@nestjs/common";

import { DatabaseModule } from "src/database/database.module";
import { MessagesModule } from "src/messages/messages.module";
import { AuthModule } from "src/auth/auth.module";

import { ChatsController } from "./chats.controller";

import { ChatsService } from "./chats.service";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [DatabaseModule, AuthModule, MessagesModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatGateway],
})
export class ChatsModule {}
