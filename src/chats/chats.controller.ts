import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";

import { AuthGuard } from "src/auth/auth.guard";

import { ChatsService } from "./chats.service";

@Controller("chats")
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUsersChats(@Req() req: Request) {
    const user = req["user"];

    return this.chatService.getUsersChats(user.id);
  }

  @UseGuards(AuthGuard)
  @Get(":chatId")
  async getChatMessage(@Param("chatId") chatId: number) {
    return await this.chatService.getChatMessages(chatId);
  }
}
