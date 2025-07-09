import { Inject, Injectable } from '@nestjs/common';
import { Cacheable } from 'cacheable';

export interface ConnectedUser {
  client_id: string;
}

@Injectable()
export class CacheService {
  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {}

  async get(key: string): Promise<ConnectedUser[] | []> {
    return (await this.cache.get(key)) || [];
  }

  async set(key: string, value: any): Promise<any> {
    // Lấy ra danh sách client_id của user_id
    // Nếu chưa có khởi tạo bằng []
    const userList: ConnectedUser[] = (await this.cache.get(key)) || [];
    userList.push({ client_id: value });
    return await this.cache.set(key, userList);
  }

  async delete(key: string, value: string): Promise<any> {
    const userList: ConnectedUser[] | undefined = await this.cache.get(key);
    // Nếu không tồn tại
    if (!userList) {
      return;
    }
    // Nếu user chỉ kết nối 1 thiết bị
    if (userList.length === 1) {
      this.cache.delete(key);
    }
    // Nếu user kết nối nhiều thiết bị
    const newUserList = userList.filter(
      (connectedUser) => connectedUser.client_id !== value,
    );
    await this.cache.set(key, newUserList);
  }
}
