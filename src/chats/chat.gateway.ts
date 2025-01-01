import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import Redis from "ioredis";
import { Server, Socket } from "socket.io";

import { MessagesService } from "src/messages/messages.service";
import { DatabaseService } from "src/database/database.service";
import { RedisService } from "src/database/redis.service";

import { UpdateInboxMessageDto } from "src/messages/dtos/update-inbox-message.dto";
import { SaveMessageDto } from "src/messages/dtos/save-message.dto";

import { ClientMessage } from "src/interfaces/chats";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;
  private readonly redisClient: Redis;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly redisService: RedisService,
    private readonly dbService: DatabaseService,
  ) {
    this.redisClient = this.redisService.getRawClient();
  }

  @SubscribeMessage("inbox:join")
  async joinInbox(@ConnectedSocket() socket: Socket, @MessageBody() userId: number) {
    await socket.join(`inbox_${userId}`);
  }

  @SubscribeMessage("inbox:leave")
  async leaveInbox(@ConnectedSocket() socket: Socket, @MessageBody() userId: number) {
    await socket.leave(`inbox_${userId}`);
  }

  @SubscribeMessage("inbox:send:message")
  async handleUpdateInboxMessage(@MessageBody() updateInboxMessageDto: UpdateInboxMessageDto) {
    this.server
      .to(`inbox_${updateInboxMessageDto.receiver_id}`)
      .emit("inbox:receive:message", updateInboxMessageDto);
  }

  @SubscribeMessage("chat:join")
  async joinChat(@ConnectedSocket() socket: Socket, @MessageBody() chatId: number) {
    await socket.join(`chat_${chatId}`);
  }

  @SubscribeMessage("chat:leave")
  async leaveChat(@ConnectedSocket() socket: Socket, @MessageBody() chatId: number) {
    await socket.leave(`chat_${chatId}`);
  }

  @SubscribeMessage("chat:get:next-message-id")
  async getNextMessageId() {
    return this.dbService.getNextId("messages");
  }

  @SubscribeMessage("chat:send:message")
  async handleSendMessage(@MessageBody() saveMessageDto: SaveMessageDto) {
    this.server.to(`chat_${saveMessageDto.chat_id}`).emit("chat:receive:message", saveMessageDto);

    await this.messagesService.saveMessage(saveMessageDto);
  }

  @SubscribeMessage("chat:update:messages:seen")
  async updateMessagesSeen(
    @MessageBody()
    data: {
      messages: ClientMessage[];
      receiverId: number;
      chatId: number;
    },
  ) {
    const { chatId, messages, receiverId } = data;

    this.server
      .to(`inbox_${receiverId}`)
      .emit("inbox:message:seen:update", { incomingMessages: messages, chatId });

    const messageIds = messages.map((m) => m.id);

    await this.messagesService.bulkSeenUpdate(messageIds);
  }
}
