import {
  Inject,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

export interface ConnectedUser {
  client_id: string;
}

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {}
  private redisClient: RedisClientType;

  async onModuleInit() {
    this.redisClient = createClient({
      url: this.configService.get<string>('REDIS_URL'),
    });
    this.redisClient.on('error', (err) =>
      console.error('Redis Client Error', err),
    );
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async get(key: string): Promise<string[]> {
    // sMembers trả về tất cả thành viên của một Set
    return this.redisClient.sMembers(key);
  }

  async set(key: string, value: string): Promise<void> {
    // sAdd thêm một hoặc nhiều thành viên vào Set.
    // Thao tác này an toàn, không bị race condition.
    await this.redisClient.sAdd(key, value);
  }

  async delete(key: string, value: string): Promise<void> {
    // sRem xóa một hoặc nhiều thành viên khỏi Set.
    await this.redisClient.sRem(key, value);
  }
}
