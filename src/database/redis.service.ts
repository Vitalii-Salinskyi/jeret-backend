import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(RedisService.name);
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    });
  }

  onModuleInit() {
    this.logger.log("Redis connection initialized");
  }

  getRawClient(): Redis {
    return this.redis;
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
