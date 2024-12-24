import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import Redis from "ioredis";

import { RedisService } from "src/database/redis.service";

import { UserStatusType } from "src/interfaces/users";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class UsersGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;
  private readonly redisClient: Redis;
  private readonly ONLINE_EXPIRY = 20;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = redisService.getRawClient();
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.auth.userId;

    if (!userId) {
      client.disconnect();
      return;
    }

    await this.setUserOnline(userId);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.auth.userId;

    if (!userId) return;

    await this.setUserOffline(userId);
  }

  @SubscribeMessage("status:heartbeat")
  async checkUserStatus(@ConnectedSocket() client: Socket, @MessageBody() userId: number) {
    if (client.handshake.auth.userId !== userId) {
      return { error: "Unauthorized" };
    }

    await this.setUserOnline(userId);
  }

  @SubscribeMessage("status:single")
  async getSingleUserStatus(@MessageBody() userId: number): Promise<UserStatusType> {
    if (!userId) {
      return { [userId]: "offline" };
    }

    const status = await this.getUserStatus(userId);

    return { [userId]: status ? "online" : "offline" };
  }

  @SubscribeMessage("status:bulk")
  async getBulkUserStatus(@MessageBody() userIds: number[]): Promise<UserStatusType> {
    if (userIds.length === 0) return {};

    const keys = userIds.map((id) => `user:${id}:status`);

    const statuses = await this.redisClient.mget(keys);

    const result: UserStatusType = {};

    userIds.forEach((userId, index) => {
      result[userId] = statuses[index] ? "online" : "offline";
    });

    return result;
  }

  private async setUserOnline(userId: number) {
    await this.redisClient.setex(`user:${userId}:status`, this.ONLINE_EXPIRY, "online");
  }

  private async setUserOffline(userId: number) {
    await this.redisClient.del(`user:${userId}:status`);
  }

  private async getUserStatus(userId: number) {
    return await this.redisClient.get(`user:${userId}:status`);
  }
}
